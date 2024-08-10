package main

import (
	"database/sql"
	"net/http"

	httpHandler "github.com/mwives/fullcycle-imersao-18/golang-ticket-selling/internal/events/infra/http"
	"github.com/mwives/fullcycle-imersao-18/golang-ticket-selling/internal/events/infra/repository"
	"github.com/mwives/fullcycle-imersao-18/golang-ticket-selling/internal/events/infra/service"
	"github.com/mwives/fullcycle-imersao-18/golang-ticket-selling/internal/events/usecase"
)

func main() {
	db, err := sql.Open("mysql", "docker:docker@tcp(golang_mysql:3306)/tickets_db")
	if err != nil {
		panic(err)
	}
	defer db.Close()

	eventRepo, err := repository.NewMysqlEventRepository(db)
	if err != nil {
		panic(err)
	}

	partnerBaseURLs := map[int]string{
		1: "http://localhost:8081/api-1",
		2: "http://localhost:8081/api-2",
	}
	partnerFactory := service.NewPartnerFactory(partnerBaseURLs)

	listEventsUseCase := usecase.NewListEventsUseCase(eventRepo)
	getEventUseCase := usecase.NewGetEventUseCase(eventRepo)
	listSpotsUseCase := usecase.NewListSpotsUseCase(eventRepo)
	buyTicketsUseCase := usecase.NewBuyTicketsUseCase(eventRepo, partnerFactory)

	eventsHandler := httpHandler.NewEventHandler(
		listEventsUseCase,
		listSpotsUseCase,
		getEventUseCase,
		buyTicketsUseCase,
	)

	r := http.NewServeMux()
	r.HandleFunc("/events", eventsHandler.ListEvents)
	r.HandleFunc("/events/{eventID}", eventsHandler.GetEvent)
	r.HandleFunc("/events/{eventID}/spots", eventsHandler.ListSpots)
	r.HandleFunc("POST /checkout", eventsHandler.BuyTickets)

	http.ListenAndServe(":8080", r)
}
