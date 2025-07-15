import pytest
from services.prompts.utils import load_prompt

def test_load_prompt_valid():
    content = load_prompt("suggest_response", domain="books", business="online bookstore")
    assert "books" in content
    assert "online bookstore" in content

def test_load_prompt_missing_variable():
    with pytest.raises(ValueError) as e:
        load_prompt("suggest_response", business="x")
    assert "Missing variables" in str(e.value)

def test_load_prompt_extra_variable():
    with pytest.raises(ValueError):
        load_prompt("suggest_response", domain="x", business="y", extra="zzz")
