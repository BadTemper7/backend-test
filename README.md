# Hostinger Test Backend

A minimal Express API with no database, authentication, Cloudinary, SMTP, or other external services. Use it to confirm that Hostinger can start and expose a Node.js backend.

## Hostinger settings

- Framework: Express
- Node.js version: 20.x or 22.x
- Root directory: `./`
- Entry file: `src/server.js`
- Package manager: npm

Environment variables:

```env
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
CLIENT_ORIGINS=https://onetrue.ph,https://admin.onetrue.ph
```

For the simplest test, `CLIENT_ORIGINS` can be omitted. The test backend will allow all origins.

## Endpoints

- `GET /`
- `GET /api/health`
- `GET /api/test`
- `POST /api/test`

Example POST body:

```json
{
  "message": "Hello Hostinger"
}
```

## Expected health response

```json
{
  "success": true,
  "status": "ok",
  "message": "Express is running successfully on Hostinger."
}
```

## Local test

```bash
npm install
npm start
```

Then open:

```text
http://localhost:3000/api/health
```
