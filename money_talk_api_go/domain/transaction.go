package domain

import (
	"time"
)

type Transaction struct {
	ID          string    `json:"id"          bson:"id"`
	UserID      string    `json:"userId"      bson:"userId"`
	CategoryID  *string   `json:"categoryId"  bson:"categoryId"`
	Amount      int64     `json:"amount"      bson:"amount"`
	Type        string    `json:"type"        bson:"type"`
	Date        time.Time `json:"date"        bson:"date"`
	Description string    `json:"description" bson:"description"`
	IsRecurring bool      `json:"isRecurring" bson:"isRecurring"`
	CreatedAt   time.Time `json:"createdAt"   bson:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"   bson:"updatedAt"`
}
