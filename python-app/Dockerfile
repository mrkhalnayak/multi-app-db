# Use an official Python image as the base
FROM python:latest

# Set the working directory in the container
WORKDIR /app

# Copy the application files
COPY . /app

# Install necessary dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install uWSGI
RUN pip install uwsgi

# Expose the desired port (e.g., 8000 for uWSGI)
EXPOSE 8000

# Command to start the uWSGI server
CMD ["uwsgi", "--http", "0.0.0.0:8000", "--module", "app:app", "--processes", "4", "--threads", "2"]
