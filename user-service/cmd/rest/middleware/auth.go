package middleware

import (
	"net/http"

	"github.com/apotek-pbf/monorepo-pbf/lib"
)

type AuthMiddleware struct {
	cfg *lib.Config
}

func NewAuthMiddleware(cfg *lib.Config) *AuthMiddleware {
	return &AuthMiddleware{
		cfg: cfg,
	}
}

func (a *AuthMiddleware) ValidateCurrentUser(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user, err := lib.ValidateCurrentUser(a.cfg.ApiConfig, r)
		if err != nil {
			lib.WriteResponse(w, err, nil)
			return
		}

		r = lib.SetUserContext(r, user)
		next.ServeHTTP(w, r)
	})
}
