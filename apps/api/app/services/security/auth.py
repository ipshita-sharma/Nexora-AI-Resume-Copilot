import base64
import json
from dataclasses import dataclass
from typing import Annotated

from fastapi import Header, HTTPException, status

from app.core.config import get_settings


@dataclass(slots=True)
class UserContext:
    id: str
    email: str | None = None
    full_name: str | None = None
    avatar_url: str | None = None


def _decode_jwt_payload_without_verification(token: str) -> dict:
    try:
        payload = token.split(".")[1]
        payload += "=" * (-len(payload) % 4)
        return json.loads(base64.urlsafe_b64decode(payload.encode("utf-8")).decode("utf-8"))
    except Exception:
        return {}


async def get_current_user(
    authorization: Annotated[str | None, Header(alias="Authorization")] = None,
) -> UserContext:
    settings = get_settings()

    if not authorization:
        if settings.allow_anonymous_demo:
            
            return UserContext(
                id="demo-user",
                email="demo@nexora.ai",
                full_name="Demo Candidate",
                avatar_url=None,
            )
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token")

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authorization header")

    # Production deployments should configure Clerk issuer/JWKS verification at the API gateway
    # or extend this adapter with strict RS256 verification. The unverified branch keeps local
    # development frictionless while preserving auth-aware route contracts.
    claims = _decode_jwt_payload_without_verification(token)
    print("JWT CLAIMS =", claims)
    issuer = claims.get("iss")
    if settings.clerk_jwt_issuer and issuer and issuer != settings.clerk_jwt_issuer:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token issuer")

    return UserContext(
        id=claims.get("sub") or "demo-user",
        email=claims.get("email") or claims.get("primary_email_address"),
        full_name=claims.get("name") or claims.get("full_name"),
        avatar_url=claims.get("picture") or claims.get("image_url"),
    )
