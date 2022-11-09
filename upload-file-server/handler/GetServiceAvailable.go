package handler

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"upload-file-server/datastruct"

	"github.com/go-redis/redis"
)

var GetServiceAvailableResponse datastruct.GetServiceAvailableResponse

func GetServiceAvailable(c *gin.Context) {
	c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
	c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
	c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
	c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

	userId := c.Param("userId")
	var res datastruct.GetServiceAvailableResponse

	res = getDataFromCache(userId)
	fmt.Println(res)

	if res == (datastruct.GetServiceAvailableResponse{}) {
		c.JSON(http.StatusNotFound, gin.H{"status": "Not Found",
			"message": "No user id found",
			"data":    nil})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "Success",
		"message": "Get service availability successfully",
		"data":    res})
}

func getDataFromCache(userId string) datastruct.GetServiceAvailableResponse {
	fmt.Println("user id: " + userId)
	client := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})

	value, err := client.Get(userId).Result()
	fmt.Println("value from cache : " + value)
	if err != nil {
		fmt.Println(err)
	}

	var response datastruct.GetServiceAvailableResponse
	json.Unmarshal([]byte(value), &response)
	return response
}
