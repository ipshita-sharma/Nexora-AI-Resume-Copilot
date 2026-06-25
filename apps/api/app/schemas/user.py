from pydantic import BaseModel, ConfigDict


class UserProfile(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: str | None = None
    full_name: str | None = None
    avatar_url: str | None = None
    target_role: str | None = None
    skills: list[str] = []
    profile: dict = {}


class UserProfileUpdate(BaseModel):
    full_name: str | None = None
    avatar_url: str | None = None
    target_role: str | None = None
    skills: list[str] | None = None
    profile: dict | None = None
