# Waitr Backend

This is the backend service for the Waitr application.

## Deployment to Azure

### Prerequisites

- Azure account
- Azure CLI installed

### Steps to deploy

1. Login to Azure:

```
az login
```

2. Create a resource group (if you don't have one):

```
az group create --name waitr-rg --location westeurope
```

3. Create an App Service plan:

```
az appservice plan create --name waitr-plan --resource-group waitr-rg --sku B1
```

4. Create a web app:

```
az webapp create --name waitr-backend --resource-group waitr-rg --plan waitr-plan --runtime "NODE:18-lts"
```

5. Configure environment variables:

```
az webapp config appsettings set --name waitr-backend --resource-group waitr-rg --settings PORT=8080 JWT_SECRET_KEY=your_secret_key DB_STRING=your_db_connection_string CORS_ORIGIN=your_frontend_url
```

6. Deploy the code:

```
az webapp deployment source config-local-git --name waitr-backend --resource-group waitr-rg
```

7. Add the Azure remote to your git repository:

```
git remote add azure <git-url-from-previous-command>
```

8. Push your code:

```
git push azure main
```

## Local Development

1. Install dependencies:

```
npm install
```

2. Run in development mode:

```
npm run dev
```

3. Build for production:

```
npm run build
```

4. Start production server:

```
npm start
```
