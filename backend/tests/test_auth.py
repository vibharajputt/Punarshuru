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


async def _signup(
    client: AsyncClient, payload: dict | None = None, email: str | None = None
) -> dict:
    data = dict(payload or SIGNUP_PAYLOAD)
    if email:
        data["email"] = email
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
async def test_post_profile_without_auth_returns_401(client: AsyncClient):
    """Calling POST /api/profile without auth (non-demo) must return 401."""
    payload = {
        "name": "Rahul Dev",
        "email": "rahul@example.com",
        "user_type": "gig",
        "experience_years": 3,
        "skills_raw": ["Python"],
        "skills_taxonomy_ids": [],
    }
    r = await client.post("/api/profile", json=payload)
    assert r.status_code == 401, r.text


@pytest.mark.asyncio
async def test_get_and_put_profile_without_auth_returns_401(client: AsyncClient):
    """Calling GET and PUT /api/profile/{id} without auth (non-demo) must return 401."""
    # First create profile with auth
    signup_resp = await _signup(client, email="user_getput@example.com")
    token = signup_resp.json()["access_token"]
    payload = {
        "name": "Auth User",
        "email": "user_getput@example.com",
        "user_type": "returner",
        "experience_years": 4,
        "skills_raw": ["Python"],
        "skills_taxonomy_ids": [],
    }
    res = await client.post("/api/profile", json=payload, headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 201
    profile_id = res.json()["id"]

    # GET without auth
    get_res = await client.get(f"/api/profile/{profile_id}")
    assert get_res.status_code == 401

    # PUT without auth
    put_res = await client.put(f"/api/profile/{profile_id}", json={"experience_years": 5})
    assert put_res.status_code == 401


@pytest.mark.asyncio
async def test_post_profile_upserts_by_user_id_not_email(client: AsyncClient):
    """Profiles upsert strictly by user_id. Email-based linking is removed."""
    # User 1 creates profile
    s1 = await _signup(client, email="owner1@example.com")
    token1 = s1.json()["access_token"]
    payload1 = {
        "name": "Owner One",
        "email": "owner1@example.com",
        "user_type": "returner",
        "experience_years": 3,
        "skills_raw": ["Java"],
        "skills_taxonomy_ids": [],
    }
    r1 = await client.post("/api/profile", json=payload1, headers={"Authorization": f"Bearer {token1}"})
    assert r1.status_code == 201
    p1_id = r1.json()["id"]

    # User 1 calls POST again -> upserts their own profile
    payload1_updated = {**payload1, "experience_years": 4}
    r1_up = await client.post("/api/profile", json=payload1_updated, headers={"Authorization": f"Bearer {token1}"})
    assert r1_up.status_code == 201
    assert r1_up.json()["id"] == p1_id
    assert r1_up.json()["experience_years"] == 4

    # User 2 creates their own profile -> separate profile created (keyed to user 2, not linked by email)
    s2 = await _signup(client, email="owner2@example.com")
    token2 = s2.json()["access_token"]
    payload2 = {
        "name": "Owner Two",
        "email": "owner2@example.com",
        "user_type": "gig",
        "experience_years": 2,
        "skills_raw": ["Node.js"],
        "skills_taxonomy_ids": [],
    }
    r2 = await client.post("/api/profile", json=payload2, headers={"Authorization": f"Bearer {token2}"})
    assert r2.status_code == 201
    p2_id = r2.json()["id"]
    # Separate profile created — keyed by user_id!
    assert p2_id != p1_id
    assert r2.json()["user_id"] is not None
    assert r2.json()["user_id"] != r1_up.json()["user_id"]


@pytest.mark.asyncio
async def test_post_profile_with_auth_links_user_id(client: AsyncClient):
    """Profile created with a valid JWT must have user_id set."""
    signup_resp = await _signup(client, email="unique_link@example.com")
    token = signup_resp.json()["access_token"]

    payload = {
        "name": "Priya Test",
        "email": "unique_link@example.com",
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

