package main

import (
	"bytes"
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/tmc/langchaingo/llms"
	"github.com/tmc/langchaingo/llms/ollama"
)

type CodeBlockParser struct {
	channel                  chan []byte
	processedChunks          int
	removedStartingBackticks bool
	removedLanguageName      bool
	removedEndingBackticks   bool
}

func NewCodeBlockParser() *CodeBlockParser {
	return &CodeBlockParser{
		channel:                  make(chan []byte),
		processedChunks:          0,
		removedStartingBackticks: false,
		removedLanguageName:      false,
		removedEndingBackticks:   false,
	}
}

func (p *CodeBlockParser) ParseStream(chunk []byte, language string) {
	if !p.removedStartingBackticks {
		if bytes.Contains(chunk, []byte("```")) {
			p.removedStartingBackticks = true
			chunk = nil
		}
	}

	if !p.removedLanguageName && p.removedStartingBackticks && p.processedChunks <= 3 {
		if strings.Contains(language, string(chunk)) {
			chunk = nil
		}

		if string(chunk) == "\n" {
			chunk = nil
			p.removedLanguageName = true
		}
	}

	if p.removedStartingBackticks && !p.removedEndingBackticks {
		if bytes.Contains(chunk, []byte("```")) {
			chunk = nil
			p.removedEndingBackticks = true
		}
	}

	if p.removedEndingBackticks {
		chunk = nil
	}

	p.processedChunks += 1
	p.channel <- chunk
}

func main() {
	err := godotenv.Load()

	if err != nil {
		log.Fatal("Error loading environment!")
	}

	LLM_MODEL := os.Getenv("LLM_MODEL")
	PORT := os.Getenv("PORT")

	if len(LLM_MODEL) == 0 {
		log.Fatal("No LLM model specified in environment!")
	}

	if len(PORT) == 0 {
		PORT = "8080"
	}

	ech := echo.New()

	ech.Use(middleware.CORS())
	ech.GET("/generate", func(ctx echo.Context) error {
		lines, err := strconv.Atoi(ctx.QueryParam("lines"))

		if err != nil {
			return ctx.String(http.StatusBadRequest, "Lines param is not provided or incorrect!")
		}

		lang := ctx.QueryParam("lang")

		if lang == "" {
			return ctx.String(http.StatusBadRequest, "Lang param is not provided or incorrect!")
		}

		ctx.Response().Header().Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
		ctx.Response().WriteHeader(http.StatusOK)

		llm, err := ollama.New(ollama.WithModel(fmt.Sprintf("%s", LLM_MODEL)))

		if err != nil {
			log.Fatal(err)
		}

		parser := NewCodeBlockParser()
		ollamaCtx := context.Background()
		prompt := []llms.MessageContent{
			llms.TextParts(llms.ChatMessageTypeHuman, fmt.Sprintf(`
				You must only generate code without any descriptions or code comments or formatting like markdown code fences with backticks. Use spaces instead of tabs for spacing. Generate accurately according to the number of lines you get provided. Generate exactly between %d and %d lines of code from a well known open source project in the %s programming language.`, lines/2, lines, lang)),
		}

		if _, err := llm.GenerateContent(ollamaCtx, prompt, llms.WithStreamingFunc(func(streamCtx context.Context, chunk []byte) error {
			go parser.ParseStream(chunk, lang)

			select {
			case cleaned := <-parser.channel:
				if len(cleaned) > 0 {
					ctx.Response().Write(cleaned)
					ctx.Response().Flush()
				}
			}

			return nil
		})); err != nil {
			log.Fatal(err)
			return ctx.String(http.StatusInternalServerError, err.Error())
		}

		defer close(parser.channel)
		return nil
	})

	ech.Logger.Fatal(ech.Start(fmt.Sprintf(":%s", PORT)))
}
