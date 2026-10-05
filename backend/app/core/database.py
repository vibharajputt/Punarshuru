from collections.abc import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.core.config import get_settings

settings = get_settings()

# Convert sync SQLite URL to async; MySQL uses aiomysql driver
def _make_async_url(url: str) -> str:
    if url.startswith("sqlite:///"):
        return url.replace("sqlite:///", "sqlite+aiosqlite:///", 1)
    if url.startswith("mysql+pymysql://"):
        return url.replace("mysql+pymysql://", "mysql+aiomysql://", 1)
    if url.startswith("mysql://"):
        return url.replace("mysql://", "mysql+aiomysql://", 1)
    return url


async_url = _make_async_url(settings.DATABASE_URL)

engine = create_async_engine(
    async_url,
    echo=settings.DEBUG,
    future=True,
    pool_pre_ping=True,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session


async def init_db() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        # SQLite doesn't automatically add columns to existing tables with create_all
        try:
            from sqlalchemy import text
            res = await conn.execute(text("PRAGMA table_info('onboarding_sessions')"))
            cols = [row[1] for row in res.fetchall()]
            if cols and "engine_state" not in cols:
                await conn.execute(text("ALTER TABLE onboarding_sessions ADD COLUMN engine_state JSON"))

            # Profiles table migrations
            res_p = await conn.execute(text("PRAGMA table_info('profiles')"))
            p_cols = [row[1] for row in res_p.fetchall()]
            if p_cols:
                if "current_city" not in p_cols:
                    await conn.execute(text("ALTER TABLE profiles ADD COLUMN current_city VARCHAR(60)"))
                if "preferred_city" not in p_cols:
                    await conn.execute(text("ALTER TABLE profiles ADD COLUMN preferred_city VARCHAR(60)"))
                if "gap_reason" not in p_cols:
                    await conn.execute(text("ALTER TABLE profiles ADD COLUMN gap_reason VARCHAR(200)"))
                if "achievements" not in p_cols:
                    await conn.execute(text("ALTER TABLE profiles ADD COLUMN achievements JSON"))
        except Exception:
            pass
