package handlers

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"

	"github.com/labstack/echo/v4"
	"github.com/tmc/langchaingo/llms"
	"github.com/tmc/langchaingo/llms/ollama"
)

type ErrorMaxLinesReached struct{}

func (err *ErrorMaxLinesReached) Error() string {
	return fmt.Sprintf("Reached maximum lines configured!")
}

type CodeBlockParser struct {
	wg               sync.WaitGroup
	channel          chan []byte
	language         string
	maxLines         int
	currentLines     int
	backticksRemoved int
}

func NewCodeBlockParser(lang string, lines int) *CodeBlockParser {
	return &CodeBlockParser{
		channel:          make(chan []byte),
		language:         lang,
		maxLines:         lines,
		currentLines:     0,
		backticksRemoved: 0,
	}
}

func (parser *CodeBlockParser) ParseStream(chunk []byte, cancelCtx context.CancelFunc) {
	defer parser.wg.Done()

	text := string(chunk)

	// TODO: After getting the project up and running optimize this to take into account for example open brackets or function ending statements that will be closed after the max lines gets reached.
	if !strings.Contains(parser.language, text) && !strings.Contains(text, "```") && !strings.Contains(text, "``") {
		if parser.currentLines == 0 && parser.backticksRemoved > 0 && text == "\n" {
			parser.channel <- nil
			return
		}

		if strings.Contains(text, "\n") {
			parser.currentLines++
		}

		if parser.currentLines == parser.maxLines-1 {
			indexOfNewLine := strings.Index(text, "\n")

			if indexOfNewLine > -1 {
				parser.channel <- []byte(text[:indexOfNewLine])
			} else {
				parser.channel <- nil
			}
		} else if parser.currentLines >= parser.maxLines {
			cancelCtx()
		} else {
			parser.channel <- chunk
		}
	} else {
		parser.channel <- nil
		parser.backticksRemoved++
	}
}

func Generate(ctx echo.Context) error {
	LLM_MODEL := os.Getenv("LLM_MODEL")

	if len(LLM_MODEL) == 0 {
		return ctx.String(http.StatusInternalServerError, "No LLM model specified in environment!")
	}

	MAX_LINES, err := strconv.Atoi(os.Getenv("MAX_LINES"))

	if err != nil {
		return ctx.String(http.StatusInternalServerError, "Error setting max lines!")
	}

	lang := ctx.QueryParam("lang")

	if len(lang) == 0 {
		return ctx.String(http.StatusBadRequest, "Lang param is incorrect!")
	}

	llm, err := ollama.New(ollama.WithModel(LLM_MODEL))

	if err != nil {
		log.Println(err)
		return ctx.String(http.StatusInternalServerError, "Error initializing LLM!")
	}

	parser := NewCodeBlockParser(lang, MAX_LINES)
	ollamaCtx, cancelOllamaCtx := context.WithCancel(context.Background())
	prompt := []llms.MessageContent{
		llms.TextParts(llms.ChatMessageTypeHuman, fmt.Sprintf(`
				You must only generate code without any text descriptions or code comments and use spaces instead of tabs for spacing. Generate a maximum of %d lines of code from a well known open source project in the %s programming language.`, MAX_LINES, lang)),
	}

	ctx.Response().WriteHeader(http.StatusOK)

	_, err = llm.GenerateContent(ollamaCtx, prompt, llms.WithStreamingFunc(func(streamCtx context.Context, chunk []byte) error {
		parser.wg.Add(1)
		go parser.ParseStream(chunk, cancelOllamaCtx)

		select {
		case chunk, ok := <-parser.channel:
			if ok && len(chunk) > 0 {
				ctx.Response().Write(chunk)
				ctx.Response().Flush()
			}
		case <-ollamaCtx.Done():
			return &ErrorMaxLinesReached{}
		}

		return nil
	}))

	parser.wg.Wait()
	defer close(parser.channel)

	if err != nil {
		if _, ok := err.(*ErrorMaxLinesReached); ok {
			return nil
		}

		return ctx.String(http.StatusInternalServerError, "Error generating code: " + err.Error())
	}

	return nil
}
