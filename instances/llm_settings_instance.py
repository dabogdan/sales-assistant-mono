from llama_cpp import Llama

llm = Llama(
    model_path="./models/Nous-Hermes-2-Mistral-7B-DPO.Q4_K_M.gguf",
    n_ctx=512,
    n_threads=8
)