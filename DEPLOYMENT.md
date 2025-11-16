# Production Deployment Guide

This guide covers deploying the No-Code Data Analytics platform to production environments.

## 📋 Pre-Deployment Checklist

### Security
- [ ] Generate new API keys (OpenAI, Groq, Gemini)
- [ ] Create production `.env` file (never commit to git)
- [ ] Set strong secret keys for widget API keys
- [ ] Configure CORS for specific production domains only
- [ ] Enable HTTPS/SSL certificates
- [ ] Set up rate limiting on API endpoints
- [ ] Configure firewall rules

### Environment
- [ ] Python 3.11+ installed
- [ ] Node.js 18+ installed
- [ ] Production database configured (if replacing JSON storage)
- [ ] Backup storage for chat histories and alerts
- [ ] Monitoring tools configured
- [ ] Log aggregation set up

## 🚀 Deployment Options

### Option 1: Docker Deployment (Recommended)

#### 1. Create Dockerfile for Backend

Create `backend/Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY . .

# Create necessary directories
RUN mkdir -p chat_histories anomaly_alerts workflows embed_widgets

# Expose port
EXPOSE 8000

# Run with Gunicorn
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000", "main:app"]
```

#### 2. Create Dockerfile for Frontend

Create `frontend/Dockerfile`:

```dockerfile
FROM node:18-alpine AS build

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Build application
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

Create `frontend/nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://backend:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

#### 3. Create docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    container_name: analytics-backend
    ports:
      - "8000:8000"
    environment:
      - GROQ_API_KEY=${GROQ_API_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    volumes:
      - ./backend/chat_histories:/app/chat_histories
      - ./backend/anomaly_alerts:/app/anomaly_alerts
      - ./backend/workflows:/app/workflows
      - ./backend/embed_widgets:/app/embed_widgets
    restart: unless-stopped

  frontend:
    build: ./frontend
    container_name: analytics-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  backend-data:
```

#### 4. Deploy with Docker Compose

```bash
# Create production .env file
cp backend/.env.example backend/.env
# Edit backend/.env with your production API keys

# Build and start services
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 2: Traditional Server Deployment

#### Backend Deployment (Ubuntu/Debian)

```bash
# 1. Install system dependencies
sudo apt update
sudo apt install -y python3.11 python3.11-venv nginx

# 2. Clone repository
cd /var/www
sudo git clone https://github.com/lokeshwaranbm/No-code-data-analytics-.git analytics
cd analytics

# 3. Set up backend
cd backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
pip install gunicorn

# 4. Create production .env
cp .env.example .env
# Edit .env with production API keys
nano .env

# 5. Create systemd service
sudo nano /etc/systemd/system/analytics-backend.service
```

Add to service file:

```ini
[Unit]
Description=Analytics Backend
After=network.target

[Service]
Type=notify
User=www-data
WorkingDirectory=/var/www/analytics/backend
Environment="PATH=/var/www/analytics/backend/venv/bin"
ExecStart=/var/www/analytics/backend/venv/bin/gunicorn -w 4 -k uvicorn.workers.UvicornWorker -b 127.0.0.1:8000 main:app
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Start backend service
sudo systemctl daemon-reload
sudo systemctl enable analytics-backend
sudo systemctl start analytics-backend
sudo systemctl status analytics-backend
```

#### Frontend Deployment

```bash
# 1. Build frontend
cd /var/www/analytics/frontend
npm install
npm run build

# 2. Configure Nginx
sudo nano /etc/nginx/sites-available/analytics
```

Add to Nginx config:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/analytics/frontend/dist;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/analytics /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### SSL/HTTPS Setup with Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
sudo certbot renew --dry-run
```

### Option 3: Cloud Platform Deployment

#### Heroku

Create `Procfile` in root:

```
web: cd backend && gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app
```

Deploy:

```bash
heroku create your-app-name
heroku config:set GROQ_API_KEY=your_key
heroku config:set OPENAI_API_KEY=your_key
heroku config:set GEMINI_API_KEY=your_key
git push heroku main
```

#### AWS EC2

1. Launch EC2 instance (Ubuntu 22.04, t3.medium or larger)
2. Configure security groups (ports 80, 443, 22)
3. SSH into instance and follow "Traditional Server Deployment" steps
4. Configure Elastic IP for static IP address
5. Use Route 53 for DNS management

#### Google Cloud Platform (Cloud Run)

```bash
# Build and push Docker images
gcloud builds submit --tag gcr.io/YOUR_PROJECT/analytics-backend ./backend
gcloud builds submit --tag gcr.io/YOUR_PROJECT/analytics-frontend ./frontend

# Deploy backend
gcloud run deploy analytics-backend \
  --image gcr.io/YOUR_PROJECT/analytics-backend \
  --platform managed \
  --region us-central1 \
  --set-env-vars GROQ_API_KEY=your_key,OPENAI_API_KEY=your_key

# Deploy frontend
gcloud run deploy analytics-frontend \
  --image gcr.io/YOUR_PROJECT/analytics-frontend \
  --platform managed \
  --region us-central1
```

#### Azure App Service

```bash
# Create resource group
az group create --name analytics-rg --location eastus

# Create App Service plan
az appservice plan create --name analytics-plan --resource-group analytics-rg --sku B1 --is-linux

# Create web app for backend
az webapp create --resource-group analytics-rg --plan analytics-plan \
  --name analytics-backend --runtime "PYTHON:3.11"

# Deploy backend
cd backend
az webapp up --name analytics-backend --resource-group analytics-rg

# Configure environment variables
az webapp config appsettings set --name analytics-backend --resource-group analytics-rg \
  --settings GROQ_API_KEY=your_key OPENAI_API_KEY=your_key
```

## 🔒 Security Configuration

### Backend Security (main.py)

```python
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

# Rate limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS - production config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-domain.com"],  # Specific domain only
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Trusted hosts
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["your-domain.com", "www.your-domain.com"]
)

# Rate limit endpoints
@app.post("/anomalies/detect")
@limiter.limit("10/minute")
async def detect_anomalies(request: Request, ...):
    ...
```

### Environment Variables

Never commit `.env` files. Use environment-specific configs:

**Development** (`.env.development`):
```bash
ENVIRONMENT=development
DEBUG=true
CORS_ORIGINS=*
```

**Production** (`.env.production`):
```bash
ENVIRONMENT=production
DEBUG=false
CORS_ORIGINS=https://your-domain.com
GROQ_API_KEY=prod_key_here
OPENAI_API_KEY=prod_key_here
GEMINI_API_KEY=prod_key_here
SECRET_KEY=strong_random_secret_key
```

## 📊 Monitoring and Logging

### Application Monitoring

Install monitoring tools:

```bash
pip install prometheus-client sentry-sdk
```

Add to `main.py`:

```python
import sentry_sdk
from prometheus_client import Counter, Histogram, generate_latest

# Initialize Sentry
sentry_sdk.init(
    dsn="your_sentry_dsn",
    environment="production",
    traces_sample_rate=1.0,
)

# Prometheus metrics
request_count = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint'])
request_duration = Histogram('http_request_duration_seconds', 'HTTP request duration')

@app.middleware("http")
async def monitor_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    
    request_count.labels(method=request.method, endpoint=request.url.path).inc()
    request_duration.observe(duration)
    
    return response

@app.get("/metrics")
async def metrics():
    return Response(generate_latest(), media_type="text/plain")
```

### Log Aggregation

Configure structured logging:

```python
import logging
import json
from datetime import datetime

# Structured JSON logging
class JSONFormatter(logging.Formatter):
    def format(self, record):
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "level": record.levelname,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
        }
        return json.dumps(log_data)

handler = logging.StreamHandler()
handler.setFormatter(JSONFormatter())
logging.basicConfig(level=logging.INFO, handlers=[handler])
```

## 🔄 Backup and Recovery

### Automated Backups

Create backup script `scripts/backup.sh`:

```bash
#!/bin/bash

BACKUP_DIR="/backups/analytics"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup directories
tar -czf "$BACKUP_DIR/chat_histories_$DATE.tar.gz" backend/chat_histories/
tar -czf "$BACKUP_DIR/anomaly_alerts_$DATE.tar.gz" backend/anomaly_alerts/
tar -czf "$BACKUP_DIR/workflows_$DATE.tar.gz" backend/workflows/
tar -czf "$BACKUP_DIR/embed_widgets_$DATE.tar.gz" backend/embed_widgets/

# Keep only last 7 days
find "$BACKUP_DIR" -type f -mtime +7 -delete

echo "Backup completed: $DATE"
```

Add to crontab (daily at 2 AM):

```bash
0 2 * * * /var/www/analytics/scripts/backup.sh >> /var/log/analytics-backup.log 2>&1
```

### Disaster Recovery

```bash
# Restore from backup
cd /var/www/analytics
tar -xzf /backups/analytics/chat_histories_20240115_020000.tar.gz
tar -xzf /backups/analytics/anomaly_alerts_20240115_020000.tar.gz
tar -xzf /backups/analytics/workflows_20240115_020000.tar.gz
tar -xzf /backups/analytics/embed_widgets_20240115_020000.tar.gz

# Restart services
sudo systemctl restart analytics-backend
sudo systemctl restart nginx
```

## 📈 Performance Optimization

### Backend Optimizations

1. **Enable Gzip compression** in FastAPI:

```python
from fastapi.middleware.gzip import GZipMiddleware
app.add_middleware(GZipMiddleware, minimum_size=1000)
```

2. **Add caching** for expensive operations:

```python
from functools import lru_cache
import redis

redis_client = redis.Redis(host='localhost', port=6379, db=0)

@lru_cache(maxsize=100)
def get_cached_analysis(filename: str):
    # Cache analysis results
    pass
```

3. **Database connection pooling** (if using PostgreSQL):

```python
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool

engine = create_engine(
    "postgresql://user:pass@localhost/db",
    poolclass=QueuePool,
    pool_size=20,
    max_overflow=10
)
```

### Frontend Optimizations

1. **Code splitting** in vite.config.js:

```javascript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
          'charts': ['plotly.js'],
          'ui': ['@mui/material', '@mui/icons-material'],
        }
      }
    }
  }
})
```

2. **Enable service worker** for offline support
3. **Lazy load components** with React.lazy()

## 🧪 Health Checks

Add health check endpoints:

```python
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "version": "1.0.0"
    }

@app.get("/health/ready")
async def readiness_check():
    # Check dependencies (database, file system, etc.)
    checks = {
        "database": check_database_connection(),
        "file_system": check_file_system_writable(),
        "api_keys": check_api_keys_configured(),
    }
    
    if all(checks.values()):
        return {"status": "ready", "checks": checks}
    else:
        raise HTTPException(status_code=503, detail="Service not ready")
```

## 📞 Support and Maintenance

### Update Procedure

```bash
# 1. Pull latest changes
git pull origin main

# 2. Update backend dependencies
cd backend
source venv/bin/activate
pip install -r requirements.txt --upgrade

# 3. Update frontend dependencies
cd ../frontend
npm update

# 4. Rebuild frontend
npm run build

# 5. Restart services
sudo systemctl restart analytics-backend
sudo systemctl restart nginx

# 6. Verify deployment
curl https://your-domain.com/health
```

### Monitoring Checklist

- [ ] Server CPU/Memory usage
- [ ] API response times
- [ ] Error rates (4xx, 5xx)
- [ ] Workflow execution success rate
- [ ] Widget embed load times
- [ ] Anomaly detection accuracy
- [ ] Storage usage (chat histories, alerts)
- [ ] SSL certificate expiration

## 📄 License and Compliance

Ensure compliance with:
- GDPR (if processing EU user data)
- CCPA (if processing California resident data)
- OpenAI/Groq/Gemini API Terms of Service
- Your organization's data retention policies

Add privacy policy and terms of service to your application.

---

**Need help?** Check the main [README.md](README.md) for basic usage or [QUICKSTART_NEW_FEATURES.md](QUICKSTART_NEW_FEATURES.md) for feature-specific guidance.
