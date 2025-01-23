<h1 align="center">
  <br>
  <a href="https://xmrchat.com/"><img src="https://xmrchat.com/images/xmrchat-logo.png" alt="XMRChat" width="200"></a>
  <br>
  XMRChat
  <br>
</h1>
<h4 align="center">A Complete SaaS for Online Tipping Solution on <a href="https://www.getmonero.org/" target="_blank">Monero Cryptocurrency Network (XMR)</a>.</h4>

## Overview

XMRChat is a tip-for-chat application. Users can set up a page and have others send chat messages in exchange for XMR. The application is built with a focus on privacy and security.

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

- [Development](#development)

## <a name="tech-stack">Technology Stack 🚀</a>

- **Client Side:**
  - **Framework:** [Nuxt Js](https://nuxt.com/) - [Vue Js](https://vuejs.org/)
  - **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Server Side:**

  - **Framework:** [Nest Js](https://nestjs.com/)
  - **Language:** [TypeScript](https://www.typescriptlang.org/)
  - **Cache:** [Redis](https://redis.io/)
  - **ORM:** [TypeORM](https://typeorm.io/)
  - **Database:** [PostgreSQL](https://www.postgresql.org/)

- **Infrastructure:**

  - **Containerization:** [Docker 🐳](https://www.docker.com/)
  - **Gateway:** [Traefik](https://traefik.io/)

- **Payment Providers:**
  - **Monero:**
    - [Monero Project](https://www.getmonero.com/)
    - wallet Server : [monero-lws](https://github.com/vtnerd/monero-lws)

## Business Strategy: <a name="payment-strategy">Payment</a>

The service uses a one-time payment strategy. During the deployment setup process, you will need to provide your Monero wallet address and set the service price. After clients register, they will configure their page by specifying details such as name and unique URL path. Once the service price is paid, their page is now public, and they can share their page links with their audience to receive tips.

## <a name="requirements">Requirements 📝</a>

- [Docker 🐳](https://docs.docker.com/engine/install/)
- [Monero-lws Instance](https://github.com/vtnerd/monero-lws)
- A Monero Wallet

## <a name="structure">Project Structure 📍</a>

- [Server](./server/): Contains the backend code ( Nest JS ).
- [Client](./client/): Contains the frontend code ( Nuxt JS ).
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
docker compose up -d
```

### <a name="monero">2.1. Monero</a>

Create and run a monero node. If you already have a synced node with zmq enabled skip to next step.

In `monero` directory clone the monero github repo to a folder called `monero-node`:

```console
cd monero
git clone https://github.com/monero-project/monero.git monero-node
```

The cloned repo has a Dockerfile in the root directory. In last line of Dockerfile comment out CMD command.

```
# CMD ["--p2p-bind ...
```

### <a name="monero-lws">2.2 Monero-LWS</a>

In `monero` directory clone monero-lws repository on branch `release-v0.3_0.18`:

```console
git clone -b release-v0.3_0.18 https://github.com/vtnerd/monero-lws
```

From last line of Dockerfile remove ENTRYPOINT and CMD and replace it with only `ENTRYPOINT ["monero-lws-daemon"]`

Final Dockerfile will be ending like this:

```console
...
EXPOSE 8443

ENTRYPOINT ["monero-lws-daemon"]
```

### <a name="monero-lws">2.3. Run Monero and Monero-LWS</a>

The directories after following the steps would look like this.

```
└── xmrchat/
    ├── client
    ├── monero/
    │   ├── monero-node/
    │   ├── monero-lws/
    │   └── docker-compose.yml
    ├── server
    └── traefik
```

In `/xmrchat/monero` directory run the containers:

```console
docker compose up -d
```

Because the Monero daemon must sync with the network, it may take a long time. You can monitor this process by checking the logs:

```console
docker compose logs -f
```

You should make sure it is synced and ready, in the meantime you can go to next steps.

### <a name="server">3. Server</a>

Go to `/xmrchat/server` directory and create your `.env` file from `.env.example`.

```console
cp .env.example .env
```

Open the .env file and change the values file with yours. the variables have descriptions on how to set them.

Then run the containers:

```console
docker compose up -d
```

### <a name="client">4. Client</a>

```console
cd client
cp .env.example .env
```

Change .env file with yours.

```console
docker compose up -d
```

## <a name="development">Development</a>

For development you might not need monero or monero-lws if you don't make tips or create new pages ( any payments related to monero ). If you need lws instance access or can't run yours please contact us.

### Server

Add your .env file based on .env.example.

Run backend locally with docker-compose.dev.yml file

```console
docker compose -f docker-compose.dev.yml up -d
```

Then run the Nest project itself use node version more than 20.x.x

```
npm i
npm run start:dev
```

### Client

Add your .env based on .env.example, then run the project:

```
npm i
npm run dev
```

## License

This project is licensed under the Apache License 2.0.
For the full license text, please see the [LICENSE](./LICENSE) file in the root of this repository.

### Notice

A NOTICE file has been included in the root of this repository. This file contains acknowledgments and notices required by the Apache License 2.0.

Pursuant to the terms of the Apache License 2.0, the NOTICE file must be included in redistributions of this software.
