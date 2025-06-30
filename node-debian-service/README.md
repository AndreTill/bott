# Node Debian Service

This project is a simple Node.js application running in a Docker container based on a Debian image. It sets up a server that listens for incoming requests and responds accordingly.

## Project Structure

```
node-debian-service
├── src
│   └── index.js        # Entry point of the application
├── Dockerfile           # Dockerfile to build the image
├── docker-compose.yml   # Docker Compose configuration
├── package.json         # npm configuration and dependencies
└── README.md            # Project documentation
```

## Getting Started

To build and run the service, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd node-debian-service
   ```

2. **Build the Docker image:**

   ```bash
   docker-compose build
   ```

3. **Run the service:**

   ```bash
   docker-compose up
   ```

The service will be running and accessible at `http://localhost:3000`.

## Service Configuration

The service is configured to always run, and the local directory is mounted to the container for easy development and testing.

## Dependencies

This project uses the following dependencies:

- Express (for handling HTTP requests)

Make sure to install the necessary dependencies by running:

```bash
npm install
```

## License

This project is licensed under the MIT License.