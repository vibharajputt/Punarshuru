"""Tests for POST /api/auth/signup, POST /api/auth/login, GET /api/auth/me."""
import pytest
from httpx import AsyncClient

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

SIGNUP_PAYLOAD = {
    "name": "Priya Test",
    "email": "priya@example.com",
    "password": "Secret123!",
}


async def _signup(client: AsyncClient, payload: dict | None = None) -> dict:
    data = payload or SIGNUP_PAYLOAD
    resp = await client.post("/api/auth/signup", json=data)
    return resp


# ---------------------------------------------------------------------------
# Signup
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_signup_creates_user_and_returns_token(client: AsyncClient):
    resp = await _signup(client)
    assert resp.status_code == 201, resp.text
    body = resp.json()
    assert "access_token" in body
    assert body["token_type"] == "bearer"
    assert len(body["access_token"]) > 20


@pytest.mark.asyncio
async def test_signup_duplicate_email_returns_409(client: AsyncClient):
    await _signup(client)  # first signup succeeds
    resp = await _signup(client)  # second with same email
    assert resp.status_code == 409
    assert "already exists" in resp.json()["detail"].lower()


@pytest.mark.asyncio
async def test_signup_missing_fields_returns_422(client: AsyncClient):
    resp = await client.post("/api/auth/signup", json={"email": "bad@example.com"})
    assert resp.status_code == 422


# ---------------------------------------------------------------------------
# Login
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_login_correct_credentials_returns_token(client: AsyncClient):
    await _signup(client)
    resp = await client.post(
        "/api/auth/login",
        json={"email": SIGNUP_PAYLOAD["email"], "password": SIGNUP_PAYLOAD["password"]},
    )
    assert resp.status_code == 200, resp.text
    body = resp.json()
    assert "access_token" in body


@pytest.mark.asyncio
async def test_login_wrong_password_returns_401(client: AsyncClient):
    await _signup(client)
    resp = await client.post(
        "/api/auth/login",
        json={"email": SIGNUP_PAYLOAD["email"], "password": "WrongPass999"},
    )
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_login_unknown_email_returns_401(client: AsyncClient):
    resp = await client.post(
        "/api/auth/login",
        json={"email": "nobody@example.com", "password": "whatever"},
    )
    assert resp.status_code == 401


# ---------------------------------------------------------------------------
# /me
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_me_with_valid_token_returns_user_info(client: AsyncClient):
    signup_resp = await _signup(client)
    token = signup_resp.json()["access_token"]

    me_resp = await client.get(
        "/api/auth/me", headers={"Authorization": f"Bearer {token}"}
    )
    assert me_resp.status_code == 200, me_resp.text
    body = me_resp.json()
    assert body["email"] == SIGNUP_PAYLOAD["email"]
    assert body["name"] == SIGNUP_PAYLOAD["name"]
    assert "id" in body


@pytest.mark.asyncio
async def test_me_without_token_returns_403(client: AsyncClient):
    resp = await client.get("/api/auth/me")
    # HTTPBearer returns 403 when no credentials are provided
    assert resp.status_code in (401, 403)


@pytest.mark.asyncio
async def test_me_with_invalid_token_returns_401(client: AsyncClient):
    resp = await client.get(
        "/api/auth/me", headers={"Authorization": "Bearer this.is.garbage"}
    )
    assert resp.status_code == 401


# ---------------------------------------------------------------------------
# Profile upsert (duplicate-email fix)
# ---------------------------------------------------------------------------


@pytest.mark.asyncio
async def test_post_profile_duplicate_email_upserts_not_500(client: AsyncClient):
    """Calling POST /api/profile twice with the same email must not 500."""
    payload = {
        "name": "Rahul Dev",
        "email": "rahul@example.com",
        "user_type": "gig",
        "experience_years": 3,
        "skills_raw": ["Python"],
        "skills_taxonomy_ids": [],
    }
    r1 = await client.post("/api/profile", json=payload)
    assert r1.status_code == 201, r1.text

    r2 = await client.post("/api/profile", json=payload)
    # Must upsert — not 500
    assert r2.status_code == 201, r2.text
    # Same profile id returned (upserted)
    assert r1.json()["id"] == r2.json()["id"]


@pytest.mark.asyncio
async def test_post_profile_with_auth_links_user_id(client: AsyncClient):
    """Profile created with a valid JWT must have user_id set."""
    signup_resp = await _signup(client)
    token = signup_resp.json()["access_token"]

    payload = {
        "name": "Priya Test",
        "email": SIGNUP_PAYLOAD["email"],
        "user_type": "returner",
        "experience_years": 5,
        "skills_raw": ["Java"],
        "skills_taxonomy_ids": [],
    }
    resp = await client.post(
        "/api/profile",
        json=payload,
        headers={"Authorization": f"Bearer {token}"},
    )
    assert resp.status_code == 201, resp.text
    body = resp.json()
    assert body["user_id"] is not None
