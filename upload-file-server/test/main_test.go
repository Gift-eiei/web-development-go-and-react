package main

import (
	"io/ioutil"
	"net/http"
	"net/http/httptest"
	"testing"
	"upload-file-server/handler"

	"github.com/stretchr/testify/assert"

	"github.com/gin-gonic/gin"
)

func TestGetServiceAvailableHandlerOnSucces(t *testing.T) {
	mockResponse := `{"message":"Get service availability successfully"}`

	gin.SetMode(gin.TestMode)
	router := gin.New()

	w := httptest.NewRecorder()

	ctx, _ := gin.CreateTestContext(httptest.NewRecorder())

	ctx.Set("userId", 1234)

	router.GET("/", handler.GetServiceAvailable)
	request, _ := http.NewRequest("GET", "/service/available/:userId", nil)

	router.ServeHTTP(w, request)

	responseData, _ := ioutil.ReadAll(w.Body)
	assert.Equal(t, mockResponse, string(responseData))
	assert.Equal(t, ctx.Writer.Status(), w.Code)
}
