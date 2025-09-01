from llama_cpp import Llama
import os

# llm = Llama(
#     model_path="./models/Nous-Hermes-2-Mistral-7B-DPO.Q4_K_M.gguf",
#     n_ctx=512,
#     n_threads=8
# )

# form mac M2 Pro to run locally
llm = Llama(
    model_path="./models/Nous-Hermes-2-Mistral-7B-DPO.Q4_K_M.gguf",
    n_ctx=2048,          # plenty for this task; smaller ctx = less KV & faster
    n_gpu_layers=-1,     # offload all layers to Metal
    main_gpu=0,          # use the first (and only) GPU
    n_threads=6,         # ~half your M2 CPU (good balance for side work)
    n_threads_batch=6,   # keep batch-side CPU work in check too
    n_batch=1536, 
    f16_kv=True,
    logits_all=False,
)