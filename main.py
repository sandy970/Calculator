"""
Job Dashboard Backend API
A FastAPI application that scrapes job listings from job boards and provides
REST endpoints for different engineering roles.
"""

import asyncio
import logging
from typing import List, Optional, Dict, Any
from urllib.parse import quote_plus

import httpx
from bs4 import BeautifulSoup, Tag
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl, Field

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Job Dashboard API",
    description="A backend service for scraping and serving job listings",
    version="1.0.0"
)

# Add CORS middleware to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Pydantic models for type validation
class JobListing(BaseModel):
    """Model representing a job listing with essential details."""
    job_title: str = Field(..., description="The title of the job position")
    company_name: str = Field(..., description="Name of the hiring company")
    location: str = Field(..., description="Job location")
    job_url: str = Field(..., description="Direct URL to the job posting")
    scraped_from: str = Field(..., description="Source website of the job listing")


class ScrapingResponse(BaseModel):
    """Model for API response containing scraped jobs."""
    success: bool
    job_count: int
    jobs: List[JobListing]
    message: str


# Database placeholder class
class DatabaseManager:
    """
    Placeholder for database operations.
    In production, this would connect to your chosen database (PostgreSQL, etc.)
    """
    
    @staticmethod
    async def save_jobs(jobs: List[JobListing]) -> int:
        """
        Save jobs to database, avoiding duplicates.
        
        Args:
            jobs: List of job listings to save
            
        Returns:
            Number of new jobs saved (excluding duplicates)
        """
        # TODO: Implement actual database logic
        # Example implementation would:
        # 1. Connect to database
        # 2. Check for existing jobs using job_url as unique identifier
        # 3. Insert only new jobs
        # 4. Return count of newly inserted jobs
        
        logger.info(f"[DATABASE] Would save {len(jobs)} jobs to database")
        # Simulate some duplicates being filtered out
        new_jobs_count = max(0, len(jobs) - 2)
        logger.info(f"[DATABASE] {new_jobs_count} new jobs saved (duplicates filtered)")
        return new_jobs_count
    
    @staticmethod
    async def get_existing_job_urls() -> List[str]:
        """
        Retrieve URLs of existing jobs to avoid scraping duplicates.
        
        Returns:
            List of job URLs already in database
        """
        # TODO: Implement actual database query
        logger.info("[DATABASE] Fetching existing job URLs")
        return []  # Return empty list for now


class JobScraper:
    """
    Web scraper class for extracting job listings from job boards.
    Handles different job board formats and error scenarios.
    """
    
    def __init__(self):
        # Headers to mimic a real browser and avoid blocking
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
    
    async def scrape_jobs(self, url: str, job_type: str) -> List[JobListing]:
        """
        Main scraping function that extracts job listings from a given URL.
        
        Args:
            url: The job board URL to scrape
            job_type: Type of job being scraped (for logging/tracking)
            
        Returns:
            List of JobListing objects
            
        Raises:
            HTTPException: If scraping fails due to network or parsing errors
        """
        jobs = []
        
        try:
            logger.info(f"Starting scrape for {job_type} jobs from: {url}")
            
            # Make HTTP request with timeout and error handling
            async with httpx.AsyncClient(timeout=30.0, headers=self.headers) as client:
                response = await client.get(url)
                response.raise_for_status()
                
            # Parse HTML content
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Detect job board type and use appropriate parsing strategy
            if 'linkedin.com' in url.lower():
                jobs = await self._parse_linkedin_jobs(soup, url)
            elif 'indeed.com' in url.lower():
                jobs = await self._parse_indeed_jobs(soup, url)
            else:
                # Generic parsing for other job boards
                jobs = await self._parse_generic_jobs(soup, url)
            
            logger.info(f"Successfully scraped {len(jobs)} {job_type} jobs")
            
            # Save to database (avoiding duplicates)
            if jobs:
                await DatabaseManager.save_jobs(jobs)
            
            return jobs
            
        except httpx.TimeoutException:
            logger.error(f"Timeout while scraping {url}")
            raise HTTPException(status_code=408, detail="Request timeout while scraping jobs")
            
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error {e.response.status_code} while scraping {url}")
            raise HTTPException(status_code=e.response.status_code, detail=f"HTTP error: {e.response.status_code}")
            
        except Exception as e:
            logger.error(f"Unexpected error while scraping {url}: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Scraping failed: {str(e)}")
    
    async def _parse_linkedin_jobs(self, soup: BeautifulSoup, source_url: str) -> List[JobListing]:
        """Parse job listings from LinkedIn job search results."""
        jobs = []
        
        try:
            # LinkedIn job cards are typically in divs with specific classes
            # Note: LinkedIn frequently changes their HTML structure
            job_cards = soup.find_all('div', class_=['job-search-card', 'jobs-search-results__list-item'])
            
            for card in job_cards:
                try:
                    job = await self._extract_linkedin_job_data(card, source_url)
                    if job:
                        jobs.append(job)
                except Exception as e:
                    logger.warning(f"Failed to parse LinkedIn job card: {str(e)}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error parsing LinkedIn jobs: {str(e)}")
            
        return jobs
    
    async def _extract_linkedin_job_data(self, card: Tag, source_url: str) -> Optional[JobListing]:
        """Extract job data from a LinkedIn job card element."""
        try:
            # Extract job title
            title_element = card.find('h3', class_='base-search-card__title') or card.find('a', class_='job-title-link')
            job_title = title_element.get_text(strip=True) if title_element else "Title not found"
            
            # Extract company name
            company_element = card.find('h4', class_='base-search-card__subtitle') or card.find('a', class_='hidden-nested-link')
            company_name = company_element.get_text(strip=True) if company_element else "Company not found"
            
            # Extract location
            location_element = card.find('span', class_='job-search-card__location')
            location = location_element.get_text(strip=True) if location_element else "Location not found"
            
            # Extract job URL
            link_element = card.find('a', href=True)
            if link_element and link_element.get('href'):
                job_url = link_element['href']
                # Make URL absolute if it's relative
                if job_url.startswith('/'):
                    job_url = f"https://www.linkedin.com{job_url}"
            else:
                job_url = source_url  # Fallback to search URL
            
            return JobListing(
                job_title=job_title,
                company_name=company_name,
                location=location,
                job_url=job_url,
                scraped_from="LinkedIn"
            )
            
        except Exception as e:
            logger.warning(f"Error extracting LinkedIn job data: {str(e)}")
            return None
    
    async def _parse_indeed_jobs(self, soup: BeautifulSoup, source_url: str) -> List[JobListing]:
        """Parse job listings from Indeed job search results."""
        jobs = []
        
        try:
            # Indeed job cards are typically in divs with 'job_seen_beacon' class
            job_cards = soup.find_all('div', class_=['job_seen_beacon', 'slider_container'])
            
            for card in job_cards:
                try:
                    job = await self._extract_indeed_job_data(card, source_url)
                    if job:
                        jobs.append(job)
                except Exception as e:
                    logger.warning(f"Failed to parse Indeed job card: {str(e)}")
                    continue
                    
        except Exception as e:
            logger.error(f"Error parsing Indeed jobs: {str(e)}")
            
        return jobs
    
    async def _extract_indeed_job_data(self, card: Tag, source_url: str) -> Optional[JobListing]:
        """Extract job data from an Indeed job card element."""
        try:
            # Extract job title
            title_element = card.find('h2', class_='jobTitle') or card.find('a', {'data-jk': True})
            job_title = title_element.get_text(strip=True) if title_element else "Title not found"
            
            # Extract company name
            company_element = card.find('span', class_='companyName') or card.find('a', class_='turnstileLink')
            company_name = company_element.get_text(strip=True) if company_element else "Company not found"
            
            # Extract location
            location_element = card.find('div', class_='companyLocation')
            location = location_element.get_text(strip=True) if location_element else "Location not found"
            
            # Extract job URL
            link_element = card.find('h2', class_='jobTitle').find('a') if card.find('h2', class_='jobTitle') else None
            if link_element and link_element.get('href'):
                job_url = link_element['href']
                # Make URL absolute if it's relative
                if job_url.startswith('/'):
                    job_url = f"https://www.indeed.com{job_url}"
            else:
                job_url = source_url  # Fallback to search URL
            
            return JobListing(
                job_title=job_title,
                company_name=company_name,
                location=location,
                job_url=job_url,
                scraped_from="Indeed"
            )
            
        except Exception as e:
            logger.warning(f"Error extracting Indeed job data: {str(e)}")
            return None
    
    async def _parse_generic_jobs(self, soup: BeautifulSoup, source_url: str) -> List[JobListing]:
        """Generic parser for other job boards using common HTML patterns."""
        jobs = []
        
        try:
            # Try common job listing selectors
            potential_containers = [
                soup.find_all('div', class_=['job', 'job-listing', 'job-card', 'position']),
                soup.find_all('article', class_=['job', 'listing']),
                soup.find_all('li', class_=['job', 'job-item'])
            ]
            
            for container_list in potential_containers:
                if container_list:
                    for card in container_list[:10]:  # Limit to first 10 to avoid overwhelming
                        try:
                            job = await self._extract_generic_job_data(card, source_url)
                            if job:
                                jobs.append(job)
                        except Exception as e:
                            logger.warning(f"Failed to parse generic job card: {str(e)}")
                            continue
                    break  # Use first successful container type
                    
        except Exception as e:
            logger.error(f"Error parsing generic jobs: {str(e)}")
            
        return jobs
    
    async def _extract_generic_job_data(self, card: Tag, source_url: str) -> Optional[JobListing]:
        """Extract job data using generic patterns."""
        try:
            # Try to find job title using common patterns
            title_selectors = ['h1', 'h2', 'h3', '.title', '.job-title', '[class*="title"]']
            job_title = "Title not found"
            
            for selector in title_selectors:
                element = card.select_one(selector)
                if element:
                    job_title = element.get_text(strip=True)
                    break
            
            # Try to find company name
            company_selectors = ['.company', '[class*="company"]', '.employer', '[class*="employer"]']
            company_name = "Company not found"
            
            for selector in company_selectors:
                element = card.select_one(selector)
                if element:
                    company_name = element.get_text(strip=True)
                    break
            
            # Try to find location
            location_selectors = ['.location', '[class*="location"]', '.city', '[class*="city"]']
            location = "Location not found"
            
            for selector in location_selectors:
                element = card.select_one(selector)
                if element:
                    location = element.get_text(strip=True)
                    break
            
            # Try to find job URL
            link_element = card.find('a', href=True)
            job_url = source_url  # Default fallback
            
            if link_element and link_element.get('href'):
                href = link_element['href']
                if href.startswith('http'):
                    job_url = href
                elif href.startswith('/'):
                    # Extract domain from source_url and append relative path
                    from urllib.parse import urlparse
                    parsed = urlparse(source_url)
                    job_url = f"{parsed.scheme}://{parsed.netloc}{href}"
            
            return JobListing(
                job_title=job_title,
                company_name=company_name,
                location=location,
                job_url=job_url,
                scraped_from="Generic Job Board"
            )
            
        except Exception as e:
            logger.warning(f"Error extracting generic job data: {str(e)}")
            return None


# Initialize scraper instance
scraper = JobScraper()


# URL builders for different job categories
def build_linkedin_url(job_title: str, location: str = "") -> str:
    """Build LinkedIn job search URL for specific job title and location."""
    base_url = "https://www.linkedin.com/jobs/search"
    encoded_title = quote_plus(job_title)
    encoded_location = quote_plus(location) if location else ""
    
    url = f"{base_url}?keywords={encoded_title}"
    if encoded_location:
        url += f"&location={encoded_location}"
    
    return url


def build_indeed_url(job_title: str, location: str = "") -> str:
    """Build Indeed job search URL for specific job title and location."""
    base_url = "https://www.indeed.com/jobs"
    encoded_title = quote_plus(job_title)
    encoded_location = quote_plus(location) if location else ""
    
    url = f"{base_url}?q={encoded_title}"
    if encoded_location:
        url += f"&l={encoded_location}"
    
    return url


# API Endpoints
@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint providing API information."""
    return {
        "message": "Job Dashboard API",
        "version": "1.0.0",
        "endpoints": [
            "/jobs/software-engineer",
            "/jobs/security-engineer", 
            "/jobs/data-engineer"
        ]
    }


@app.get("/jobs/software-engineer", response_model=ScrapingResponse)
async def get_software_engineer_jobs(
    location: str = "United States",
    source: str = "linkedin"
) -> ScrapingResponse:
    """
    Scrape software engineer job listings.
    
    Args:
        location: Geographic location to search (default: United States)
        source: Job board to scrape from (linkedin/indeed, default: linkedin)
    
    Returns:
        ScrapingResponse with job listings
    """
    try:
        job_title = "Full Stack Java Engineer"
        
        # Build URL based on source
        if source.lower() == "indeed":
            url = build_indeed_url(job_title, location)
        else:
            url = build_linkedin_url(job_title, location)
        
        # Scrape jobs
        jobs = await scraper.scrape_jobs(url, "Software Engineer")
        
        return ScrapingResponse(
            success=True,
            job_count=len(jobs),
            jobs=jobs,
            message=f"Successfully scraped {len(jobs)} software engineer jobs"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in software engineer endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch software engineer jobs: {str(e)}")


@app.get("/jobs/security-engineer", response_model=ScrapingResponse)
async def get_security_engineer_jobs(
    location: str = "United States",
    source: str = "linkedin"
) -> ScrapingResponse:
    """
    Scrape security engineer job listings.
    
    Args:
        location: Geographic location to search (default: United States)
        source: Job board to scrape from (linkedin/indeed, default: linkedin)
    
    Returns:
        ScrapingResponse with job listings
    """
    try:
        job_title = "Cybersecurity Engineer"
        
        # Build URL based on source
        if source.lower() == "indeed":
            url = build_indeed_url(job_title, location)
        else:
            url = build_linkedin_url(job_title, location)
        
        # Scrape jobs
        jobs = await scraper.scrape_jobs(url, "Security Engineer")
        
        return ScrapingResponse(
            success=True,
            job_count=len(jobs),
            jobs=jobs,
            message=f"Successfully scraped {len(jobs)} security engineer jobs"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in security engineer endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch security engineer jobs: {str(e)}")


@app.get("/jobs/data-engineer", response_model=ScrapingResponse)
async def get_data_engineer_jobs(
    location: str = "United States", 
    source: str = "linkedin"
) -> ScrapingResponse:
    """
    Scrape data engineer job listings.
    
    Args:
        location: Geographic location to search (default: United States)
        source: Job board to scrape from (linkedin/indeed, default: linkedin)
    
    Returns:
        ScrapingResponse with job listings
    """
    try:
        job_title = "Data Engineer"
        
        # Build URL based on source
        if source.lower() == "indeed":
            url = build_indeed_url(job_title, location)
        else:
            url = build_linkedin_url(job_title, location)
        
        # Scrape jobs
        jobs = await scraper.scrape_jobs(url, "Data Engineer")
        
        return ScrapingResponse(
            success=True,
            job_count=len(jobs),
            jobs=jobs,
            message=f"Successfully scraped {len(jobs)} data engineer jobs"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in data engineer endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch data engineer jobs: {str(e)}")


# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return {"status": "healthy", "timestamp": "2024-01-01T00:00:00Z"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)