package domain

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID        primitive.ObjectID `bson:"_id"`
	UserId    string             `bson:"userId"`
	Email     string             `bson:"email"`
	FirstName string             `bson:"firstName"`
	LastName  string             `bson:"lastName"`
}
