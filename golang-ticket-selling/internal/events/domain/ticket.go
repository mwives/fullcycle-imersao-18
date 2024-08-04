package domain

import "errors"

type TicketType string

var (
	ErrTicketPriceZero = errors.New("ticket price must be greater than 0")
)

const (
	TicketTypeHalf TicketType = "half" // Half-price ticket
	TicketTypeFull TicketType = "full" // Full-price ticket
)

type Ticket struct {
	ID         string
	EventID    string
	Spot       *Spot
	TicketType TicketType
	Price      float64
}

func IsValidTicketType(ticketType TicketType) bool {
	return ticketType == TicketTypeHalf || ticketType == TicketTypeFull
}

func (t *Ticket) CalculatePrice() {
	if t.TicketType == TicketTypeHalf {
		t.Price /= 2
	}
}

func (t *Ticket) Validate() error {
	if t.Price <= 0 {
		return ErrTicketPriceZero
	}
	return nil
}
