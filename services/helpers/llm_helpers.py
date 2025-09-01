# llm_helpers.py

from instances.llm_settings_instance import llm
import json

def extract_domains_and_replies(text: str) -> dict[str, list[str]]:
    result: dict[str, list[str]] = {}
    current_domain = None

    for line in text.splitlines():
        stripped = line.strip()
        if not stripped.startswith("- "):
            continue

        content = stripped[2:].strip()

        # Domain: line ending with ":" is treated as domain name
        if content.endswith(":"):
            current_domain = content[:-1].strip()
            result[current_domain] = []
        elif current_domain:
            # Treat as a suggestion
            result[current_domain].append(content)

    return result

def generate_bulleted_list(prompt: str, stop: list[str] = ["</s>"], max_tokens: int = 300) -> list[str]:
    print("📥 Prompt sent to model:\n", prompt)

    try:
        result = llm(prompt, max_tokens=max_tokens, temperature=0.7, top_p=0.9, stop=stop)
        print("🧠 Raw model output:\n", result)

        response_text = result["choices"][0]["text"].strip()
        print("\n✅ Raw model response:\n", response_text)

        parsed = [
            line.strip("- ").strip()
            for line in response_text.splitlines()
            if line.strip().startswith("-")
        ]
        print("\n📦 Parsed List:\n", parsed)
        return parsed

    except Exception as e:
        print("❌ Error during generation:", str(e))
        raise

def generate_text_streaming_with_progress(prompt: str, max_tokens: int = 300, stop: list[str] | None = None, progress_step: int = 10):
    def token_stream():
        stream = llm(prompt, max_tokens=max_tokens, temperature=0.7, top_p=0.9, stop=["</s>"], stream=True)
        output_text = ""
        token_count = 0
        last_bucket = -1
        # progress_step = 20

        for chunk in stream:
            token = chunk["choices"][0]["text"]
            output_text += token
            token_count += 1

            progress_percent = int((token_count / max_tokens) * 100)
            current_bucket = (progress_percent // progress_step) * progress_step

            if current_bucket != last_bucket:
                last_bucket = current_bucket
                yield f"[PROGRESS {current_bucket}%]\n"

        parsed = extract_domains_and_replies(output_text.strip())

        yield f"[PARSED_OUTPUT]\n{json.dumps(parsed, ensure_ascii=False, indent=2)}".encode("utf-8")

    return token_stream()
