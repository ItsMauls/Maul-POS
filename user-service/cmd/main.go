package main

import (
	"context"
	"log"
	"sync"

	"github.com/apotek-pbf/monorepo-pbf/lib"
	"github.com/apotek-pbf/monorepo-pbf/user-service/cmd/rest"
	"github.com/apotek-pbf/monorepo-pbf/user-service/internal/use_case"
)

func main() {
	cfg := lib.LoadConfigByFile("./cmd", "config", "yml")
	log.Printf("App name: %s", cfg.App.Name)

	db, err := lib.NewConnectionManager(cfg.Database)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	wg := new(sync.WaitGroup)
	wg.Add(1)

	logger := lib.NewAggregateLogger(cfg.App)

	go func() {
		ctx := context.Background()

		userService := use_case.NewService(db, logger)
		requestHandler := rest.NewHandler(cfg, userService)

		err := rest.Run(ctx, *cfg, requestHandler)
		if err != nil {
			log.Fatal(err)
		}

		wg.Done()
	}()

	wg.Wait()
}
