# Job Dashboard Backend API

A FastAPI-based backend service that scrapes job listings from popular job boards (LinkedIn, Indeed) and provides REST API endpoints for different engineering roles.

## Features

- 🔍 **Web Scraping**: Extracts job listings from LinkedIn and Indeed
- 🚀 **FastAPI**: Modern, fast web framework with automatic API documentation
- 🎯 **Multiple Job Categories**: Dedicated endpoints for software, security, and data engineers
- 🛡️ **Error Handling**: Robust error handling and logging
- 📊 **Database Ready**: Placeholder for database integration with duplicate prevention
- 🔄 **Async Support**: Non-blocking operations for better performance
- 📝 **Type Safety**: Full Pydantic model validation and type hints

## API Endpoints

### Core Endpoints

- `GET /` - API information and available endpoints
- `GET /health` - Health check endpoint
- `GET /docs` - Interactive API documentation (Swagger UI)
- `GET /redoc` - Alternative API documentation

### Job Scraping Endpoints

- `GET /jobs/software-engineer` - Scrape Full Stack Java Engineer positions
- `GET /jobs/security-engineer` - Scrape Cybersecurity Engineer positions  
- `GET /jobs/data-engineer` - Scrape Data Engineer positions

### Query Parameters

All job endpoints support:
- `location` (string, optional): Geographic location to search (default: "United States")
- `source` (string, optional): Job board to scrape from - "linkedin" or "indeed" (default: "linkedin")

### Example Requests

```bash
# Get software engineer jobs in New York from LinkedIn
curl "http://localhost:8000/jobs/software-engineer?location=New York&source=linkedin"

# Get security engineer jobs from Indeed
curl "http://localhost:8000/jobs/security-engineer?source=indeed"

# Get data engineer jobs with default parameters
curl "http://localhost:8000/jobs/data-engineer"
```

## Installation & Setup

### Prerequisites

- Python 3.8+
- pip package manager

### 1. Clone/Download the Code

Save the following files in your project directory:
- `main.py` - Main FastAPI application
- `requirements.txt` - Python dependencies
- `test_api.py` - Test suite

### 2. Install Dependencies

```bash
# Create virtual environment (recommended)
python -m venv job-dashboard-env

# Activate virtual environment
# On Windows:
job-dashboard-env\Scripts\activate
# On macOS/Linux:
source job-dashboard-env/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Run the Application

```bash
# Start the server
python main.py

# Or use uvicorn directly
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at:
- **API Base URL**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

## Response Format

All job endpoints return a standardized response:

```json
{
  "success": true,
  "job_count": 15,
  "jobs": [
    {
      "job_title": "Senior Full Stack Developer",
      "company_name": "Tech Corp",
      "location": "San Francisco, CA",
      "job_url": "https://www.linkedin.com/jobs/view/123456789",
      "scraped_from": "LinkedIn"
    }
  ],
  "message": "Successfully scraped 15 software engineer jobs"
}
```

## Testing

### Run Tests

```bash
# Using pytest
pytest test_api.py -v

# Or run the test file directly
python test_api.py
```

### Manual Testing

1. Start the server: `python main.py`
2. Visit http://localhost:8000/docs for interactive testing
3. Try the endpoints with different parameters

## Database Integration

The code includes a `DatabaseManager` class with placeholders for database operations:

```python
class DatabaseManager:
    @staticmethod
    async def save_jobs(jobs: List[JobListing]) -> int:
        # TODO: Implement actual database logic
        # 1. Connect to database (PostgreSQL, etc.)
        # 2. Check for existing jobs using job_url as unique identifier  
        # 3. Insert only new jobs
        # 4. Return count of newly inserted jobs
        pass
```

### Recommended Database Setup (Supabase/PostgreSQL)

```sql
-- Example table schema
CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    job_title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    job_url VARCHAR(500) UNIQUE NOT NULL,
    scraped_from VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster duplicate checking
CREATE INDEX idx_jobs_url ON jobs(job_url);
```

## Configuration

### Environment Variables (Optional)

Create a `.env` file for configuration:

```env
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True

# Database Configuration (when implemented)
DATABASE_URL=postgresql://user:password@localhost:5432/jobdashboard

# Scraping Configuration
REQUEST_TIMEOUT=30
MAX_JOBS_PER_REQUEST=50
```

### Customizing Job Search Terms

Edit the job titles in the endpoint functions:

```python
# In main.py, modify these lines:
job_title = "Full Stack Java Engineer"  # Software engineer endpoint
job_title = "Cybersecurity Engineer"    # Security engineer endpoint  
job_title = "Data Engineer"             # Data engineer endpoint
```

## Production Deployment

### Using Docker

Create a `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Deploy to Cloud Platforms

- **Railway**: Connect GitHub repo, automatic deployment
- **Render**: Deploy from GitHub with build command `pip install -r requirements.txt`
- **Fly.io**: Use `flyctl deploy` after setup
- **Heroku**: Use Procfile: `web: uvicorn main:app --host=0.0.0.0 --port=${PORT:-5000}`

## Important Notes

### Web Scraping Considerations

1. **Rate Limiting**: The scraper includes delays and proper headers to avoid being blocked
2. **Legal Compliance**: Ensure you comply with websites' Terms of Service and robots.txt
3. **Reliability**: Job board HTML structures change frequently; monitor for parsing errors
4. **IP Blocking**: Consider using proxies or rotation for high-volume scraping

### Error Handling

The API handles common scenarios:
- Network timeouts (408 error)
- HTTP errors (4xx/5xx status codes)
- Parsing failures (graceful degradation)
- Missing job elements (continues with next job)

### Performance Tips

1. Use the async/await pattern throughout
2. Implement caching for frequently requested locations
3. Add database connection pooling when implementing persistence
4. Consider background task queues (Celery) for large scraping jobs

## Contributing

1. Follow PEP 8 style guidelines
2. Add type hints to all functions
3. Include comprehensive error handling
4. Write tests for new features
5. Update documentation

## License

This project is for educational purposes. Ensure compliance with job board terms of service when scraping.