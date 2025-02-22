FROM node:20-alpine AS frontend
WORKDIR /frontend
COPY ./client .
RUN npm install
RUN npm run build

FROM golang:1.23-alpine AS backend
WORKDIR /backend
COPY ./server .
RUN go mod tidy
RUN go build -o server

# FROM ollama/ollama:latest AS ai

# Install the llama3.2:1b model
# RUN ollama pull llama3.2:1b

# Stage 4: Setup NGINX to serve the React app and reverse proxy the Go and Ollama servers
FROM nginx:alpine AS reverse_proxy

# Copy the React build from the previous stage to NGINX's HTML folder
COPY --from=frontend /frontend/build /usr/share/nginx/html

# Copy the Go server binary into the container
COPY --from=backend /backend/.env.production .env
COPY --from=backend /backend/server /usr/local/bin/server

# Copy NGINX configuration to configure reverse proxy
COPY ./nginx.conf /etc/nginx/nginx.conf

# Expose necessary ports
EXPOSE 80
EXPOSE 8080

# Start NGINX and Go server in parallel (using a simple entrypoint script)
CMD ["sh", "-c", "nginx -g 'daemon off;' & /usr/local/bin/server"]
