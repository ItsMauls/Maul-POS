package lib

import (
	"log"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

// const postgresqlDriver = "postgres"

func NewPostgresqlConnection(cfg DatabaseConfig) (*sqlx.DB, error) {
	dbConnection, err := sqlx.Connect(postgresqlDriver, cfg.DSN)
	if err != nil {
		log.Printf("Failed to connect to database: %v", err)
		log.Printf("DSN: %s", cfg.DSN)
		return nil, err
	}

	dbConnection.SetMaxIdleConns(cfg.MaxIdleConnections)
	dbConnection.SetMaxOpenConns(cfg.MaxOpenConnections)
	dbConnection.SetConnMaxIdleTime(cfg.MaxIdleDuration)
	dbConnection.SetConnMaxLifetime(cfg.MaxLifeTimeDuration)

	return dbConnection, nil
}
