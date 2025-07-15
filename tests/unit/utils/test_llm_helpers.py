import pytest
from unittest.mock import patch
from services.helpers.llm_helpers import generate_bulleted_list

@patch("services.helpers.llm_helpers.llm")
def test_generate_bulleted_list_success(mock_llm):
    mock_llm.return_value = {
        "choices": [
            {"text": "- First\n- Second\n- Third"}
        ]
    }

    result = generate_bulleted_list("List three things")

    mock_llm.assert_called_once_with(
        "List three things",
        max_tokens=300,
        temperature=0.7,
        top_p=0.9,
        stop=["</s>"]
    )
    assert result == ["First", "Second", "Third"]

@patch("services.helpers.llm_helpers.llm")
def test_generate_bulleted_list_empty_response(mock_llm):
    mock_llm.return_value = {
        "choices": [
            {"text": "..."}
        ]
    }

    result = generate_bulleted_list("List something")
    assert result == []

@patch("services.helpers.llm_helpers.llm")
def test_generate_bulleted_list_raises_exception(mock_llm):
    mock_llm.side_effect = RuntimeError("Model down")

    with pytest.raises(RuntimeError, match="Model down"):
        generate_bulleted_list("Something")
