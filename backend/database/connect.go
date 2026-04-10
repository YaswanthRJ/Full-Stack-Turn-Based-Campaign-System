package database

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

func Connection(dsn string) (*sql.DB, error) {
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, fmt.Errorf("database donnection failed %w", err)
	}
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("ping failed %w", err)
	}
	return db, nil
}
