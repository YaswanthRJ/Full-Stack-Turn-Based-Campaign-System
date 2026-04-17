package service

type CreateActionInput struct {
	Name         string
	Description  string
	Multiplier   float64
	Type         string
	Tag          string
	Accuracy     float64
	ActionWeight float64
}

type UpdateActionInput struct {
	Name         string
	Description  string
	Type         string
	Multiplier   float64
	Tag          string
	Accuracy     float64
	ActionWeight float64
}
