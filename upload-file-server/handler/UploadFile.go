package handler

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"mime/multipart"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"

	"upload-file-server/datastruct"

	"github.com/go-redis/redis"
)

type Form struct {
	File *multipart.FileHeader `form:"file" binding:"required"`
}

func UploadFile(c *gin.Context) {

	c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
	c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
	c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
	c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

	start := time.Now()

	file, _ := c.FormFile("file")

	openedFile, _ := file.Open()

	fileBytes, err := ioutil.ReadAll(openedFile)
	if err != nil {
		log.Fatal(err)
		c.JSON(http.StatusInternalServerError, gin.H{"status": "Error",
			"message": "Upload file failed", "data": nil})
		return
	}

	s := string(fileBytes[:])
	web := strings.Split(s, "\n")

	var up = 0

	for i := range web {
		w := web[i]
		var b bytes.Buffer
		if w[0:4] != "http" {
			b.WriteString("https://")
			b.WriteString(web[i])
			web[i] = b.String()
		}
		fmt.Println(web[i])

		response, _ := http.Get(strings.ReplaceAll(web[i], "\r", ""))

		if response != nil {
			if response.StatusCode == 200 {
				up++
			}
		}
	}

	elapse := time.Since(start)

	var response datastruct.FileUploadResponse

	response.UserId = c.PostForm("userId")

	response.Progress = 100

	cache(response.UserId, int32(up), int32(len(web)), int32(elapse.Seconds()))

	c.JSON(http.StatusOK, gin.H{"status": "Success",
		"message": "Upload file successfully", "data": response})
}

func cache(userId string, up int32, totalWeb int32, totalTime int32) {
	client := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})

	var getServiceAvailableResponse datastruct.GetServiceAvailableResponse
	getServiceAvailableResponse.Up = up
	getServiceAvailableResponse.Down = totalWeb - up
	getServiceAvailableResponse.TotalWeb = totalWeb
	getServiceAvailableResponse.TotalTime = totalTime

	fmt.Println(getServiceAvailableResponse)

	res, _ := json.Marshal(getServiceAvailableResponse)

	err := client.Set(userId, res, 0).Err()
	if err != nil {
		fmt.Println(err)
	}
}
