package usecase

import (
	"github.com/mwives/fullcycle-imersao-18/golang-ticket-selling/internal/events/domain"
	"github.com/mwives/fullcycle-imersao-18/golang-ticket-selling/internal/events/infra/service"
)

type BuyTicketsInputDTO struct {
	EventID    string   `json:"event_id"`
	Spots      []string `json:"spots"`
	TicketKind string   `json:"ticket_kind"`
	CardHash   string   `json:"card_hash"`
	Email      string   `json:"email"`
}

type BuyTicketsOutputDTO struct {
	Tickets []TicketDTO `json:"tickets"`
}

type BuyTicketsUseCase struct {
	repo           domain.EventRepository
	partnerFactory service.PartnerFactory
}

func NewBuyTicketsUseCase(repo domain.EventRepository, partnerFactory service.PartnerFactory) *BuyTicketsUseCase {
	return &BuyTicketsUseCase{
		repo:           repo,
		partnerFactory: partnerFactory,
	}
}

func (uc *BuyTicketsUseCase) Execute(input BuyTicketsInputDTO) (*BuyTicketsOutputDTO, error) {
	event, err := uc.repo.FindEventByID(input.EventID)
	if err != nil {
		return nil, err
	}

	partnerService, err := uc.partnerFactory.CreatePartner(event.PartnerID)
	if err != nil {
		return nil, err
	}

	req := &service.ReservationRequest{
		EventID:    input.EventID,
		Spots:      input.Spots,
		TicketKind: input.TicketKind,
		CardHash:   input.CardHash,
		Email:      input.Email,
	}
	reservationResponse, err := partnerService.MakeReservation(req)
	if err != nil {
		return nil, err
	}

	tickets := make([]domain.Ticket, len(reservationResponse))
	for i, reservation := range reservationResponse {
		spot, err := uc.repo.FindSpotByName(event.ID, reservation.Spot)
		if err != nil {
			return nil, err
		}

		ticket, err := domain.NewTicket(event, spot, domain.TicketKind(reservation.TicketKind))
		if err != nil {
			return nil, err
		}

		if err := uc.repo.CreateTicket(ticket); err != nil {
			return nil, err
		}

		spot.Reserve(ticket.ID)
		if err := uc.repo.ReserveSpot(spot.ID, ticket.ID); err != nil {
			return nil, err
		}
		tickets[i] = *ticket
	}

	ticketsDTO := make([]TicketDTO, len(tickets))
	for i, ticket := range tickets {
		ticketsDTO[i] = TicketDTO{
			ID:         ticket.ID,
			SpotID:     ticket.Spot.ID,
			TicketKind: string(ticket.TicketKind),
			Price:      ticket.Price,
		}
	}

	return &BuyTicketsOutputDTO{Tickets: ticketsDTO}, nil
}
