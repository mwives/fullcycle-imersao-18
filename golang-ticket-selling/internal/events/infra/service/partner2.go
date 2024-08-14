package service

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

type Partner2 struct {
	BaseURL string
}

type Partner2ReservationRequest struct {
	Lugares      []string `json:"lugares"`
	TipoIngresso string   `json:"tipoIngresso"`
	Email        string   `json:"email"`
}

type Partner2ReservationResponse struct {
	ID           string `json:"id"`
	Email        string `json:"email"`
	Lugar        string `json:"lugar"`
	TipoIngresso string `json:"tipoIngresso"`
	Status       string `json:"status"`
	EventID      string `json:"event_id"`
}

func (p *Partner2) MakeReservation(req *ReservationRequest) ([]ReservationResponse, error) {
	partnerReq := Partner2ReservationRequest{
		Lugares:      req.Spots,
		TipoIngresso: req.TicketKind,
		Email:        req.Email,
	}

	body, err := json.Marshal(partnerReq)
	if err != nil {
		return nil, err
	}

	url := fmt.Sprintf("%s/eventos/%s/reservar", p.BaseURL, req.EventID)
	httpReq, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}
	httpReq.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	httpRes, err := client.Do(httpReq)
	if err != nil {
		return nil, err
	}
	defer httpRes.Body.Close()

	if httpRes.StatusCode != http.StatusCreated {
		return nil, fmt.Errorf("unexpected status code: %d", httpRes.StatusCode)
	}

	var partnerRes []Partner2ReservationResponse
	if err := json.NewDecoder(httpRes.Body).Decode(&partnerRes); err != nil {
		return nil, err
	}

	res := make([]ReservationResponse, len(partnerRes))
	for i, r := range partnerRes {
		res[i] = ReservationResponse{
			ID:     r.ID,
			Spot:   r.Lugar,
			Status: r.Status,
		}
	}

	return res, nil
}
