from llama_cpp import Llama

llm = Llama(
    model_path="./models/tinyllama-1.1b-chat-v1.0.Q4_K_M.gguf",
    n_ctx=128,
    n_threads=6,
    n_batch=16,
    low_vram=True,
    use_mlock=False,
    chat_format="chatml",
)
