import os
import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).resolve().parent / ".env")

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

image_folder = Path(__file__).resolve().parent / "media" / "blog_images"

for image_path in image_folder.iterdir():
    if image_path.is_file():
        try:
            result = cloudinary.uploader.upload(
                str(image_path),
                folder="media/blog_images",
                public_id=image_path.stem,
                overwrite=True,
                resource_type="image",
            )
            print(f"Uploaded: {image_path.name}")
            print(f"Cloudinary URL: {result['secure_url']}")
        except Exception as error:
            print(f"Failed: {image_path.name} - {error}")