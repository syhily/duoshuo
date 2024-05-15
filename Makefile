project_name = duoshuo
image_name = syhily/duoshuo:latest

help: ## This help dialog.
	@grep -F -h "##" $(MAKEFILE_LIST) | grep -F -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

run-local: ## Run the app locally
	npm run dev

requirements: ## Install the required dependencies and upgrade them to the latest
	npx npm-check-updates -u && npm i && npm update && npm i

clean: ## Clean the docker and local build files
	make delete-container-if-exist
	docker rmi $(image_name) || true
	rm -rf dist
	rm -rf build

up: ## Run the project in a local container
	make up-silent
	make shell

build: ## Generate docker image
	docker build -t $(image_name) .

up-silent: ## Run local container in background
	make delete-container-if-exist
	docker run -d -p 4321:4321 --name $(project_name) $(image_name) ./app

delete-container-if-exist: ## Delete container if it exists
	(docker stop $(project_name) || true) && (docker rm $(project_name) || true)

shell: ## Run interactive shell in the container
	docker exec -it $(project_name) /bin/sh

stop: ## Stop the container
	docker stop $(project_name)

start: ## Start the container
	docker start $(project_name)
