package rest

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/apotek-pbf/monorepo-pbf/lib"
	"github.com/apotek-pbf/monorepo-pbf/supplier-service/cmd/rest/middleware"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

type handler interface {
	FindAllSupplier(w http.ResponseWriter, r *http.Request)
	FindSupplierByIDs(w http.ResponseWriter, r *http.Request)
}

func Run(ctx context.Context, cfg lib.Config, requestHandler handler) error {
	router := mux.NewRouter()
	authMiddleware := middleware.NewAuthMiddleware(&cfg)

	router.Use(authMiddleware.ValidateCurrentUser)

	router.HandleFunc("/api/supplier/all", requestHandler.FindAllSupplier).Methods(http.MethodGet)
	router.HandleFunc("/api/supplier", requestHandler.FindSupplierByIDs).Methods(http.MethodGet)

	c := cors.New(cors.Options{
		AllowedOrigins:     []string{"*"},
		AllowedMethods:     []string{"POST", "GET", "PUT", "DELETE", "HEAD", "OPTIONS"},
		AllowedHeaders:     []string{"Accept", "Content-Type", "Content-Length", "Accept-Encoding", "X-CSRF-Token", "Authorization", "Mode"},
		MaxAge:             60, // 1 minutes
		AllowCredentials:   true,
		OptionsPassthrough: false,
		Debug:              false,
	})

	httpHandler := c.Handler(router)

	err := startServer(ctx, httpHandler, cfg)
	if err != nil {
		return err
	}

	return nil
}

func startServer(ctx context.Context, httpHandler http.Handler, cfg lib.Config) error {
	errChan := make(chan error)

	go func() {
		errChan <- startHTTP(ctx, httpHandler, cfg)
	}()

	select {
	case err := <-errChan:
		return err
	case <-ctx.Done():
		return ctx.Err()
	}
}

func startHTTP(ctx context.Context, httpHandler http.Handler, cfg lib.Config) error {
	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", cfg.App.HTTPPort),
		Handler: httpHandler,
	}

	go func() {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal("failed to start server: ", err)
		}
	}()

	log.Printf("%s is starting at port: %d", cfg.App.Name, cfg.App.HTTPPort)
	interruption := make(chan os.Signal, 1)
	signal.Notify(interruption, syscall.SIGHUP, syscall.SIGINT, syscall.SIGTERM)
	<-interruption

	if err := server.Shutdown(ctx); err != nil {
		log.Printf("failed to shutdown: %s", err)
		return err
	}

	log.Println("server is shutting down")
	return nil
}
