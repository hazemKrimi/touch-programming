package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/tmc/langchaingo/llms"
	"github.com/tmc/langchaingo/llms/ollama"
)

type GeneratedCode struct {
	Code     string
	Source   string
	Language string
}

func main() {
	ech := echo.New()

	ech.GET("/generate", func(ctx echo.Context) error {
		llm, err := ollama.New(ollama.WithModel("llama3.1:8b"))

		if err != nil {
			log.Fatal(err)
		}

		ollamaCtx := context.Background()
		content := []llms.MessageContent{
			llms.TextParts(llms.ChatMessageTypeHuman, `
				Generate 5 lines of code using a well known open source project
				in the JavaScript programming language. I would like the result to be in
				JSON format with the following keys: code for source code, source for project name and language for the used language.
			`),
		}

		generated, err := llm.GenerateContent(ollamaCtx, content, llms.WithJSONMode())

		var generatedCode GeneratedCode

		error := json.Unmarshal([]byte(generated.Choices[0].Content), &generatedCode)

		if error != nil {
			log.Fatal(error)
		}

		return ctx.JSON(http.StatusOK,
			generatedCode,
		)
	})

	ech.Logger.Fatal(ech.Start(":5000"))
}
