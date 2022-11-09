FROM golang:1.19-alpine

RUN mkdir /app
ADD . /app
WORKDIR /app
COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY *.go ./

RUN go mod tidy

RUN go build -o /upload-file-server

EXPOSE 8080

CMD [ "/upload-file-server" ]