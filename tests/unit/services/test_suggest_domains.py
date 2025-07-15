import pytest
from unittest.mock import patch
from services.wrappers.suggest_domains_wrapper import suggest_faq_domains

@patch("services.wrappers.suggest_domains_wrapper.generate_bulleted_list")
@patch("services.wrappers.suggest_domains_wrapper.load_prompt")
def test_suggest_faq_domains_success(mock_load_prompt, mock_generate_list):
    # Arrange
    mock_load_prompt.return_value = "Suggest some FAQ domains about shoes"
    mock_generate_list.return_value = ["Returns", "Shipping", "Sizing"]

    # Act
    result = suggest_faq_domains("shoes")

    # Assert
    mock_load_prompt.assert_called_once_with("suggest_domains", business="shoes")
    mock_generate_list.assert_called_once_with("Suggest some FAQ domains about shoes")
    assert result == ["Returns", "Shipping", "Sizing"]

@patch("services.wrappers.suggest_domains_wrapper.generate_bulleted_list")
@patch("services.wrappers.suggest_domains_wrapper.load_prompt")
def test_suggest_faq_domains_raises(mock_load_prompt, mock_generate_list):
    mock_load_prompt.return_value = "Prompt"
    mock_generate_list.side_effect = RuntimeError("LLM crashed")

    with pytest.raises(RuntimeError, match="LLM crashed"):
        suggest_faq_domains("toys")
