package transactions

import (
	"context"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"

	"github.com/aezule/money_talk_Go/domain"
	mongoConnect "github.com/aezule/money_talk_Go/repository/mongo"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var database *mongo.Database
var transactionCollection *mongo.Collection

func GetTransactions(c *gin.Context) {
	client, err := mongoConnect.ConnectToMongoDB()
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(context.Background())
	database = client.Database("moneytalks")
	transactionCollection = database.Collection("transactions")
	filter := bson.D{}
	cursor, err := transactionCollection.Find(context.TODO(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve transactions"})
		return
	}
	defer cursor.Close(context.TODO())

	var transactions []domain.Transaction
	if err := cursor.All(context.TODO(), &transactions); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve transactions"})
		return
	}

	c.IndentedJSON(http.StatusOK, transactions)
}

func GetTransactionByID(c *gin.Context) {
	client, err := mongoConnect.ConnectToMongoDB()
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(context.Background())
	database = client.Database("moneytalks")
	transactionCollection = database.Collection("transactions")
	id := c.Param("id")
	objID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid transaction ID"})
		return
	}
	var transaction domain.Transaction

	err = transactionCollection.FindOne(context.TODO(), bson.M{"_id": objID}).Decode(&transaction)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve transaction"})
		return
	}
	c.IndentedJSON(http.StatusOK, transaction)
}
