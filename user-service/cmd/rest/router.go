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
	"github.com/apotek-pbf/monorepo-pbf/user-service/cmd/rest/middleware"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

type handler interface {
	Ping(w http.ResponseWriter, r *http.Request)
	GetUsers(w http.ResponseWriter, r *http.Request)
	GetRoles(w http.ResponseWriter, r *http.Request)
	CreateUser(w http.ResponseWriter, r *http.Request)
	DeleteUser(w http.ResponseWriter, r *http.Request)
	GetUserByIDs(w http.ResponseWriter, r *http.Request)
	AddSignature(w http.ResponseWriter, r *http.Request)
	GetSignature(w http.ResponseWriter, r *http.Request)
}

func Run(ctx context.Context, cfg lib.Config, requestHandler handler) error {
	router := mux.NewRouter()
	authMiddleware := middleware.NewAuthMiddleware(&cfg)

	router.Use(authMiddleware.ValidateCurrentUser)
	router.HandleFunc("/api/user/ping", requestHandler.Ping).Methods(http.MethodGet)
	router.HandleFunc("/api/user/all", requestHandler.GetUsers).Methods(http.MethodGet)
	router.HandleFunc("/api/user/roles", requestHandler.GetRoles).Methods(http.MethodGet)
	router.HandleFunc("/api/user/create", requestHandler.CreateUser).Methods(http.MethodPost)
	router.HandleFunc("/api/user/delete", requestHandler.DeleteUser).Methods(http.MethodDelete)
	router.HandleFunc("/api/user", requestHandler.GetUserByIDs).Methods(http.MethodGet)
	router.HandleFunc("/api/user/signature", requestHandler.AddSignature).Methods(http.MethodPost)
	router.HandleFunc("/api/user/signature", requestHandler.GetSignature).Methods(http.MethodGet)

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
