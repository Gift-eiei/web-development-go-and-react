package datastruct

type FileUploadResponse struct {
	UserId   string `json:"userId"`
	Progress int32  `json:"progress"`
}
