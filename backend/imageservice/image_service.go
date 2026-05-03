package imageservice

import (
	"bytes"
	"context"
	"fmt"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

type CloudinaryService struct {
	cld *cloudinary.Cloudinary
}

type UploadedImage struct {
	PublicID  string `json:"publicId"`
	SecureURL string `json:"secureUrl"`
}

type ImageService interface {
	UploadImage(ctx context.Context, filePath string, publicID string) (*UploadedImage, error)
	UploadImageBytes(ctx context.Context, data []byte, publicID string) (*UploadedImage, error)
	DeleteImage(ctx context.Context, publicID string) error
}

func NewCloudinaryService() (*CloudinaryService, error) {
	cld, err := cloudinary.New()
	if err != nil {
		return nil, fmt.Errorf("cloudinary init failed: %w", err)
	}

	cld.Config.URL.Secure = true

	return &CloudinaryService{cld: cld}, nil
}

func (c *CloudinaryService) UploadImage(
	ctx context.Context,
	filePath string,
	publicID string,
) (*UploadedImage, error) {
	resp, err := c.cld.Upload.Upload(ctx, filePath, uploader.UploadParams{
		PublicID:       publicID,
		UniqueFilename: api.Bool(false),
		Overwrite:      api.Bool(true),
	})
	if err != nil {
		return nil, fmt.Errorf("cloudinary upload failed: %w", err)
	}

	return &UploadedImage{
		PublicID:  resp.PublicID,
		SecureURL: resp.SecureURL,
	}, nil
}

func (c *CloudinaryService) UploadImageBytes(
	ctx context.Context,
	data []byte,
	publicID string,
) (*UploadedImage, error) {
	reader := bytes.NewReader(data)

	resp, err := c.cld.Upload.Upload(ctx, reader, uploader.UploadParams{
		PublicID:       publicID,
		UniqueFilename: api.Bool(false),
		Overwrite:      api.Bool(true),
	})
	if err != nil {
		return nil, fmt.Errorf("cloudinary upload bytes failed: %w", err)
	}

	return &UploadedImage{
		PublicID:  resp.PublicID,
		SecureURL: resp.SecureURL,
	}, nil
}

func (c *CloudinaryService) DeleteImage(ctx context.Context, publicID string) error {
	_, err := c.cld.Upload.Destroy(ctx, uploader.DestroyParams{
		PublicID: publicID,
	})
	return err
}
