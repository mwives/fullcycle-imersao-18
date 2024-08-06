package usecase

import "github.com/mwives/fullcycle-imersao-18/golang-ticket-selling/internal/events/domain"

type ListSpotsInputDTO struct {
	EventID string `json:"event_id"`
}

type ListSpotsOutputDTO struct {
	Event EventDTO  `json:"event"`
	Spots []SpotDTO `json:"spots"`
}

type ListSpotsUseCase struct {
	repo domain.EventRepository
}

func NewListSpotsUseCase(repo domain.EventRepository) *ListSpotsUseCase {
	return &ListSpotsUseCase{
		repo: repo,
	}
}

func (uc *ListSpotsUseCase) Execute(input ListSpotsInputDTO) (*ListSpotsOutputDTO, error) {
	event, err := uc.repo.FindEventByID(input.EventID)
	if err != nil {
		return nil, err
	}

	spots, err := uc.repo.FindSpotsByEventID(event.ID)
	if err != nil {
		return nil, err
	}

	spotsDTO := make([]SpotDTO, len(spots))
	for i, spot := range spots {
		spotsDTO[i] = SpotDTO{
			ID:       spot.ID,
			EventID:  spot.EventID,
			Status:   string(spot.Status),
			TicketID: spot.TicketID,
		}
	}

	eventDTO := EventDTO{
		ID:           event.ID,
		Name:         event.Name,
		Location:     event.Location,
		Organization: event.Organization,
		Rating:       string(event.Rating),
		Date:         event.Date.Format("2006-01-02 15:04:05"),
		ImageURL:     event.ImageURL,
		Capacity:     event.Capacity,
		Price:        event.Price,
		PartnerID:    event.PartnerID,
	}

	return &ListSpotsOutputDTO{
		Event: eventDTO,
		Spots: spotsDTO,
	}, nil
}
