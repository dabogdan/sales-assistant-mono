from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from routes.summary_ws_route import router as summary_ws_router
from routes.suggest_reply_route import router as suggest_reply_router
from routes.suggest_domains_route import router as suggest_domains_router
from routes.suggest_keywords_route import router as suggest_keywords_router
from routes.auto_suggest_route import router as auto_suggest_router


def configure_routes_and_middleware(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[os.getenv("FRONTEND_ORIGIN")],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(summary_ws_router)
    app.include_router(suggest_reply_router)
    app.include_router(suggest_domains_router)
    app.include_router(suggest_keywords_router)
    app.include_router(auto_suggest_router)
