package main

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"touch-programming.hazemkrimi.tech/internal/handlers"
)

func main() {
	err := godotenv.Load()

	if err != nil {
		log.Fatal("Error loading environment!")
	}

	PORT := os.Getenv("PORT")

	if len(PORT) == 0 {
		PORT = "8080"
	}

	ech := echo.New()

	ech.Use(middleware.CORS())
	ech.GET("/generate", handlers.Generate)
	ech.Logger.Fatal(ech.Start(fmt.Sprintf(":%s", PORT)))
}
