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
		log.Fatal("Error loading environment: ", err.Error())
	}

	PORT := os.Getenv("PORT")
	SSL_CERT_PATH := os.Getenv("SSL_CERT_PATH")
	SSL_KEY_PATH := os.Getenv("SSL_KEY_PATH")

	ech := echo.New()

	ech.Use(middleware.CORS())

	ech.GET("/generate", handlers.Generate)

	if len(SSL_CERT_PATH) == 0 || len(SSL_KEY_PATH) == 0 {
		if len(PORT) == 0 {
			PORT = "8080"
		}

		ech.Logger.Fatal(ech.Start(fmt.Sprintf(":%s", PORT)))
	} else {
		if len(PORT) == 0 {
			PORT = "4443"
		}

		ech.Logger.Fatal(ech.StartTLS(fmt.Sprintf(":%s", PORT), SSL_CERT_PATH, SSL_KEY_PATH))
	}
}
