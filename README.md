# **GoControlPanel Docker Compose Setup**

This repository provides a **Docker Compose** configuration to set up and run **GoControlPanel** and its dependencies using Docker containers. The configuration includes:

- **GoControlPanel** service
- **GBXConnector** service
- **Dedicated Server** service (optional)
- **File Management** service (optional)
- **DB** service
- **Redis** service

## **Prerequisites**

Before using this `docker-compose.yml` file, ensure you have the following installed on your system:

- **Docker**: [Install Docker](https://www.docker.com/get-started)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)

## **Getting Started**

This guide will help you set up and run the services for both completely new stacks and with existing stacks like [PyPlanet](#pyplanet-stack-setup) or EvoSC.

## New Stack Setup

This section will guide you through setting up a new stack using the provided `docker-compose.yml` file.

### 1. Clone the Repository

```bash
git clone https://github.com/MRegterschot/gocontrolpanel.git
cd gocontrolpanel
```

### 2. Modify the Configuration

Make sure to update the environment variables in the `docker-compose.yml` file to match your setup:

- **GoControlPanel Environment Variables**:
  - `NEXT_PUBLIC_CONNECTOR_URL`: Public URL for the GBXConnector service.
  - `NEXTAUTH_URL`, `NEXTAUTH_SECRET`: NextAuth configuration for authentication.
  - `CONNECTOR_API_KEY`: API key for the GBXConnector (can be any string).
  - `DEFAULT_ADMINS`: Comma-separated list of default admin logins.
  - **NADEO Configurations**: Make sure to update `NADEO_CLIENT_ID`, `NADEO_CLIENT_SECRET`, `NADEO_REDIRECT_URI`, `NADEO_SERVER_LOGIN`, `NADEO_SERVER_PASSWORD` and `NADEO_CONTACT` with your valid NADEO API credentials. Nadeo API credentials can be obtained from the [Nadeo API manager](https://api.trackmania.com/manager). And the server login and password can be found in your PyPlanet stack configuration under the dedicated service.

- **GBXConnector Environment Variables**:
  - `CORS_ORIGINS`: Make sure this is set to allow your frontend (e.g., `http://localhost:3000`).
  - `SERVER_RECONNECT_INTERVAL`: Interval time in seconds for the server to reconnect.
  - `JWT_SECRET`: Secret key for JWT authentication.
  - `INTERNAL_API_KEY`: Internal API key for GBXConnector. Same key as `CONNECTOR_API_KEY` in GoControlPanel.
  - `LOG_LEVEL`: Set the desired logging level (e.g., `DEBUG`).

### 3. Modify the `servers.json` File

The `servers.json` file is used by the **GBXConnector** to configure the servers it connects to. You will need to modify this file with the correct server details. Here’s the format of the `servers.json` file:

```json
[
  {
    "id": 0,
    "name": "Server 1",
    "description": "This is a local server for testing purposes.",
    "host": "localhost",
    "xmlrpcPort": 5000,
    "fmUrl": "http://localhost:3300",
    "user": "SuperAdmin",
    "pass": "SuperAdmin"
  },
  {
    "id": 1,
    "name": "Server 2",
    "host": "localhost",
    "xmlrpcPort": 5001,
    "user": "SuperAdmin",
    "pass": "SuperAdmin"
  }
]
```

#### Modify the `servers.json` File as Follows:

- **id**: Unique identifier for each server (number).
- **name**: Name of the server.
- **description**: Short description of the server (optional).
- **host**: The hostname or IP address of the server.
- **xmlrpcPort**: The XML-RPC port of the server.
- **fmUrl**: The URL for the file management service.
- **user**: Username for XMLRPC authentication.
- **pass**: Password for XMLRPC authentication.

Make sure to adjust the values based on your setup.

### 4. Build and Start the Services

Run the following command to build and start all services defined in the `docker-compose.yml` file:

```bash
docker-compose up --build
```

This will start the following services:

1. **GoControlPanel** on port `3000` (accessible at http://localhost:3000).
2. **GBXConnector** on port `6980` (accessible at http://localhost:6980).
3. **Dedicated Server** (if configured) on port `2350`.
4. **File Management** (if configured).
5. **DB** (for database storage).
6. **Redis** (for caching).

> **Note:** The `--build` flag ensures that Docker rebuilds the images from the provided Dockerfiles before starting the services.

### 5. Stopping the Services

To stop the running services, press `Ctrl + C` in the terminal or run the following command:

```bash
docker-compose down
```

This stops the containers without removing them. To remove the containers and associated volumes, use:

```bash
docker-compose down --volumes
```

### 6. Persistent Data

- Database data is stored in a Docker volume (`db-data`) to ensure persistence.
- Redis data is stored in a Docker volume (`redis-data`) for caching persistence.

---

## PyPlanet Stack Setup

This section will guide you through setting up the **GoControlPanel** with an existing **PyPlanet** stack.

### 1. Navigate to Your PyPlanet Stack

First you need to navigate to your existing PyPlanet stack directory. If you don't have a PyPlanet stack yet, you can set one up by following the [PyPlanet documentation](https://wiki.trackmania.io/en/dedicated-server/Setup/Docker).

Navigate to the directory where your `docker-compose.yml` file for PyPlanet is located.

### 1. Clone the Repository

```bash
git clone https://github.com/MRegterschot/gocontrolpanel.git
```

### 2. Create Database

Create a new database for GoControlPanel in your existing database service. For the default PyPlanet stack, this is usually a MariaDB database.

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
      - NEXT_PUBLIC_CONNECTOR_URL=http://localhost:6980 # Use the external URL for the frontend
      - DATABASE_URL=mysql://gocontrolpanel:VettePanel123@db:3306/gocontrolpanel
      - DB_TYPE=mysql
  restart: unless-stopped
  ports:
    - 3000:3000
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
  ports:
    - 6980:6980
  environment:
    PORT: 6980
    CORS_ORIGINS: "http://localhost:3000"
    SERVER_RECONNECT_INTERVAL: 15
    JWT_SECRET:
    INTERNAL_API_KEY: # Same as the one in gocontrolpanel
    LOG_LEVEL: DEBUG
  volumes:
    - ./gocontrolpanel/servers.json:/app/servers.json

filemanager:
  image: marijnregterschot/trackmania-server-fm:latest
  restart: unless-stopped
  volumes:
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
  tmserverData: null
  pyplanetData: null
  mariadbData: null
  redisData: null
```

### 4. Modify the environment variables

Make sure to update the environment variables for the added services in your `docker-compose.yml` file:

- **GoControlPanel Environment Variables**:

  - `NEXT_PUBLIC_CONNECTOR_URL`: Public URL for the GBXConnector service.
  - `NEXTAUTH_URL`, `NEXTAUTH_SECRET`: NextAuth configuration for authentication.
  - `CONNECTOR_API_KEY`: API key for the GBXConnector (can be any string).
  - `DEFAULT_ADMINS`: Comma-separated list of default admin logins.
  - **NADEO Configurations**: Make sure to update `NADEO_CLIENT_ID`, `NADEO_CLIENT_SECRET`, `NADEO_REDIRECT_URI`, `NADEO_SERVER_LOGIN`, `NADEO_SERVER_PASSWORD` and `NADEO_CONTACT` with your valid NADEO API credentials. Nadeo API credentials can be obtained from the [Nadeo API manager](https://api.trackmania.com/manager). And the server login and password can be found in your PyPlanet stack configuration under the dedicated service.

- **GBXConnector Environment Variables**:
  - `CORS_ORIGINS`: Make sure this is set to allow your frontend (e.g., `http://localhost:3000`).
  - `SERVER_RECONNECT_INTERVAL`: Interval time in seconds for the server to reconnect.
  - `JWT_SECRET`: Secret key for JWT authentication.
  - `INTERNAL_API_KEY`: Internal API key for GBXConnector. Same key as `CONNECTOR_API_KEY` in GoControlPanel.
  - `LOG_LEVEL`: Set the desired logging level (e.g., `DEBUG`).

### 5. Modify the `servers.json` File

The `servers.json` file is used by the **GBXConnector** to configure the servers it connects to. You will need to modify this file with the correct server details. Paste this configuration into your existing `servers.json` file:

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

### 6. Start the Services

Run the following command to start the services.

```bash
docker-compose up -d
```

### 7. Access the GoControlPanel

That's it! You can now access your **GoControlPanel** at `http://localhost:3000`.

## **Services Overview**

### **GoControlPanel** (`gocontrolpanel`)

This is the main service for controlling and managing your application. It connects to MongoDB for data storage and Redis for caching. It uses the environment variables listed earlier for configuration.

> **Note:** The file management like uploading and deleting files is only possible if you have the `trackmania-server-filemanager` running next to a dedicated server. The volumes for the file manager are mounted to the dedicated server.

- **Ports**: `3000:3000` (accessible at `http://localhost:3000`)
- **Depends on**: `db`, `redis`

### **GBXConnector** (`gbxconnector`)

The GBXConnector is an API that serves as a bridge for your application to interact with the server. It listens for incoming connections from GoControlPanel and sends/receives data.

- **Ports**: `6980:6980` (accessible at `http://localhost:6980`)
- **Configuration File**: `./servers.json` (used for server configuration)

### **Dedicated Server** (`dedicated-server`)

This service runs a dedicated trackmania server. It is optional and can be configured to run on a specific port.

- **Ports**: `2350:2350` (accessible at `http://localhost:2350`)
- **Environment Variables**: `TM_MASTER_LOGIN`, `TM_MASTER_PASSWORD` (for server configuration)
- **Volumes**: `UserData` (for persistent data)

### **File Management** (`file-management`)

This service handles file uploads and deletions for the application.

- **Ports**: Not exposed directly
- **Volumes**: `UserData` (to be mounted to the dedicated server for file management)

### **DB** (`database`)

A database service for storing the GoControlPanel application data.

- **Ports**: Not exposed directly
- **Volumes**: `db-data` (persistent data)

### **Redis** (`redis`)

A caching service for GoControlPanel to improve performance.

- **Ports**: Not exposed directly
- **Volumes**: `redis-data` (persistent data)

---

## **Environment Variables**

Each service has specific environment variables. Refer to the `docker-compose.yml` file for full details, but here’s a quick overview:

- **GoControlPanel**:

  - `DATABASE_URL`: Database connection string.
  - `NEXT_PUBLIC_CONNECTOR_URL`: URL of the GBXConnector.
  - `NEXTAUTH_URL`, `NEXTAUTH_SECRET`: For NextAuth authentication.
  - `CONNECTOR_API_KEY`: API key for GBXConnector.
  - `DEFAULT_ADMINS`: Comma-separated list of default admin logins.
  - **NADEO** credentials: `NADEO_CLIENT_ID`, `NADEO_CLIENT_SECRET`, `NADEO_REDIRECT_URI`, `NADEO_SERVER_LOGIN`, `NADEO_SERVER_PASSWORD` and `NADEO_CONTACT`.
  - `REDIS_URI`: Redis connection string.

- **GBXConnector**:
  - `CORS_ORIGINS`: List of allowed CORS origins for frontend.
  - `SERVER_RECONNECT_INTERVAL`: Interval between reconnect attempts if the server is disconnected.
  - `JWT_SECRET`: Secret key for JWT authentication.
  - `INTERNAL_API_KEY`: Internal API key for GBXConnector.
  - `LOG_LEVEL`: Logging level (e.g., `DEBUG`, `INFO`, `ERROR`).

---

## **Troubleshooting**

If you encounter any issues, check the logs of a specific service by running:

```bash
docker compose logs <service-name>
```

For example, to view the logs of the **GoControlPanel** service:

```bash
docker compose logs gocontrolpanel
```

---

## **Contributing**

Contributions are welcome! If you have suggestions or improvements, please create a pull request or open an issue. Feel free to fork the repository and make changes as needed.

---

## **License**

This project is licensed under the MIT License - see the [License](License) file for details.
