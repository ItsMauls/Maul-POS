FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY ./go.work ./go.work
COPY ./go.work.sum ./go.work.sum
COPY ./lib ./lib
COPY ./user-service ./user-service
COPY ./auth-service ./auth-service
COPY ./inventory-service ./inventory-service
COPY ./purchase-service ./purchase-service
COPY ./supplier-service ./supplier-service


WORKDIR /app/lib
RUN go mod download

WORKDIR /app/user-service
RUN go mod download

RUN mkdir -p /usr/bin && CGO_ENABLED=0 go build -o /usr/bin/user-service ./cmd

FROM alpine

COPY --from=builder /usr/bin/user-service /usr/bin/user-service

CMD ["user-service"]
