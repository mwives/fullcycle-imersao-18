package http

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/mwives/fullcycle-imersao-18/golang-ticket-selling/internal/events/usecase"
)

type EventsHandler struct {
	listEventsUseCase *usecase.ListEventsUseCase
	listSpotsUseCase  *usecase.ListSpotsUseCase
	getEventUseCase   *usecase.GetEventUseCase
	buyTicketsUseCase *usecase.BuyTicketsUseCase
}

func NewEventHandler(
	listEventsUseCase *usecase.ListEventsUseCase,
	listSpotsUseCase *usecase.ListSpotsUseCase,
	getEventUseCase *usecase.GetEventUseCase,
	buyTicketsUseCase *usecase.BuyTicketsUseCase,
) *EventsHandler {
	return &EventsHandler{
		listEventsUseCase: listEventsUseCase,
		listSpotsUseCase:  listSpotsUseCase,
		getEventUseCase:   getEventUseCase,
		buyTicketsUseCase: buyTicketsUseCase,
	}
}

func ErrorHandler(fn func(http.ResponseWriter, *http.Request) error) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if err := fn(w, r); err != nil {
			log.Printf("Error: %v\n", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	}
}

func (h *EventsHandler) ListEvents(w http.ResponseWriter, r *http.Request) error {
	output, err := h.listEventsUseCase.Execute()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	return json.NewEncoder(w).Encode(output)
}

func (h *EventsHandler) ListSpots(w http.ResponseWriter, r *http.Request) error {
	eventID := r.PathValue("eventID")
	input := usecase.ListSpotsInputDTO{
		EventID: eventID,
	}

	output, err := h.listSpotsUseCase.Execute(input)
	if err != nil {
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	return json.NewEncoder(w).Encode(output)
}

func (h *EventsHandler) GetEvent(w http.ResponseWriter, r *http.Request) error {
	eventID := r.PathValue("eventID")
	input := usecase.GetEventInputDTO{
		ID: eventID,
	}

	output, err := h.getEventUseCase.Execute(input)
	if err != nil {
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	return json.NewEncoder(w).Encode(output)
}

func (h *EventsHandler) BuyTickets(w http.ResponseWriter, r *http.Request) error {
	var input usecase.BuyTicketsInputDTO
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return nil
	}

	output, err := h.buyTicketsUseCase.Execute(input)
	if err != nil {
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	return json.NewEncoder(w).Encode(output)
}
