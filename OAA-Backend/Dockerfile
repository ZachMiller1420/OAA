# Stage 1: Build the Flask app
FROM python:3.12-slim as build-stage

# Set the working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose the port that Flask will run on
EXPOSE 5000

# Command to run the Flask app
CMD ["python", "app.py"]