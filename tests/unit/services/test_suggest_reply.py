import pytest
from unittest.mock import patch
from services.wrappers.suggest_reply_wrapper import suggest_response

@patch("services.wrappers.suggest_reply_wrapper.generate_bulleted_list")
@patch("services.wrappers.suggest_reply_wrapper.load_prompt")
def test_suggest_response_success(mock_load_prompt, mock_generate_list):
    mock_load_prompt.return_value = "Suggest replies about shoes and returns"
    mock_generate_list.return_value = ["You can return within 30 days.", "Returns are free."]

    result = suggest_response("shoes", "returns")

    mock_load_prompt.assert_called_once_with("suggest_response", domain="shoes", business="returns")
    mock_generate_list.assert_called_once_with("Suggest replies about shoes and returns")
    assert result == ["You can return within 30 days.", "Returns are free."]

@patch("services.wrappers.suggest_reply_wrapper.generate_bulleted_list")
@patch("services.wrappers.suggest_reply_wrapper.load_prompt")
def test_suggest_response_raises(mock_load_prompt, mock_generate_list):
    mock_load_prompt.return_value = "Prompt"
    mock_generate_list.side_effect = RuntimeError("Model failed")

    with pytest.raises(RuntimeError, match="Model failed"):
        suggest_response("fashion", "sizing")
