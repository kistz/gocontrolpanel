# GoControlPanel

A Dockerized management panel for dedicated Trackmania servers. Works both standalone and with existing stacks like [PyPlanet](#pyplanetevosc-stack-setup) or [EvoSC](#pyplanetevosc-stack-setup) and others.

## Table of Contents

- [Overview](#overview)
  - [Features](#features)
    - [Server Settings](#server-settings)
    - [Game Management](#game-management)
    - [Maps Management](#maps-management)
    - [Player Management](#player-management)
    - [Live Match](#live-match)
    - [Files Management](#files-management)
    - [Interface Editor](#interface-editor)
    - [User Management](#user-management)
    - [Server Management](#server-management)
- [Docker Setup](#docker-setup)
  - [Prerequisites](#prerequisites)
  - [Getting Started](#getting-started)
    - [New Stack Setup](#new-stack-setup)
    - [PyPlanet/EvoSC Stack Setup](#pyplanetevosc-stack-setup)
  - [Troubleshooting](#troubleshooting)
  - [Contributing](#contributing)
  - [License](#license)

# Overview

**GoControlPanel** is a management panel designed for dedicated Trackmania servers. It provides an easy-to-use interface for managing server settings, players andd maps. The panel can be run as a standalone service or integrated with other server controllers like **PyPlanet** or **EvoSC**.

## Features

**Server Settings**

Manage your general server settings like the server name, password, and other configurations.

![Settings Page](https://i.imgur.com/iguu7Az.png "Settings Page")

**Game Management**

Manage your game settings, this includes map management and mode settings.

![Game Page](https://i.imgur.com/23ZazeQ.png "Game Page")
![Mode Settings Page](https://i.imgur.com/VeDGg0x.png "Mode Settings Page")

**Maps Management**

Manage your maps, including adding local maps, changing map order and a jukebox.

![Maps Page](https://i.imgur.com/ptCwgvj.png "Maps Page")
![Map Jukebox Page](https://i.imgur.com/lVazn2e.png "Map Jukebox Page")

**Player Management**

Manage your players, including banning players and managing blacklists and guestlists.

![Players Page](https://i.imgur.com/hreZiWz.png "Players Page")

**Live Match**

Monitor live matches, including player scores and match status.

![Live Match Page](https://i.imgur.com/YN2o70M.png "Live Match Page")

**Files Management**

Manage your server files, including uploading, deleting and editing files.

![Files Page](https://i.imgur.com/gN4Tt0W.png "Files Page")
![File Editor Page](https://i.imgur.com/TEaogHH.png "File Editor Page")

**Interface Editor**

Edit the interface of your server, create your own interface (still in development) and manage chat message formatting.

![Interface Editor Page](https://i.imgur.com/sqmN4VB.png "Interface Editor Page")
![Chat Message Editor Page](https://i.imgur.com/NPPVIez.png "Chat Message Editor Page")

**User Management**

Manage users, including adding new users, managing roles and permissions.

![User Management Page](https://i.imgur.com/aOoWkWl.png "User Management Page")

**Server Management**

Manage your servers, add new servers and configure the server settings.

![Server Management Page](https://i.imgur.com/3XMGL6m.png "Server Management Page")

# Docker Setup

This repository provides a **Docker Compose** configuration to set up and run **GoControlPanel** and its dependencies using Docker containers.

## Prerequisites

Before using this `docker-compose.yml` file, ensure you have the following installed on your system:

- **Docker**: [Install Docker](https://www.docker.com/get-started)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)

You will also need some credentials for the **Nadeo API** to configure the **GoControlPanel**. You can obtain these credentials from the [Nadeo API manager](https://api.trackmania.com/manager). Additionally, you will need a dedicated server login and password, which can be found in the [dedicated server manager](https://www.trackmania.com/player/dedicated-servers).

## Getting Started

This guide will help you set up and run the services for both completely new stacks and with existing stacks like [PyPlanet](#pyplanetevosc-stack-setup) or [EvoSC](#pyplanetevosc-stack-setup). There are also some boilerplate `docker-compose.yml` files available in the [docker](./docker/) folder for a variety of server controllers. Just move into the folder of your choice, plugin your own configurations and run the `docker compose up -d --build` command to start the services.

## New Stack Setup

This section will guide you through setting up a new stack using the provided `docker-compose.yml` file.

### 1. Clone the Repository

```bash
git clone https://github.com/MRegterschot/gocontrolpanel.git
cd gocontrolpanel
```

### 2. Modify the Configuration

Make sure to update the environment variables for the services in your `docker-compose.yml` file:

- **GoControlPanel Environment Variables**:

  - `NEXTAUTH_URL`, `NEXTAUTH_SECRET`: NextAuth configuration for authentication.
  - `CONNECTOR_API_KEY`: API key for the GbxConnector (can be any string).
  - `DEFAULT_ADMINS`: Comma-separated list of default admin logins. Probably your own login, e.g., `v8vgGbx_TuKkBabAyn7nsQ`.
  - **NADEO Configurations**: Make sure to update `NADEO_CLIENT_ID`, `NADEO_CLIENT_SECRET`, `NADEO_REDIRECT_URI`, `NADEO_SERVER_LOGIN`, `NADEO_SERVER_PASSWORD` and `NADEO_CONTACT` with your valid NADEO API credentials. Nadeo API credentials can be obtained from the [Nadeo API manager](https://api.trackmania.com/manager). And the server login and password can be obtained from the [dedicated server manager](https://www.trackmania.com/player/dedicated-servers).

- **GbxConnector Environment Variables**:

  - `SERVER_RECONNECT_INTERVAL`: Interval time in seconds for the server to reconnect.
  - `JWT_SECRET`: Secret key for JWT authentication.
  - `INTERNAL_API_KEY`: Internal API key for GbxConnector. Same key as `CONNECTOR_API_KEY` in GoControlPanel.
  - `LOG_LEVEL`: Set the desired logging level (e.g., `DEBUG`).

- **Dedicated Server Environment Variables**:
  - `TM_MASTERSERVER_LOGIN`: Login for the dedicated server (same as `NADEO_SERVER_LOGIN` in GoControlPanel).
  - `TM_MASTERSERVER_PASSWORD`: Password for the dedicated server (same as `NADEO_SERVER_PASSWORD` in GoControlPanel).

### 3. Start the Services

Run the following command to start all services defined in the `docker-compose.yml` file:

```bash
docker compose up -d --build
```

> **Note:** The `--build` flag is only needed on the first run.

### 4. Access the GoControlPanel

That's it! You can now access your **GoControlPanel** at `http://localhost:3000` or your own configured url.

---

## PyPlanet/EvoSC Stack Setup

This section will guide you through setting up the **GoControlPanel** with an existing **PyPlanet** or **EvoSC** stack.

### 1. Navigate to Your Existing Stack Directory

First you need to navigate to your existing stack directory. Navigate to the directory where your `docker-compose.yml` file is located.

### 1. Clone the Repository

```bash
git clone https://github.com/MRegterschot/gocontrolpanel.git
```

### 2. Create Database

Create a new database for GoControlPanel in your existing database service. For the default PyPlanet and EvoSC stacks, this is usually a MariaDB database.
The container name is likely something like `<current-folder>-db-1`.

1. Log into the database container.

```bash
docker exec -it <container-name> mariadb -u root -p
```

> **Note:** The password `secret` is the default, but it may differ depending on your `docker-compose.yml` setup.

2. Create a new database:

```sql
CREATE DATABASE gocontrolpanel;
```

3. Create a new user and grant permissions:

```sql
CREATE USER 'gocontrolpanel'@'%' IDENTIFIED BY 'VettePanel123';
GRANT ALL PRIVILEGES ON gocontrolpanel.* TO 'gocontrolpanel'@'%';
FLUSH PRIVILEGES;
```

### 3. Modify the Configuration

Paste the following configuration into your existing `docker-compose.yml` file.

```yaml
gocontrolpanel:
  image: marijnregterschot/gocontrolpanel:latest
  build:
    context: ./gocontrolpanel
    dockerfile: Dockerfile
    args:
      - CONNECTOR_URL=http://gbxconnector:6980 # Use the internal Docker network for communication
      - DATABASE_URL=mysql://gocontrolpanel:VettePanel123@db:3306/gocontrolpanel
      - DB_TYPE=mysql
  restart: unless-stopped
  environment:
    NEXTAUTH_URL: http://localhost:3000
    NEXTAUTH_SECRET:
    CONNECTOR_API_KEY:
    DEFAULT_ADMINS:
    NADEO_CLIENT_ID:
    NADEO_CLIENT_SECRET:
    NADEO_REDIRECT_URI: http://localhost:3000/api/auth/callback/nadeo
    NADEO_SERVER_LOGIN:
    NADEO_SERVER_PASSWORD:
    NADEO_CONTACT: GoControlPanel / <your contact info>
    REDIS_URI: redis://redis:6379
  depends_on:
    - db
    - redis

gbxconnector:
  image: marijnregterschot/gbxconnector:latest
  restart: unless-stopped
  environment:
    PORT: 6980
    SERVER_RECONNECT_INTERVAL: 15
    JWT_SECRET:
    INTERNAL_API_KEY: # Same as the one in gocontrolpanel
    LOG_LEVEL: DEBUG
  volumes:
    - ./gocontrolpanel/servers.json:/app/servers.json

nginx:
  image: nginx:latest
  restart: unless-stopped
  ports:
    - 3000:80
  volumes:
    - ./gocontrolpanel/nginx.conf:/etc/nginx/nginx.conf
  depends_on:
    - gocontrolpanel
    - gbxconnector

filemanager:
  image: marijnregterschot/trackmania-server-fm:latest
  restart: unless-stopped
  volumes:
    # for PyPlanet the volume name is 'tmserverData', for EvoSC it is 'serverData' change accordingly
    - tmserverData:/app/UserData

redis:
  image: redis:latest
  restart: unless-stopped
  volumes:
    - redisData:/data
```

Also add the redis volume to the list of volumes at the bottom of your `docker-compose.yml` file:

```yaml
volumes:
  ...
  redisData: null
```

> **Note:** Make sure you are using the correct volume names for the filemanger service. For **PyPlanet**, the volume name is usually `tmserverData`, and for **EvoSC**, it is `serverData`.

### 4. Modify the environment variables

Make sure to update the environment variables for the added services in your `docker-compose.yml` file:

- **GoControlPanel Environment Variables**:

  - `NEXTAUTH_URL`, `NEXTAUTH_SECRET`: NextAuth configuration for authentication.
  - `CONNECTOR_API_KEY`: API key for the GbxConnector (can be any string).
  - `DEFAULT_ADMINS`: Comma-separated list of default admin logins.
  - **NADEO Configurations**: Make sure to update `NADEO_CLIENT_ID`, `NADEO_CLIENT_SECRET`, `NADEO_REDIRECT_URI`, `NADEO_SERVER_LOGIN`, `NADEO_SERVER_PASSWORD` and `NADEO_CONTACT` with your valid NADEO API credentials. Nadeo API credentials can be obtained from the [Nadeo API manager](https://api.trackmania.com/manager). And the server login and password can be found in your existing stack configuration under the `dedicated` or `trackmania` service.

- **GbxConnector Environment Variables**:
  - `SERVER_RECONNECT_INTERVAL`: Interval time in seconds for the server to reconnect.
  - `JWT_SECRET`: Secret key for JWT authentication.
  - `INTERNAL_API_KEY`: Internal API key for GbxConnector. Same key as `CONNECTOR_API_KEY` in GoControlPanel.
  - `LOG_LEVEL`: Set the desired logging level (e.g., `DEBUG`).

### 5. Modify the `servers.json` File

The `servers.json` file is used by the **GbxConnector** to configure the servers it connects to. You will need to modify this file with the correct server details. Paste this configuration into your existing `servers.json` file:

```json
[
  {
    "id": 0,
    "name": "Dedicated Server",
    "host": "dedicated",
    "xmlrpcPort": 5000,
    "fmUrl": "http://filemanager:3300",
    "user": "SuperAdmin",
    "pass": "SuperAdmin"
  }
]
```

> **Note:** Make sure you are using the correct service name for the dedicated server. For **PyPlanet**, the service name is usually `dedicated`, and for **EvoSC**, it is `trackmania`.

### 6. Start the Services

Run the following command to start the services.

```bash
docker compose up -d --build
```

### 7. Access the GoControlPanel

That's it! You can now access your **GoControlPanel** at `http://localhost:3000` or your own configured url.

---

## Troubleshooting

If you encounter any issues, check the logs of a specific service by running:

```bash
docker compose logs <service-name>
```

For example, to view the logs of the **GoControlPanel** service:

```bash
docker compose logs gocontrolpanel
```

---

## Contributing

Contributions are welcome! If you have suggestions or improvements, please create a pull request or open an issue. Feel free to fork the repository and make changes as needed.

---

## License

This project is licensed under the MIT License - see the [License](License) file for details.
