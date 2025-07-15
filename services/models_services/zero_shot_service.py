from instances.zero_shot_model import classifier

# Utility: checks if all parts of a phrase exist in input text
def phrase_in_text(phrase, text):
    return all(word.lower() in text.lower() for word in phrase.split())

# Classifies a list of keyword phrases into a predefined domain
# using zero-shot classification (no retraining required).
def classify_domain_zero_shot(keywords, keywords_from_front, domain_response_map, text_input):

    # === 1. Check keywords from front ===
    if keywords_from_front:
        for domain, keyword_list in keywords_from_front.items():
            for kw in keyword_list:
                if phrase_in_text(kw, text_input):
                    return {
                        "domain": domain,
                        "desired_response": domain_response_map.get(domain, "Let me know how I can help.")
                    }

    # === 2. Fallback to zero-shot classification ===
    candidate_labels = list(domain_response_map.keys())

    if not candidate_labels:
        print("⚠️ Zero-shot classification skipped: no domain labels provided.")
        return {
            "domain": "unknown",
            "desired_response": "Let me know how I can help."
        }

    if not keywords or not isinstance(keywords, list) or not all(isinstance(k, str) for k in keywords):
        print("❗ Zero-shot classification skipped: invalid or empty keywords list.", keywords)
        return {
            "domain": "unknown",
            "desired_response": "Let me know how I can help."
        }

    input_text = " ".join(keywords).strip()
    if not input_text:
        print("❗ Zero-shot classification skipped: input text is empty after join.")
        return {
            "domain": "unknown",
            "desired_response": "Let me know how I can help."
        }

    try:
        result = classifier(input_text, candidate_labels=candidate_labels)
        top_label = result["labels"][0]
        top_score = result["scores"][0]

        if top_score > 0.5:
            return {
                "domain": top_label,
                "desired_response": domain_response_map.get(top_label, "")
            }
    except Exception as e:
        print("❌ Zero-shot classification failed:", e)

    return {
        "domain": "unknown",
        "desired_response": "Let me know how I can help."
    }
