# **GoControlPanel Docker Compose Setup**

This repository provides a **Docker Compose** configuration to set up and run **GoControlPanel** and its dependencies using Docker containers. The configuration includes:

- **GoControlPanel** service
- **GBXConnector** service
- **Dedicated Server** service (optional)
- **MongoDB** service
- **Redis** service

## **Prerequisites**

Before using this `docker-compose.yml` file, ensure you have the following installed on your system:

- **Docker**: [Install Docker](https://www.docker.com/get-started)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)

## **Getting Started**

Follow these steps to set up and run the services defined in the `docker-compose.yml` file:

### 1. Clone the Repository

```bash
git clone https://github.com/MRegterschot/gocontrolpanel.git
cd gocontrolpanel
```

### 2. Modify the Configuration

Make sure to update the environment variables in the `docker-compose.yml` file to match your setup:

- **GoControlPanel Environment Variables**:

  - `MONGODB_URI`: MongoDB URI for GoControlPanel to connect to the MongoDB service.
  - `MONGODB_DB`: The database name for GoControlPanel in MongoDB.
  - `NEXT_PUBLIC_CONNECTOR_URL`: URL for the GBXConnector service.
  - `NEXTAUTH_URL`, `NEXTAUTH_SECRET`: NextAuth configuration for authentication.
  - `CONNECTOR_API_KEY`: API key for the GBXConnector.
  - `DEFAULT_ADMINS`: Comma-separated list of default admin logins.
  - **NADEO Configurations**: Make sure to update `NADEO_CLIENT_ID`, `NADEO_CLIENT_SECRET`, `NADEO_REDIRECT_URI`, `NADEO_SERVER_LOGIN`, `NADEO_SERVER_PASSWORD` and `NADEO_CONTACT` with your valid NADEO API credentials.
  - `REDIS_URI`: Redis URI for caching.

- **GBXConnector Environment Variables**:
  - `PORT`: Port for the GBXConnector service.
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
    "fmPort": 3300,
    "user": "SuperAdmin",
    "pass": "SuperAdmin"
  },
  {
    "id": 1,
    "name": "Server 2",
    "host": "localhost",
    "xmlrpcPort": 5001,
    "fmPort": 3301,
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
4. **MongoDB** (for database storage).
5. **Redis** (for caching).

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

- MongoDB data is stored in a Docker volume (`mongo-data`) to ensure persistence.
- Redis data is stored in a Docker volume (`redis-data`) for caching persistence.

---

## **Services Overview**

### **GoControlPanel** (`gocontrolpanel`)

This is the main service for controlling and managing your application. It connects to MongoDB for data storage and Redis for caching. It uses the environment variables listed earlier for configuration.

> **Note:** The file management like uploading and deleting files is only possible with a server running the **[marijnregterschot/trackmania-plus](https://hub.docker.com/r/marijnregterschot/trackmania-plus)** image.

- **Ports**: `3000:3000` (accessible at `http://localhost:3000`)
- **Depends on**: `mongo`, `redis`

### **GBXConnector** (`gbxconnector`)

The GBXConnector is an API that serves as a bridge for your application to interact with the server. It listens for incoming connections from GoControlPanel and sends/receives data.

- **Ports**: `6980:6980` (accessible at `http://localhost:6980`)
- **Configuration File**: `./servers.json` (used for server configuration)

### **Dedicated Server** (`dedicated-server`)

This service runs a dedicated trackmania server. It is optional and can be configured to run on a specific port.

- **Ports**: `2350:2350` (accessible at `http://localhost:2350`)
- **Environment Variables**: `TM_MASTER_LOGIN`, `TM_MASTER_PASSWORD` (for server configuration)
- **Volumes**: `UserData` (for persistent data)

### **MongoDB** (`mongo`)

A database service for storing the GoControlPanel application data.

- **Ports**: Not exposed directly
- **Volumes**: `mongo-data` (persistent data)

### **Redis** (`redis`)

A caching service for GoControlPanel to improve performance.

- **Ports**: Not exposed directly
- **Volumes**: `redis-data` (persistent data)

---

## **Environment Variables**

Each service has specific environment variables. Refer to the `docker-compose.yml` file for full details, but here’s a quick overview:

- **GoControlPanel**:

  - `MONGODB_URI`: MongoDB connection URI.
  - `MONGODB_DB`: MongoDB database name.
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
docker-compose logs <service-name>
```

For example, to view the logs of the **GoControlPanel** service:

```bash
docker-compose logs gocontrolpanel
```

---

## **License**

This project is licensed under the MIT License - see the [License](License) file for details.
