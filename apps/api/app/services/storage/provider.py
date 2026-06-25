from pathlib import Path
from uuid import uuid4

from app.core.config import get_settings


class StorageProvider:
    async def save_bytes(self, content: bytes, filename: str) -> str:
        settings = get_settings()
        if settings.storage_provider == "cloudinary":
            return await self._cloudinary(content, filename)
        if settings.storage_provider == "s3":
            return await self._s3(content, filename)
        return self._local(content, filename)

    @staticmethod
    def _local(content: bytes, filename: str) -> str:
        settings = get_settings()
        upload_dir = Path(settings.local_upload_dir)
        upload_dir.mkdir(parents=True, exist_ok=True)
        safe_name = filename.replace("/", "-").replace("\\", "-")
        path = upload_dir / f"{uuid4()}-{safe_name}"
        path.write_bytes(content)
        return str(path)

    @staticmethod
    async def _cloudinary(content: bytes, filename: str) -> str:
        try:
            import cloudinary.uploader

            result = cloudinary.uploader.upload(content, resource_type="raw", public_id=filename)
            return str(result["secure_url"])
        except Exception:
            return StorageProvider._local(content, filename)

    @staticmethod
    async def _s3(content: bytes, filename: str) -> str:
        try:
            import boto3

            settings = get_settings()
            if not settings.s3_bucket:
                return StorageProvider._local(content, filename)
            key = f"resumes/{uuid4()}-{filename}"
            client = boto3.client("s3", region_name=settings.aws_region)
            client.put_object(Bucket=settings.s3_bucket, Key=key, Body=content)
            return f"s3://{settings.s3_bucket}/{key}"
        except Exception:
            return StorageProvider._local(content, filename)
