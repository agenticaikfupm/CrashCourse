"""CrewAI: a small crew with roles and tasks, through OpenRouter

CrewAI organizes work as a crew of role-playing agents (role, goal, backstory)
that complete tasks in sequence or under a manager. Its LLM class can point
at any OpenAI-compatible endpoint.
Docs: https://docs.crewai.com/
Requires OPENROUTER_API_KEY. CrewAI supports Python 3.10 to 3.13.
"""
# %%
# !pip -q install crewai

# %%
import os
from getpass import getpass

from crewai import LLM, Agent, Crew, Process, Task

key = os.environ.get("OPENROUTER_API_KEY") or getpass("OPENROUTER_API_KEY: ")
llm = LLM(model="openrouter/openrouter/free", base_url="https://openrouter.ai/api/v1", api_key=key)

writer = Agent(
    role="Course writer",
    goal="Explain agentic AI ideas to beginners",
    backstory="You teach university students who know basic Python.",
    llm=llm,
)
reviewer = Agent(
    role="Reviewer",
    goal="Make explanations short, accurate, and friendly",
    backstory="You edit course material for clarity.",
    llm=llm,
)

draft = Task(description="Explain what an always-on AI agent is in 3 sentences.",
             expected_output="Three sentences.", agent=writer)
review = Task(description="Improve the explanation and keep it to 3 sentences.",
              expected_output="The final 3-sentence explanation.", agent=reviewer)

crew = Crew(agents=[writer, reviewer], tasks=[draft, review], process=Process.sequential)
print(crew.kickoff().raw)
