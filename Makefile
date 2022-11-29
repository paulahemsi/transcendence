
COMPOSE_FILE	:=	docker-compose.yml

all:	build

build:
		docker-compose -f $(COMPOSE_FILE) up --build

build-detach:
		docker-compose -f $(COMPOSE_FILE) up --build -d

build-db:
		docker-compose -f $(COMPOSE_FILE) up --build -d db

down:
		docker-compose -f $(COMPOSE_FILE) down 

front:
		cd transcendence-front ; npm start

back:
		mkdir -p transcendence-back/uploads
		cd transcendence-back ; npm run start:dev

update-dependencies:
		cd transcendence-front ; npm install 
		cd transcendence-back ; npm install 

reset:
	cd transcendence-front ; rm -rf node_modules; npm install 
	cd transcendence-back ; rm -rf node_modules; npm install 
