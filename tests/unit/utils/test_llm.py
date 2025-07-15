from unittest.mock import patch

def test_generate_bulleted_list():
    prompt = "Give me 3 items\n"

    fake_llm_output = {
        "choices": [
            {"text": "- Item A\n- Item B\n- Item C"}
        ]
    }

    with patch("services.helpers.llm_helpers.llm", return_value=fake_llm_output):
        from services.helpers.llm_helpers import generate_bulleted_list
        result = generate_bulleted_list(prompt)
        assert result == ["Item A", "Item B", "Item C"]
