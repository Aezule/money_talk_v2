package transactions

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
)

func setupRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	r := gin.New()
	r.GET("/transactions", GetTransactions)
	r.GET("/transactions/:id", GetTransactionByID)
	return r
}

func TestGetTransactionByID_Invalid(t *testing.T) {
	cases := []string{"aaaaa", "123", "zzzzzzzzzz", "zzzzzzzzzzzzzzzzzzzzzzzz"}
	for _, id := range cases {
		t.Run(id, func(t *testing.T) {
			w := httptest.NewRecorder()
			req := httptest.NewRequest(http.MethodGet, "/transactions/"+id, nil)
			setupRouter().ServeHTTP(w, req)

			if w.Code != http.StatusBadRequest {
				t.Fatalf("attendu 400, reçu: %d", w.Code)
			}
		})
	}
}

func TestGetTransaction(t *testing.T) {
	w := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/transactions", nil)

	setupRouter().ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("attendu 200 mais reçu %d - body: %s", w.Code, w.Body.String())
	}

	var body []map[string]any
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatalf("Ce n'est pas un tableau json %v - body: %s", err, w.Body.String())
	}
}

func TestGetTransactionByID_Valid(t *testing.T) {
	var id = "6ae352026d8d526402e487b5"
	w := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/transactions/"+id, nil)
	setupRouter().ServeHTTP(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("200 n'est pas retourné: %d", w.Code)
	}

	var body map[string]any
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatalf("Ce n'est pas un json %v - body: %s", err, w.Body.String())
	}
}
