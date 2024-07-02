<h1 align="center">
  <br>
  <a href="https://xmrchat.com/"><img src="https://xmrchat.com/images/xmrchat-logo.png" alt="XMRChat" width="200"></a>
  <br>
  XMRChat
  <br>
</h1>
<h4 align="center">A Complete SaaS for Online Tipping Solution on <a href="https://www.getmonero.org/" target="_blank">Monero Cryptocurrency Network (XMR)</a>.</h4>

## Overview

XMRChat is a tip-for-chat application. Users can set up a page and have others send chat messages in exchange for XMR. The application is built with a focus on privacy and security, and it is designed to be self-hosted.

### Table of Contents 🤸

- [Technology Stack 🚀](#tech-stack)

- Business Strategy

  - [Payment Strategy 🧾](#payment-strategy)

- [Requirements 📝](#requirements)
- [Project Structure 📍](#structure)

- [Install & Build 🛠️](#install-and-build)

  - [Traefik](#traefik)
  - [Monero](#monero)
  - [Server](#server)
  - [Client](#client)

## <a name="tech-stack">Technology Stack 🚀</a>

- **Client Side:**
  - **Framework:** [Nuxt Js](https://nuxt.com/) - [Vue Js](https://vuejs.org/)
  - **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Server Side:**

  - **Framework:** [Elysia Js](https://elysiajs.com/)
  - **Language:** [TypeScript](https://www.typescriptlang.org/)
  - **Runtime:** [Bun](https://bun.sh)
  - **Cache:** [Redis](https://redis.io/)
  - **ORM:** [Kysely](https://kysely.dev/)
  - **Database:** [PostgreSQL](https://www.postgresql.org/)

- **Infrastructure:**

  - **Containerization:** [Docker 🐳](https://www.docker.com/)
  - **Gateway:** [Traefik](https://traefik.io/)

- **Payment Providers:**
  - **Monero:**
    - [Monero Project](https://www.docker.com/)
    - wallet Server : [monero-lws](https://github.com/vtnerd/monero-lws)

## Business Strategy: <a name="payment-strategy">Payment</a>

The service uses a one-time payment strategy. During the deployment setup process, you will need to provide your Monero wallet address and set the service price. After clients register, they will configure their page by specifying details such as name and unique URL path. Once the service price is paid, their page is now public, and they can share their page links with their audience to receive tips.

## <a name="requirements">Requirements 📝</a>

- [Docker 🐳](https://docs.docker.com/engine/install/)
- [git](https://git-scm.com/downloads)
- [Monero wallet](https://www.getmonero.org/downloads/#gui)

## <a name="structure">Project Structure 📍</a>

- [Server](./server/): Contains the backend code.

  - [db](./server/src/db/): Contains the database connection and migration files.
  - [routes](./server/src/routes/): Contains the route handlers.
  - [schemas](./server/src/schemas/): Contains the route schemas definitions for validation.
  - [services](./server/src/services/): Contains the service classes.
  - [types](./server/src/types/): Contains type definitions.
  - [utils](./server/src/utils/): Contains utility functions.
  - [env.ts](./server/src/env.ts): Contains the environment variables and their default values.
  - [index.ts](./server/src/index.ts): The entrypoint file for the backend.

- [Client](./client/): Contains the frontend code.
- [Monero](./monero/): Contains Monero network services (Monero Project & Monero-LWS).
- [Traefik](./traefik/): Contains Traefik setups

## <a name="install-and-build">Install & Build 🛠️</a>

### <a name="traefik">1. Traefik</a>

First of all you must create network that containers communicate over it.

```console
docker network create traefik
```

then setup the env

```console
cd traefik
cp .env.example .env
```

Now change the .env with yours and run the container.

> [!WARNING]  
> The **password** must be **Hashed** in the env and also if you add that in compose file the "$" characters must be doubled to not recognized as variable by docker engine.

```console
docker compose up
```

### <a name="monero">2. Monero</a>

You can use Make file by below command in Monero directory to get and config Monero related repositories.

```console
cp monero
make monero-setup
```

or:

```console
cp monero
git clone https://github.com/monero-project/monero.git
git clone https://github.com/vtnerd/monero-lws/tree/release-v0.3_0.18
cp Dockerfile.monero ./monero/Dockerfile
cp Dockerfile.lws ./monero-lws/Dockerfile
```

Run the container :

```console
docker compose up -d
```

Because the Monero daemon must sync with the network, it may take a long time. You can monitor this process by checking the logs:

```console
docker compose logs -f
```

After it is synced and ready, go next.

### <a name="server">3. Server</a>

```console
cd server
cp .env.example
```

Change .env file with yours.

```console
docker compose up -d
```

### <a name="client">4. Client</a>

```console
cd client
cp .env.example
```

Change .env file with yours. and also change the env at the end of "Dockerfile" file.

```console
docker compose up -d
```

## Notes

See [NOTES.md](./NOTES.md) for additional notes and information about the technical details of the project.

## License

This project is licensed under the Apache License 2.0.
For the full license text, please see the [LICENSE](./LICENSE) file in the root of this repository.

### Notice

A NOTICE file has been included in the root of this repository. This file contains acknowledgments and notices required by the Apache License 2.0.

Pursuant to the terms of the Apache License 2.0, the NOTICE file must be included in redistributions of this software.
