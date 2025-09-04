FROM ubuntu:22.04

# 1) Install curl, bash, ca-certificates, and expect
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
      curl bash ca-certificates expect socat && \
    rm -rf /var/lib/apt/lists/*

# Download simplex-chat binary directly
RUN curl -L -o /usr/local/bin/simplex-chat \
    "https://github.com/simplex-chat/simplex-chat/releases/latest/download/simplex-chat-ubuntu-22_04-x86_64" && \
    chmod +x /usr/local/bin/simplex-chat

# Copy setup script to container
COPY setup.sh /app/setup.sh

RUN chmod +x /app/setup.sh

EXPOSE 5225

CMD ["bash", "-c", "\
    /app/setup.sh && \
   simplex-chat -p 5226 & \
   exec socat TCP-LISTEN:5225,fork,reuseaddr TCP:127.0.0.1:5226 \
"]