FROM golang:1.22.6-alpine3.20

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download
RUN go mod verify

COPY . .

WORKDIR /app/cmd/events

RUN go build -o main /app/cmd/events/main.go

EXPOSE 8080

CMD ["/app/cmd/events/main"]
