package main

import (
	"github.com/aezule/money_talk_Go/transactions"
	"github.com/gin-gonic/gin"
)

func whenServerStarting() {
	println("Connected to MongoDB!")

	println("-----------------------------")
	println("Starting server on port 8080...")
	println("-----------------------------")

	println("Available endpoints:")
	println("GET /transactions - Get all transactions")
	println("GET /transactions/:id - Get a transaction by ID")
	println("-----------------------------")

}

func main() {
	r := gin.Default()

	whenServerStarting()

	r.GET("/transactions", transactions.GetTransactions)
	r.GET("/transactions/:id", transactions.GetTransactionByID)
	r.Run(":8080")
}
