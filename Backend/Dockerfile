# Use Python 3.11.5 official image
FROM python:3.11.5

# Set working directory inside the container
WORKDIR /app

# Copy FastAPI backend files
COPY . .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 8080 for FastAPI
EXPOSE 8080

# Start FastAPI server
CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8080"]
