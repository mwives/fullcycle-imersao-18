package usecase

import "github.com/mwives/fullcycle-imersao-18/golang-ticket-selling/internal/events/domain"

type GetEventInputDTO struct {
	ID string
}

type GetEventOutputDTO struct {
	ID           string  `json:"id"`
	Name         string  `json:"name"`
	Location     string  `json:"location"`
	Organization string  `json:"organization"`
	Rating       string  `json:"rating"`
	Date         string  `json:"date"`
	ImageURL     string  `json:"image_url"`
	Capacity     int     `json:"capacity"`
	Price        float64 `json:"price"`
	PartnerID    int     `json:"partner_id"`
}

type GetEventUseCase struct {
	repo domain.EventRepository
}

func NewGetEventUseCase(repo domain.EventRepository) *GetEventUseCase {
	return &GetEventUseCase{
		repo: repo,
	}
}

func (uc *GetEventUseCase) Execute(input GetEventInputDTO) (*GetEventOutputDTO, error) {
	events, err := uc.repo.FindEventByID(input.ID)
	if err != nil {
		return nil, err
	}

	return &GetEventOutputDTO{
		ID:           events.ID,
		Name:         events.Name,
		Location:     events.Location,
		Organization: events.Organization,
		Rating:       string(events.Rating),
		Date:         events.Date.Format("2006-01-02 15:04:05"),
		ImageURL:     events.ImageURL,
		Capacity:     events.Capacity,
		Price:        events.Price,
		PartnerID:    events.PartnerID,
	}, nil
}
