package datastruct

type GetServiceAvailableResponse struct {
	Up        int32 `json:"up"`
	Down      int32 `json:"down"`
	TotalWeb  int32 `json:"totalWeb"`
	TotalTime int32 `json:"totalTime"`
}
