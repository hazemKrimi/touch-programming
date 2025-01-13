package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"github.com/tmc/langchaingo/llms"
	"github.com/tmc/langchaingo/llms/ollama"
)

func main() {
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

		llm, err := ollama.New(ollama.WithModel("llama3.1:8b"))

		if err != nil {
			log.Fatal(err)
		}

		ollamaCtx := context.Background()
		content := []llms.MessageContent{
			llms.TextParts(llms.ChatMessageTypeSystem, `You are only a code generator. You must not respond with anything else but code and do not format with code fences.`),
			llms.TextParts(llms.ChatMessageTypeHuman, fmt.Sprintf(`
				Generate max %d lines of code without any unncessary formatting from a well known open source project in the %s programming language. First line should always be a code comment in this format: Language/Project`, lines, lang)),
		}

		if _, err := llm.GenerateContent(ollamaCtx, content, llms.WithStreamingFunc(func(streamCtx context.Context, chunk []byte) error {
			ctx.Response().Write(chunk)
			ctx.Response().Flush()
			return nil
		})); err != nil {
			log.Fatal(err)
			return ctx.String(http.StatusInternalServerError, err.Error())
		}

		return nil
	})

	ech.Logger.Fatal(ech.Start(":5000"))
}
