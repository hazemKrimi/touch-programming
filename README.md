# Touch Programming

An AI powered web application which lets you master touch typing with real code snippets from your favorite programming languages, powered by AI.

## Requirements

1. You need to have [Ollama](https://ollama.com/download) installed and you will need to have an LLM installed afterwards. I am currently using `llama3.2:1b` which I got through the following command:

```
ollama pull llama3.2:1b
```

2. You need to have [Golang](https://go.dev/doc/install) installed since it is the language used for writing the API.

3. You need Node.js to install the client dependencies and run the project locally. I recommend installing it through [NVM](https://github.com/nvm-sh/nvm).

## Development

1. To run the server you need to have the LLM already pulled from `ollama` as stated above and you need a `.env` file following the example file in the repo then run the following commands:

```
cd server
go run main.go
```

2. To run the client you also need a `.env` following the example file. You can point the API to the local server you are running. Then run the following commands:

```
cd client
npm run dev
```

## Deployment

I am using `nginx` with `certbot` as a seemless webserver with an SSL certificate to get HTTPS. Here is how I setup the deployment assuming you already have `nginx` and `certbot` installed:

1. Create a file to to be the webserver config under `/etc/nginx/sites-available` with its content being what is in `deploy/nginx.conf` of the repo. (You will need to use your own domain)

2. Symlink the config into `/etc/nginx/sites-enabled`:

```
sudo ln -s /etc/nginx/sites-available/<webserver-config> /etc/nginx/sites-enabled/<webserver-config>
```

3. Restart `nginx` and its service if you're using `systemd`:

```
sudo nginx -t
sudo systemctl restart nginx
```

4. Run `certbot` to get an SSL certificate for your domain:

```
sudo certbot --nginx
```

5. If you forked this repo you can use the actions workflow that I am using but you will need to add an SSH private key as an action secret. You will find this setting under repo settings > security > secrets and variables > actions. You will add your key as `DEPLOY_SSH_KEY` in repository secrets.

6. If you are not using GitHub Actions or not deploying on a VPS will need to build the client and server yourself and deploy them respectively. Here are the build commands:

```
# Building the server
CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o executable

# Building the client.
npm run build
```
