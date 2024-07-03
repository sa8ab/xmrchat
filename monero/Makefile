# Define variables
MONERO_REPO=https://github.com/monero-project/monero
LWS_REPO=https://github.com/vtnerd/monero-lws
LWS_BRANCH=release-v0.3_0.18

# Define directories
MONERO_DIR=monero
LWS_DIR=monero-lws

# Define Dockerfile names
MONERO_DOCKERFILE=Dockerfile.monero
LWS_DOCKERFILE=Dockerfile.lws

.PHONY: monero-setup

monero-setup: clone-repos copy-dockerfiles

clone-repos: $(MONERO_DIR) $(LWS_DIR)

$(MONERO_DIR):
	@echo "Cloning monero repository..."
	@git clone $(MONERO_REPO) $(MONERO_DIR)

$(LWS_DIR):
	@echo "Cloning monero-lws repository..."
	@git clone --branch $(LWS_BRANCH) $(LWS_REPO) $(LWS_DIR)

copy-dockerfiles: $(MONERO_DIR)/Dockerfile $(LWS_DIR)/Dockerfile

$(MONERO_DIR)/Dockerfile: $(MONERO_DOCKERFILE)
	@echo "Copying Dockerfile for monero..."
	@cp $(MONERO_DOCKERFILE) $(MONERO_DIR)/Dockerfile

$(LWS_DIR)/Dockerfile: $(LWS_DOCKERFILE)
	@echo "Copying Dockerfile for monero-lws..."
	@cp $(LWS_DOCKERFILE) $(LWS_DIR)/Dockerfile

# Clean up cloned directories
clean:
	@echo "Cleaning up..."
	@rm -rf $(MONERO_DIR) $(LWS_DIR)
