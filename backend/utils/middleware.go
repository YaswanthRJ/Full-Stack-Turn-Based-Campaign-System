package utils

import (
	"context"
	"net/http"

	"github.com/google/uuid"
)

type contextKey string

const userIDKey contextKey = "userID"

func GameMiddlewareMux(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userID := r.Header.Get("X-User-ID")
		if userID == "" {
			http.Error(w, "Unauthorized: missing user ID", http.StatusUnauthorized)
			return
		}
		parsedID, err := uuid.Parse(userID)
		if err != nil {
			http.Error(w, "Invalid user ID format", http.StatusBadRequest)
			return
		}
		ctx := context.WithValue(r.Context(), userIDKey, parsedID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func GetUserID(ctx context.Context) (string, bool) {
	id, ok := ctx.Value(userIDKey).(string)
	return id, ok
}
