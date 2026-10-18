"""Perception: turning raw inputs into structured observations

An agent cannot act on raw text, images, or sensor values directly. The
perception step cleans and structures them into an "observation" that the
reasoning step can use. Here we parse a messy user request and a sensor feed.

Illustrative: a real agent would often use an LLM or a vision model for this
step. The goal is the same: produce a clean, structured observation.
"""
import json
import re
from dataclasses import asdict, dataclass, field


@dataclass
class Observation:
    intent: str
    entities: dict = field(default_factory=dict)
    sensors: dict = field(default_factory=dict)
    warnings: list = field(default_factory=list)


def perceive(user_text: str, sensor_feed: dict) -> Observation:
    text = user_text.lower().strip()

    # Very small intent detector (an LLM classifier would go here).
    if any(w in text for w in ("book", "reserve")):
        intent = "book_room"
    elif any(w in text for w in ("weather", "temperature", "hot")):
        intent = "check_conditions"
    else:
        intent = "unknown"

    entities = {}
    if m := re.search(r"(\d+)\s*(people|persons|students)", text):
        entities["group_size"] = int(m.group(1))
    if m := re.search(r"\b(\d{1,2})\s*(am|pm)\b", text):
        hour = int(m.group(1)) % 12 + (12 if m.group(2) == "pm" else 0)
        entities["hour"] = hour
    if m := re.search(r"building\s*(\d+)", text):
        entities["building"] = m.group(1)

    # Validate sensor readings instead of trusting them blindly.
    sensors, warnings = {}, []
    for name, value in sensor_feed.items():
        if value is None:
            warnings.append(f"sensor '{name}' returned no data")
        elif name == "temperature_c" and not -10 <= value <= 60:
            warnings.append(f"temperature {value} C looks wrong, ignoring it")
        else:
            sensors[name] = value

    return Observation(intent, entities, sensors, warnings)


obs = perceive(
    "Hi! Please book a room in Building 22 for 6 students at 3 pm",
    {"temperature_c": 41, "occupancy_pct": None, "noise_db": 48},
)
print(json.dumps(asdict(obs), indent=2))
