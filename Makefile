
COMPOSE_FILE	:=	docker-compose.yml

all: build

build: 
	docker-compose -f $(COMPOSE_FILE) up --build -d

down:
	docker-compose -f $(COMPOSE_FILE) down 
