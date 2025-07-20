# Use the official Debian-based Node.js image
FROM node:current-bullseye

# Set working directory
WORKDIR /app

# Copy your application files (optional)
COPY /src /app

# Install dependencies (if needed)
RUN npm install 


# Ensure the container always runs (default command)
CMD ["tail", "-f", "/dev/null"]