package main

import (
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
	channel      chan []byte
	language     string
	maxLines     int
	currentLines int
}

func NewCodeBlockParser(lang string, lines int) *CodeBlockParser {
	return &CodeBlockParser{
		channel:      make(chan []byte),
		language:     lang,
		maxLines:     lines,
		currentLines: 0,
	}
}

func (parser *CodeBlockParser) ParseStream(chunk []byte) {
	text := string(chunk)

	if !strings.Contains(parser.language, text) && !strings.Contains(text, "```") && !strings.Contains(text, "``") {
		if strings.Contains(text, "\n") {
			parser.currentLines += 1
		}

		if parser.currentLines == parser.maxLines-1 {
			indexOfNewLine := strings.Index(text, "\n")

			if indexOfNewLine > -1 {
				parser.channel <- []byte(text[:indexOfNewLine])
				return
			}

			parser.channel <- nil
			return
		}

		if parser.currentLines >= parser.maxLines {
			parser.channel <- nil
			return
		}

		parser.channel <- chunk
		return
	} else {
		parser.channel <- nil
		return
	}
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

		parser := NewCodeBlockParser(lang, lines)
		ollamaCtx := context.Background()
		prompt := []llms.MessageContent{
			llms.TextParts(llms.ChatMessageTypeHuman, fmt.Sprintf(`
				You must only generate code without any descriptions or code comments and use spaces instead of tabs for spacing. Generate a maximum of %d lines of code from a well known open source project in the %s programming language.`, lines, lang)),
		}

		if _, err := llm.GenerateContent(ollamaCtx, prompt, llms.WithStreamingFunc(func(streamCtx context.Context, chunk []byte) error {
			go parser.ParseStream(chunk)

			select {
			case chunk := <-parser.channel:
				if len(chunk) > 0 {
					ctx.Response().Write(chunk)
					ctx.Response().Flush()
				}

				if parser.currentLines == parser.maxLines {
					cnx, _, err := ctx.Response().Hijack()

					if err != nil {
						log.Fatal(err)
						return ctx.String(http.StatusInternalServerError, err.Error())
					}

					cnx.Close()
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
