# Docker Configuration

This directory contains configuration files for Dockerizing the EduNexus application.

## Directory Structure

- `nginx/`: Nginx configuration files.
  - `default.conf`: Default server block configuration.

## Usage

The root `docker-compose.yml` references files in this directory where applicable, or you can use these configurations to build custom images.

To start the application:

```bash
docker-compose up --build
```
