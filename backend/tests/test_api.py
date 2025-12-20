"""Basic API tests"""
import pytest
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)


def test_health_check():
    """Test health endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert "status" in response.json()


def test_analyze_endpoint():
    """Test analyze endpoint accepts POST"""
    response = client.post(
        "/analyze",
        json={"brand": "test", "limit": 10}
    )
    # Should return task_id even if worker isn't running
    assert response.status_code in [200, 202]
    assert "task_id" in response.json()


def test_results_endpoint():
    """Test results endpoint"""
    response = client.get("/results?brand=test&limit=10")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
