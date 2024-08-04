package domain

import (
	"errors"
	"time"
)

var (
	ErrEventNameRequired = errors.New("event name is required")
	ErrEventDatePast     = errors.New("event date must be in the future")
	ErrEventCapacity     = errors.New("event capacity must be greater than 0")
	ErrEventPriceZero    = errors.New("event price must be greater than 0")
)

type Rating string

const (
	RatingGeneral Rating = "G"
	Rating10      Rating = "PG-10"
	Rating12      Rating = "PG-12"
	Rating14      Rating = "PG-14"
	Rating16      Rating = "PG-16"
	Rating18      Rating = "R"
)

type Event struct {
	ID           string
	Name         string
	Location     string
	Organization string
	Rating       Rating
	Date         time.Time
	ImageURL     string
	Capacity     int
	Price        float64
	PartnerID    int
	Spots        []Spot
	Tickets      []Ticket
}

func (e Event) Validate() error {
	if e.Name == "" {
		return ErrEventNameRequired
	}
	if e.Date.Before(time.Now()) {
		return ErrEventDatePast
	}
	if e.Capacity <= 0 {
		return ErrEventCapacity
	}
	if e.Price <= 0 {
		return ErrEventPriceZero
	}
	return nil
}

func (e *Event) AddSpot(name string) (*Spot, error) {
	spot, err := NewSpot(e, name)
	if err != nil {
		return nil, err
	}
	e.Spots = append(e.Spots, *spot)
	return spot, nil
}
