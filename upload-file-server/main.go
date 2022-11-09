package main

import (
	"upload-file-server/handler"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	router.MaxMultipartMemory = 10 << 20 //10MB maximum for file uploading

	router.GET("/service/available/:userId", handler.GetServiceAvailable)
	router.POST("/file/upload", handler.UploadFile)

	router.Run()
}
