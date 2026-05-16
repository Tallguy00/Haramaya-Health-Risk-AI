# Haramaya Health Risk AI

This project now includes a connected React frontend and FastAPI backend.

## Frontend

From the project root:

```powershell
npm install
npm run dev
```

The Vite app runs on `http://localhost:8080` and proxies `/api` requests to the backend by default.

## Backend

From `Database/backend`:

```powershell
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The backend serves:

- `GET /api/zones`
- `GET /api/stats`
- `GET /api/trend`
- `GET /api/factors`
- `GET /api/predict/{zoneId}`

## Optional environment variables

- `VITE_API_URL` to point the frontend at a specific backend URL instead of the default relative `/api` path
- `VITE_API_PROXY_TARGET` to change the Vite dev proxy target if your backend is not running on `http://127.0.0.1:8000`
