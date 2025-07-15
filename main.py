from fastapi import FastAPI
from routes.setup_routes import configure_routes_and_middleware

app = FastAPI()
configure_routes_and_middleware(app)
