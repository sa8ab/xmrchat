# Define network name
NETWORK_NAME=traefik

.PHONY: create-network remove-network

# Target to create the Docker network
create-network:
	@echo "Creating Docker network $(NETWORK_NAME)..."
	@docker network create $(NETWORK_NAME)

# Target to remove the Docker network
remove-network:
	@echo "Removing Docker network $(NETWORK_NAME)..."
	@docker network rm $(NETWORK_NAME)

# Target to check if the Docker network exists
check-network:
	@docker network inspect $(NETWORK_NAME) > /dev/null 2>&1 && echo "Network $(NETWORK_NAME) exists." || echo "Network $(NETWORK_NAME) does not exist."

# Clean target to remove the network if it exists
clean: check-network
	@docker network inspect $(NETWORK_NAME) > /dev/null 2>&1 && $(MAKE) remove-network || echo "No network to remove."
