package lib

import (
	"crypto/md5"
	"encoding/hex"
)

func HashPassword(password string) (string, error) {
	hasher := md5.New()
	_, err := hasher.Write([]byte(password))
	if err != nil {
		return "", err
	}

	return hex.EncodeToString(hasher.Sum(nil)), nil
}
