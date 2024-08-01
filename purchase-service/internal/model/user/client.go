package user

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/apotek-pbf/monorepo-pbf/lib"
)

type client struct {
	cfg *lib.APIConfig
	log *lib.AggregateLogger
}

func NewClient(cfg *lib.APIConfig, log *lib.AggregateLogger) *client {
	return &client{
		cfg: cfg,
		log: log,
	}
}

func (c *client) GetUserByIDs(ctx context.Context, ids []int64) (data []UserDetail, err error) {
	url := c.cfg.UserURL

	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		c.log.ErrorF("error create request: %v", err)
		return
	}

	req.Header.Set("Authorization", lib.GetJWTContext(ctx))
	req.Header.Set("X-Secret-Key", c.cfg.SecretKey)
	req.Header.Set("Content-Type", "application/json")

	q := req.URL.Query()

	idsStr := make([]string, 0, len(ids))
	for _, id := range ids {
		idsStr = append(idsStr, fmt.Sprint(id))
	}

	q.Add("ids", strings.Join(idsStr, ","))
	req.URL.RawQuery = q.Encode()

	c.log.InfoF("request: %v", req)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		c.log.ErrorF("error do request: %v", err)
		return
	}

	defer resp.Body.Close()

	var response GetUserByIDsResponse
	if err = json.NewDecoder(resp.Body).Decode(&response); err != nil {
		c.log.ErrorF("error decode response: %v", err)
		return
	}

	c.log.InfoF("response: %v", response)

	if response.StatusCode != 200 {
		c.log.ErrorF("error response: %v", response)
		return
	}

	data = response.Data
	return
}
