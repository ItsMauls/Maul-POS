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
	"github.com/apotek-pbf/monorepo-pbf/purchase-service/cmd/rest/middleware"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

type handler interface {
	// Purchase Request
	FindAllPurchaseRequest(w http.ResponseWriter, r *http.Request)
	FindPurchaseRequest(w http.ResponseWriter, r *http.Request)
	CreatePurchaseRequest(w http.ResponseWriter, r *http.Request)
	SwitchGudangPurchaseRequest(w http.ResponseWriter, r *http.Request)
	ApprovePurchaseRequest(w http.ResponseWriter, r *http.Request)
	FindAllPurchaseRequestForPO(w http.ResponseWriter, r *http.Request)
	DeletePurchaseRequest(w http.ResponseWriter, r *http.Request)

	// Purchase Order
	FindAllPurchaseOrder(w http.ResponseWriter, r *http.Request)
	FindPurchaseOrder(w http.ResponseWriter, r *http.Request)
	CreatePurchaseOrder(w http.ResponseWriter, r *http.Request)
	ApprovePurchaseOrder(w http.ResponseWriter, r *http.Request)
	DeletePurchaseOrder(w http.ResponseWriter, r *http.Request)

	//invoice
	CreateInvoice(w http.ResponseWriter, r *http.Request)
	FindAllInvoice(w http.ResponseWriter, r *http.Request)
	FindInvoice(w http.ResponseWriter, r *http.Request)
	PelunasanInvoice(w http.ResponseWriter, r *http.Request)
}

func Run(ctx context.Context, cfg lib.Config, requestHandler handler) error {
	router := mux.NewRouter()
	authMiddleware := middleware.NewAuthMiddleware(&cfg)

	router.Use(authMiddleware.ValidateCurrentUser)

	// Purchase Request
	router.HandleFunc("/api/purchase/request/all", requestHandler.FindAllPurchaseRequest).Methods(http.MethodGet)
	router.HandleFunc("/api/purchase/request", requestHandler.FindPurchaseRequest).Methods(http.MethodGet)
	router.HandleFunc("/api/purchase/request", requestHandler.CreatePurchaseRequest).Methods(http.MethodPost)
	router.HandleFunc("/api/purchase/request/switch-gudang", requestHandler.SwitchGudangPurchaseRequest).Methods(http.MethodPut)
	router.HandleFunc("/api/purchase/request/approve", requestHandler.ApprovePurchaseRequest).Methods(http.MethodPut)
	router.HandleFunc("/api/purchase/request/all-for-po", requestHandler.FindAllPurchaseRequestForPO).Methods(http.MethodGet)
	router.HandleFunc("/api/purchase/request", requestHandler.DeletePurchaseRequest).Methods(http.MethodDelete)

	// Purchase Order
	router.HandleFunc("/api/purchase/order/all", requestHandler.FindAllPurchaseOrder).Methods(http.MethodGet)
	router.HandleFunc("/api/purchase/order", requestHandler.FindPurchaseOrder).Methods(http.MethodGet)
	router.HandleFunc("/api/purchase/order", requestHandler.CreatePurchaseOrder).Methods(http.MethodPost)
	router.HandleFunc("/api/purchase/order/approve", requestHandler.ApprovePurchaseOrder).Methods(http.MethodPut)
	router.HandleFunc("/api/purchase/order", requestHandler.DeletePurchaseOrder).Methods(http.MethodDelete)

	// Invoice
	router.HandleFunc("/api/purchase/invoice", requestHandler.CreateInvoice).Methods(http.MethodPost)
	router.HandleFunc("/api/purchase/invoice/all", requestHandler.FindAllInvoice).Methods(http.MethodGet)
	router.HandleFunc("/api/purchase/invoice", requestHandler.FindInvoice).Methods(http.MethodGet)
	router.HandleFunc("/api/purchase/invoice/pelunasan", requestHandler.PelunasanInvoice).Methods(http.MethodPost)

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
