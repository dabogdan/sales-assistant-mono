from instances.keyword_extractor import keyword_extractor

def extract_keywords(text: str, top_n: int = 5) -> list[str]:
    try:
        results = keyword_extractor.extract_keywords(
            text,
            keyphrase_ngram_range=(1, 2),
            stop_words="english",
            top_n=top_n
        )
        return [kw[0] for kw in results]
    except Exception as e:
        print("❌ Keyword extraction failed:", e)
        raise
