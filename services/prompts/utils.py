# utils.py

import os
from string import Formatter

PROMPT_PATH = os.path.dirname(__file__)

def load_prompt(name: str, **kwargs) -> str:
    path = os.path.join(PROMPT_PATH, f"{name}.txt")

    if not os.path.exists(path):
        raise FileNotFoundError(f"Prompt file not found: {path}")
    
    with open(path, "r", encoding="utf-8") as f:
        template = f.read()
    
    formatter = Formatter()
    expected_vars = {
        field_name for _, field_name, _, _ in formatter.parse(template)
        if field_name
    }

    passed_vars = set(kwargs.keys())

    missing_vars = expected_vars - passed_vars
    extra_vars = passed_vars - expected_vars

    if missing_vars:
        raise ValueError(f"Missing variables for prompt '{name}': {missing_vars}")
    if extra_vars:
        raise ValueError(f"Extra variables provided for prompt '{name}': {extra_vars}")
    
    return template.format(**kwargs)
