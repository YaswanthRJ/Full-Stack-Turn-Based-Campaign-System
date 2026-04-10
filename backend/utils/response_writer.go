package utils

import (
	"encoding/json"
	"net/http"
)

// writeJSON is a tiny helper that sets Content-Type and encodes to JSON.
func WriteJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}
