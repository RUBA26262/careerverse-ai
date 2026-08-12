import os
import datetime
from passlib.context import CryptContext
from jose import jwt, JWTError

_DEV_DEFAULT = "dev-secret-change-in-production"
SECRET_KEY = os.getenv("CAREERVERSE_SECRET_KEY", _DEV_DEFAULT)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_HOURS = 24 * 7

if SECRET_KEY == _DEV_DEFAULT:
    print(
        "\n[security] WARNING: CAREERVERSE_SECRET_KEY is not set — using an insecure "
        "development default. Every JWT this issues is forgeable. Set a real secret "
        "before deploying:\n"
        "  python -c \"import secrets; print(secrets.token_hex(32))\"\n"
        "  export CAREERVERSE_SECRET_KEY=<the output>\n"
    )

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def create_access_token(user_id: int) -> str:
    expire = datetime.datetime.utcnow() + datetime.timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    payload = {"sub": str(user_id), "exp": expire}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return int(payload.get("sub"))
    except (JWTError, ValueError, TypeError):
        return None
