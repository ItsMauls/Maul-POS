package main

import (
	"context"
	"github.com/apotek-pbf/monorepo-pbf/auth-service/cmd/rest"
	"github.com/apotek-pbf/monorepo-pbf/auth-service/internal/model"
	"github.com/apotek-pbf/monorepo-pbf/auth-service/internal/use_case"
	"github.com/apotek-pbf/monorepo-pbf/lib"
	"log"
	"sync"
)

func main() {
	cfg := lib.LoadConfigByFile("./cmd", "config", "yml")
	log.Printf("App name: %s", cfg.App.Name)

	db, err := lib.NewPostgresqlConnection(cfg.Database)
	if err != nil {
		log.Fatal(err)
	}

	defer db.Close()

	_, redisPool := lib.InitRedis(cfg.Redis)
	logger := lib.NewAggregateLogger(cfg.App)

	wg := new(sync.WaitGroup)
	wg.Add(1)

	go func() {
		ctx := context.Background()
		authRepository := model.NewAuthRepository(logger, cfg, db, redisPool)
		authService := use_case.NewService(cfg, logger, authRepository)
		requestHandler := rest.NewHandler(authService)

		err := rest.Run(ctx, *cfg, requestHandler)
		if err != nil {
			log.Fatal(err)
		}

		wg.Done()
	}()

	wg.Wait()
}
