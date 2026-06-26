# Hugging Face Spaces Dockerfile
FROM python:3.10-slim

# Set up a non-root user (Hugging Face requires this)
RUN useradd -m -u 1000 user
USER user
ENV PATH="/home/user/.local/bin:$PATH"

WORKDIR /app

# Copy requirements and install
COPY --chown=user requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all backend files
COPY --chown=user . .

# Expose port 7860 which Hugging Face routes to
EXPOSE 7860

# Run FastAPI with uvicorn on port 7860
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
