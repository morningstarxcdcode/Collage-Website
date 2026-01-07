.PHONY: up down build logs shell-backend shell-frontend

# Define colors
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
RESET  := $(shell tput -Txterm sgr0)

## Help: Show this help message
help:
	@echo ''
	@echo 'Usage:'
	@echo '  ${YELLOW}make${RESET} ${GREEN}<target>${RESET}'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  ${YELLOW}%-20s${RESET} %s\n", $$1, $$2}' $(MAKEFILE_LIST)

## Up: Start the application in development mode
up:
	@echo "Starting EduNexus..."
	docker-compose up -d

## Down: Stop the application
down:
	@echo "Stopping EduNexus..."
	docker-compose down

## Build: Rebuild containers
build:
	@echo "Rebuilding containers..."
	docker-compose build

## Logs: View logs
logs:
	docker-compose logs -f

## Shell API: Access backend shell
shell-api:
	docker-compose exec backend sh

## Shell Web: Access frontend shell
shell-web:
	docker-compose exec frontend sh
