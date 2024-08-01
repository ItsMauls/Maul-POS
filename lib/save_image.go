package lib

import (
	"encoding/base64"
	"errors"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"os"
	"strings"
)

func SaveImage(base64Data, outputFileName, outputDir string) (fileName, format string, err error) {
	var imageFormat string
	if strings.Contains(base64Data, "data:image/png;base64,") {
		imageFormat = "png"
	} else if strings.Contains(base64Data, "data:image/jpeg;base64,") {
		imageFormat = "jpeg"
	} else {
		return "", "", errors.New("invalid image format")
	}

	base64Data = strings.Replace(base64Data, fmt.Sprintf("data:image/%s;base64,", imageFormat), "", 1)

	imageBytes, err := base64.StdEncoding.DecodeString(base64Data)
	if err != nil {
		return "", "", err
	}

	img, _, err := image.Decode(strings.NewReader(string(imageBytes)))
	if err != nil {
		return "", "", err
	}

	outputPath := fmt.Sprintf("%s/%s.%s", outputDir, outputFileName, imageFormat)

	// create directory if not exists
	if _, err := os.Stat(outputDir); os.IsNotExist(err) {
		err = os.MkdirAll(outputDir, os.ModePerm)
		if err != nil {
			return "", "", err
		}
	}

	outputFile, err := os.Create(outputPath)
	if err != nil {
		return "", "", err
	}

	defer outputFile.Close()

	switch imageFormat {
	case "png":
		err = png.Encode(outputFile, img)
		if err != nil {
			return "", "", err
		}
	case "jpeg":
		err = jpeg.Encode(outputFile, img, nil)
		if err != nil {
			return "", "", err
		}
	default:
		return "", "", errors.New("invalid image format")
	}

	return outputPath, imageFormat, nil
}

func DeleteImage(imagePath string) error {
	err := os.Remove(imagePath)
	if err != nil {
		return err
	}

	return nil
}
