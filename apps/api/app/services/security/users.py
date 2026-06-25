from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.services.security.auth import UserContext


async def ensure_user(db: AsyncSession, ctx: UserContext) -> User:
    user = await db.get(User, ctx.id)
    if user:
        changed = False
        for key in ("email", "full_name", "avatar_url"):
            value = getattr(ctx, key)
            if value and getattr(user, key) != value:
                setattr(user, key, value)
                changed = True
        if changed:
            await db.commit()
            await db.refresh(user)
        return user

    user = User(
        id=ctx.id,
        email=ctx.email,
        full_name=ctx.full_name,
        avatar_url=ctx.avatar_url,
        skills=[],
        profile={},
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
