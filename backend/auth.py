"""Authentication module with JWT tokens and password hashing."""
from datetime import datetime, timedelta
from typing import Optional
from pathlib import Path
import sqlite3
import secrets
import hashlib
import jwt
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr

# Configuration
SECRET_KEY = secrets.token_urlsafe(32)  # In production, load from environment
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

security = HTTPBearer()

DB_PATH = Path(__file__).resolve().parent / "no_code.db"


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class User(BaseModel):
    user_id: int
    email: str
    full_name: Optional[str]
    created_at: int
    is_active: bool = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User


def get_db_conn():
    """Get database connection."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_auth_db():
    """Initialize users table."""
    conn = get_db_conn()
    cur = conn.cursor()
    
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            full_name TEXT,
            created_at INTEGER NOT NULL,
            is_active INTEGER DEFAULT 1
        )
    """)
    
    conn.commit()
    conn.close()


def hash_password(password: str) -> str:
    """Hash password using SHA256 with salt."""
    salt = secrets.token_hex(16)
    pwd_hash = hashlib.sha256((password + salt).encode()).hexdigest()
    return f"{salt}${pwd_hash}"


def verify_password(password: str, password_hash: str) -> bool:
    """Verify password against hash."""
    try:
        salt, pwd_hash = password_hash.split('$')
        check_hash = hashlib.sha256((password + salt).encode()).hexdigest()
        return check_hash == pwd_hash
    except:
        return False


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    """Decode and verify JWT token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"}
        )
    except jwt.JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )


def get_user_by_email(email: str) -> Optional[dict]:
    """Get user by email from database."""
    conn = get_db_conn()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE email = ?", (email,))
    row = cur.fetchone()
    conn.close()
    return dict(row) if row else None


def create_user(user_data: UserCreate) -> User:
    """Create new user in database."""
    # Check if user exists
    if get_user_by_email(user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    password_hash = hash_password(user_data.password)
    created_at = int(datetime.utcnow().timestamp())
    
    # Insert user
    conn = get_db_conn()
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO users (email, password_hash, full_name, created_at)
        VALUES (?, ?, ?, ?)
        """,
        (user_data.email, password_hash, user_data.full_name, created_at)
    )
    user_id = cur.lastrowid
    conn.commit()
    conn.close()
    
    return User(
        user_id=user_id,
        email=user_data.email,
        full_name=user_data.full_name,
        created_at=created_at,
        is_active=True
    )


def authenticate_user(email: str, password: str) -> Optional[User]:
    """Authenticate user with email and password."""
    user_dict = get_user_by_email(email)
    if not user_dict:
        return None
    
    if not verify_password(password, user_dict['password_hash']):
        return None
    
    return User(
        user_id=user_dict['user_id'],
        email=user_dict['email'],
        full_name=user_dict['full_name'],
        created_at=user_dict['created_at'],
        is_active=bool(user_dict['is_active'])
    )


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    """Dependency to get current authenticated user from JWT token."""
    token = credentials.credentials
    payload = decode_token(token)
    
    email = payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    user_dict = get_user_by_email(email)
    if not user_dict:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return User(
        user_id=user_dict['user_id'],
        email=user_dict['email'],
        full_name=user_dict['full_name'],
        created_at=user_dict['created_at'],
        is_active=bool(user_dict['is_active'])
    )


def optional_auth(credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))) -> Optional[User]:
    """Optional authentication - returns None if no token provided."""
    if not credentials:
        return None
    try:
        return get_current_user(credentials)
    except:
        return None
