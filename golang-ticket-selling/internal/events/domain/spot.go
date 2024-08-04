package domain

import (
	"errors"
)

var (
	ErrInvalidSpotName            = errors.New("invalid spot name")
	ErrorSpotNameTooShort         = errors.New("spot name must be at least 2 characters long")
	ErrSpotNameNotUppercase       = errors.New("spot name must start with an uppercase letter")
	ErrSpotNameSecondCharNotDigit = errors.New("spot name second character must be a digit")
	ErrInvalidSpotNumber          = errors.New("invalid spot number")
	ErrSpotNotFound               = errors.New("spot not found")
	ErrSpotAlreadyReserved        = errors.New("spot already reserved")
)

type SpotStatus string

const (
	SpotStatusAvailable SpotStatus = "available"
	SpotStatusSold      SpotStatus = "sold"
)

type Spot struct {
	ID       string
	EventId  string
	Name     string
	Status   SpotStatus
	TicketId string
}
