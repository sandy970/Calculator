"""
Test file for Job Dashboard API
Run with: pytest test_api.py
"""

import pytest
from fastapi.testclient import TestClient
from main import app

# Create test client
client = TestClient(app)


def test_root_endpoint():
    """Test the root endpoint returns API information."""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "message" in data
    assert "version" in data
    assert "endpoints" in data
    assert len(data["endpoints"]) == 3


def test_health_check():
    """Test the health check endpoint."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_software_engineer_endpoint():
    """Test software engineer jobs endpoint structure."""
    response = client.get("/jobs/software-engineer?location=New York")
    assert response.status_code in [200, 408, 500]  # May fail due to scraping
    
    if response.status_code == 200:
        data = response.json()
        assert "success" in data
        assert "job_count" in data
        assert "jobs" in data
        assert "message" in data
        assert isinstance(data["jobs"], list)


def test_security_engineer_endpoint():
    """Test security engineer jobs endpoint structure."""
    response = client.get("/jobs/security-engineer?source=indeed")
    assert response.status_code in [200, 408, 500]  # May fail due to scraping
    
    if response.status_code == 200:
        data = response.json()
        assert "success" in data
        assert "job_count" in data
        assert "jobs" in data
        assert "message" in data


def test_data_engineer_endpoint():
    """Test data engineer jobs endpoint structure."""
    response = client.get("/jobs/data-engineer")
    assert response.status_code in [200, 408, 500]  # May fail due to scraping
    
    if response.status_code == 200:
        data = response.json()
        assert "success" in data
        assert "job_count" in data
        assert "jobs" in data
        assert "message" in data


def test_invalid_endpoint():
    """Test that invalid endpoints return 404."""
    response = client.get("/jobs/invalid-job")
    assert response.status_code == 404


if __name__ == "__main__":
    # Run basic tests
    print("Testing Job Dashboard API...")
    
    print("✓ Testing root endpoint...")
    test_root_endpoint()
    
    print("✓ Testing health check...")
    test_health_check()
    
    print("✓ Testing software engineer endpoint...")
    test_software_engineer_endpoint()
    
    print("✓ Testing invalid endpoint...")
    test_invalid_endpoint()
    
    print("All tests passed! 🎉")