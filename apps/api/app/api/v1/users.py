from fastapi import APIRouter

from app.api.deps import CurrentUser, DbSession
from app.schemas.user import UserProfile, UserProfileUpdate
from app.services.security.users import ensure_user

router = APIRouter()


@router.get("/me", response_model=UserProfile)
async def get_profile(current_user: CurrentUser, db: DbSession):
    return await ensure_user(db, current_user)


@router.patch("/me", response_model=UserProfile)
async def update_profile(payload: UserProfileUpdate, current_user: CurrentUser, db: DbSession):
    user = await ensure_user(db, current_user)
    for field, value in payload.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(user, field, value)
    await db.commit()
    await db.refresh(user)
    return user
