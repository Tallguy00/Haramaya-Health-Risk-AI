from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Backend is working"}

@app.get("/api/zones")
def get_zones():
    return [ 
         {"id": 1, "name": "Haramaya Town", "risk": 0.7},
         {"id": 2, "name": "Bate Area", "risk": 0.4},
        ] 