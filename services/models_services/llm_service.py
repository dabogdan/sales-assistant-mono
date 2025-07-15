from instances.hermes_instance import llm
from services.prompts.utils import load_prompt

def generate_emotionally_aware_response(
    text_emotion_top3,
    desired_response,
):
    prompt = load_prompt(
        "emotionally_aware_response",
        emotion=text_emotion_top3[0]['label'],
        goal=desired_response,
    )

    print("🧾 Prompt to LLM:")
    print(prompt)
    
    try:
        result = llm(
            prompt,
            max_tokens=32,
            temperature=0.5,
            top_p=0.9,
            stop=["</s>", "<|user|>"]
        )

        print("🤖 Raw LLM response:")
        print(result)

        response_text = result["choices"][0]["text"].strip()

        print("✅ Cleaned response text:")
        print(response_text)

        return response_text

    except Exception as e:
        print("❌ Error generating response:", str(e))
        raise
