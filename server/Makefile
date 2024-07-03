create-envs:
	@cp ./monero/.env.example ./monero/.env
	@cp ./.env.example ./.env
	@cp ./traefik/.env.example ./traefik/.env

create-network:
	@docker network create traefik

start-traefik:
	@docker compose -f ./traefik/docker-compose.yml up -d
	# @echo "Waiting for Traefik services to become healthy..."
	# @until docker ps -a --filter "health=healthy" --format '{{.Names}}' | grep traefik_proxy; do sleep 1; done
	# @echo "Traefik services are healthy"

start-monero:
	@docker compose -f ./monero/docker-compose.yml up -d
	# @echo "Waiting for Monero services to become healthy..."
	# @until docker ps -a --filter "health=healthy" --format '{{.Names}}' | grep monero_service; do sleep 1; done
	# @echo "Monero services are healthy"

create-wallet:
	@chmod +x ./monero/create-wallet.bash
	@./monero/create-wallet.bash

generate-wallet-from-keys:
	@chmod +x ./monero/generate-from-keys.bash
	@./monero/generate-from-keys.bash


add-wallet-transaction-listener:
	@docker exec -it --user=root monero-wallet-rpc bash -c "apk add nodejs npm && cd /home/node-app && npm i"
	@docker exec -it --user=root monero-wallet-rpc bash -c "monero-wallet-rpc --tx-notify 'node /home/node-app/init.js process_new_tip %s' "

start-application:
	@docker compose up -d

run-application-db-migration:
	@docker exec -it  xmrchat-back-end bash -c "bun run db:migrations:run"

start: create-envs create-network start-traefik start-monero create-wallet generate-wallet-from-keys start-application run-application-db-migration
	@echo "All services started successfully"


.PHONY: create-envs create-network start-traefik start-monero create-wallet generate-wallet-from-keys add-wallet-transaction-listener start-application run-application-db-migration start