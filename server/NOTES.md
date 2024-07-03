# Notes

## Deployment

### Prerequisites

-   [Bun](https://bun.sh) (minimum v1.0.20)
-   [Redis](https://redis.io/) (minimum v6)
-   [PostgreSQL](https://www.postgresql.org/) (minimum v13)

### Installation

1. Clone the repository.
2. Run `bun install` to install the dependencies.

### Configuration

In order to allow the application to connect to the database, Redis server, and Monero Wallet RPC, set the appropriate environment variables in the `.env` file before running the application.

The application can be configured through the `.env` file. See [src/env.ts](./src/env.ts) for a list of environment variables, descriptions, and default values.

### Running

First, run database migrations with `bun db:migrations:run`.

Then, start the backend with `bun app` and the frontend with `bun frontend`.

### Production

The frontend has to be built for production before deployment. Run `bun frontend:build` to build the frontend. Then, move the built files to a web server.
See the following for an example deployment setup:

The application can be deployed to a server with a systemd service file and a reverse proxy. Here is an example of a systemd service file, assuming the application is installed in `/opt/XMRChat`, and that the backend will run as the `xmrchat` user:

```ini
[Unit]
Description=XMRChat Service
After=network.target

[Service]
Type=simple
User=xmrchat
WorkingDirectory=/opt/XMRChat # Change this to the directory where the application is installed

ExecStart=bun run /opt/XMRChat/src/index.ts # Absolute path to the backend entrypoint file
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Here is an example of a reverse proxy configuration for Nginx:

```nginx
upstream backend {
	server localhost:8000; # Change this to the address and port where the backend is running
}

server {
	listen 80;
	server_name example.com; # Change this to the domain name where the application is hosted

	root /var/www/site; # Change this to the directory where the frontend is built
	index index.html;

	location / {
		try_files $uri $uri/ /index.html;
	}

	location /api {
		proxy_pass http://backend;
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
	}
}
```

## Address Generation

Tip addresses for reserving are generated from the server's Monero wallet.

Tip addresses for pages are generated as an integrated address from the **private view key** and the **primary address** of the user's Monero wallet.
