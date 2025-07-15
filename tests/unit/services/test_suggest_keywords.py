import pytest
from unittest.mock import patch
from services.wrappers.suggest_keywords_wrapper import generate_keywords

@patch("services.wrappers.suggest_keywords_wrapper.generate_bulleted_list")
@patch("services.wrappers.suggest_keywords_wrapper.load_prompt")
def test_generate_keywords_success(mock_load_prompt, mock_generate_list):
    mock_load_prompt.return_value = "Suggest some keywords about books and fiction"
    mock_generate_list.return_value = ["Genres", "Authors", "New releases"]

    result = generate_keywords("books", "fiction")

    mock_load_prompt.assert_called_once_with("suggest_keywords", domain="books", business="fiction")
    mock_generate_list.assert_called_once_with(
        "Suggest some keywords about books and fiction",
        stop=["\n\n", "</s>"],
        max_tokens=150
    )
    assert result == ["Genres", "Authors", "New releases"]

@patch("services.wrappers.suggest_keywords_wrapper.generate_bulleted_list")
@patch("services.wrappers.suggest_keywords_wrapper.load_prompt")
def test_generate_keywords_raises(mock_load_prompt, mock_generate_list):
    mock_load_prompt.return_value = "Prompt"
    mock_generate_list.side_effect = RuntimeError("LLM error")

    with pytest.raises(RuntimeError, match="LLM error"):
        generate_keywords("toys", "children")
