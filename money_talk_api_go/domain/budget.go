package domain

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Budget struct {
	ID             primitive.ObjectID `bson:"_id"`
	UserID         string             `bson:"userId"`
	CategoryId     string             `bson:"categoryId"`
	Amount         int                `bson:"amount"`
	Period         string             `bson:"period"`
	AlertThreshold int                `bson:"alertThreshold"`
}
