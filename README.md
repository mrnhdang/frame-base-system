# frame-base-system
## backend
```bash
cd backend
python -m venv .venv && . .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
# API on http://localhost:5050
```

## frontend
```bash
cd frontend
npm i
# point frontend to backend:
# (optional) create .env.local with: NEXT_PUBLIC_BACKEND_URL=http://localhost:5050
npm run dev     # http://localhost:3000
```
