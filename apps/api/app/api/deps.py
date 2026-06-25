from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.services.security.auth import UserContext, get_current_user

CurrentUser = Annotated[UserContext, Depends(get_current_user)]
DbSession = Annotated[AsyncSession, Depends(get_db)]
