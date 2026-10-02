import json
from pathlib import Path
from typing import Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

DATA_DIR = Path(__file__).parent.parent / "data"


def _load(filename: str) -> Any:
    path = DATA_DIR / filename
    if not path.exists():
        raise HTTPException(status_code=503, detail=f"Data file {filename} not found")
    with open(path, encoding="utf-8") as f:
        return json.load(f)


class PersonaSummary(BaseModel):
    key: str
    name: str
    user_type: str
    city: str
    current_role: str
    target_role: str
    description: str
    disruption_score: int


@router.get("/demo/personas", response_model=list[PersonaSummary], tags=["Demo"])
async def list_personas() -> list[PersonaSummary]:
    """List all demo personas."""
    personas = _load("personas.json")
    return [PersonaSummary(**p) for p in personas]


@router.post("/demo/load/{key}", tags=["Demo"])
async def load_persona(key: str) -> dict:
    """Load a full demo persona by key (priya, ramesh, arjun, sneha, rohit)."""
    personas = _load("personas.json")
    persona = next((p for p in personas if p["key"] == key), None)
    if not persona:
        raise HTTPException(status_code=404, detail=f"Persona '{key}' not found")
    return persona
