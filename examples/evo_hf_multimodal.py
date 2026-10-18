"""Real model inference: text generation and image understanding

This example downloads two small open models from the Hugging Face Hub:
  1. distilgpt2 for text generation (a small GPT-2 style language model)
  2. CLIP for zero-shot image classification (matches an image to text labels)

CLIP is a vision-language model: it maps images and text into the same
embedding space, which is one of the building blocks of multimodal AI.

Run it in Google Colab (free) or locally after installing the packages.
The first run downloads several hundred MB of model weights.
"""
# %%
# In Colab, install the packages first (remove the leading "!" in a terminal):
# !pip -q install transformers torch pillow requests

# %%
from transformers import pipeline

# 1) Text generation with a small causal language model.
generator = pipeline("text-generation", model="distilgpt2")
result = generator("An AI agent is a system that", max_new_tokens=25, do_sample=False)
print(result[0]["generated_text"])

# %%
# 2) Multimodal: zero-shot image classification with CLIP.
classifier = pipeline("zero-shot-image-classification", model="openai/clip-vit-base-patch32")
image_url = "https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/pipeline-cat-chonk.jpeg"
labels = ["a photo of a cat", "a photo of a dog", "a photo of a car", "a diagram"]
for item in classifier(image_url, candidate_labels=labels):
    print(f"{item['label']:<20} {item['score']:.3f}")
