"""Access free and commercial models through OpenRouter

OpenRouter (https://openrouter.ai) gives one OpenAI-compatible API for hundreds
of models from many providers. You need a free OpenRouter API key:
  1. Sign in at https://openrouter.ai and create a key under "Keys".
  2. Store it as OPENROUTER_API_KEY:
       * Colab: the key icon in the left sidebar ("Secrets"), then enable notebook access
       * Your computer: an environment variable, or a .env file you never commit

Free models have IDs ending in ":free", and "openrouter/free" routes to an
available free model. Free models have daily request limits. Commercial models
need credits; without them OpenRouter returns HTTP 402 and this example skips
that model. Never paste your key into code you share.
"""
# %%
# !pip -q install openai requests

# %%
# Step 1: load the API key without printing it
import os
from getpass import getpass

def load_key(name="OPENROUTER_API_KEY"):
    key = os.environ.get(name)
    if not key:
        try:
            from google.colab import userdata            # Colab "Secrets"
            key = userdata.get(name)
        except Exception:
            key = None
    if not key:
        key = getpass(f"Paste your {name} (input is hidden): ")
    return key.strip()

API_KEY = load_key()
BASE_URL = "https://openrouter.ai/api/v1"
print("Key loaded:", "yes" if API_KEY else "no")

# %%
# Step 2: check your key and list the free models available right now
import requests

headers = {"Authorization": f"Bearer {API_KEY}"}
key_info = requests.get(f"{BASE_URL}/key", headers=headers, timeout=30)
if key_info.status_code == 401:
    raise SystemExit("OpenRouter rejected the key (401). Check that you copied it correctly.")
print("Key status:", {k: v for k, v in key_info.json().get("data", {}).items() if k in ("label", "limit", "usage", "is_free_tier")})

catalog = requests.get(f"{BASE_URL}/models", timeout=30).json()["data"]
available = {m["id"] for m in catalog}
free_models = [m["id"] for m in catalog if m["id"].endswith(":free")]
print(f"{len(catalog)} models in the catalog, {len(free_models)} free. First few free ones:")
for model_id in free_models[:8]:
    print("  ", model_id)

# %%
# Step 3: ask the same question to free and commercial models
import time
from openai import OpenAI, APIStatusError

client = OpenAI(base_url=BASE_URL, api_key=API_KEY)

MODELS = [
    "openrouter/free",                 # free router: picks an available free model
    free_models[0] if free_models else "openrouter/free",
    "deepseek/deepseek-v4.1-flash",    # commercial examples (need credits)
    "anthropic/claude-haiku-5.5",
]
QUESTION = "In one sentence, what is an always-on AI agent?"

for model in MODELS:
    if model != "openrouter/free" and model not in available:
        print(f"\n{model}: not in today's catalog, skipped (model lists change often)")
        continue
    start = time.perf_counter()
    try:
        reply = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": QUESTION}],
            max_tokens=120,
            extra_headers={"X-OpenRouter-Title": "Agentic AI Crash Course"},   # optional attribution
        )
        seconds = time.perf_counter() - start
        print(f"\n{model}  (answered by {reply.model}, {seconds:.1f} s, {reply.usage.total_tokens} tokens)")
        print("  ", reply.choices[0].message.content.strip())
    except APIStatusError as err:
        reasons = {402: "needs credits (commercial model)", 429: "rate limited, try again later",
                   404: "model unavailable right now"}
        print(f"\n{model}: HTTP {err.status_code}, {reasons.get(err.status_code, err.message)}")

# %%
# Step 4 (optional): the same code works with Commonstack (https://commonstack.ai),
# another OpenAI-compatible gateway. Only the base URL, key, and model IDs change.
# Commonstack is pay as you go, so it needs credits.
#
# cs_client = OpenAI(base_url="https://api.commonstack.ai/v1", api_key=load_key("COMMONSTACK_API_KEY"))
# r = cs_client.chat.completions.create(model="openai/gpt-4.1",
#                                       messages=[{"role": "user", "content": QUESTION}])
# print(r.choices[0].message.content)
