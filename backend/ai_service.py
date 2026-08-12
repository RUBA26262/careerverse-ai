"""
Provider-agnostic AI layer for the career mentor chat.

Switch providers purely via environment variables — no code changes needed:

    AI_PROVIDER=gemini      GEMINI_API_KEY=...
    AI_PROVIDER=groq        GROQ_API_KEY=...
    AI_PROVIDER=openrouter  OPENROUTER_API_KEY=...

If no key is configured, falls back to a rule-based stub so the mentor
chat still feels responsive during development / demos.
"""
import os
import re
import httpx

AI_PROVIDER = os.getenv("AI_PROVIDER", "stub").lower()

SYSTEM_PROMPT = (
    "You are the AI Career Mentor inside CareerVerse AI, a career guidance app for school "
    "students (grades 8-12). You are warm, encouraging, and direct. Your main job is career "
    "guidance: listen to what a student shares about their interests, strengths, and worries, "
    "reflect it back briefly, suggest 1-2 career directions that could fit, explain briefly why, "
    "and end with one motivating, concrete next step. "
    "Students may also ask you general school, study, or subject questions (homework help, "
    "exam prep, 'explain X concept') — answer those directly and helpfully too, then, where it "
    "fits naturally, connect the topic back to a possible career direction. "
    "Keep replies under 150 words, use plain language, and never dismiss a student's stated "
    "interest. You are not a doctor or therapist — for anything about a student's mental or "
    "physical health, gently suggest they talk to a trusted adult or counselor instead of "
    "answering directly."
)

# Default model per provider — override with the matching *_MODEL env var if you
# want something else. Groq and OpenRouter reject an unrecognized model id, so
# these must be real, currently-served models.
PROVIDERS = {
    "gemini": {
        "env_key": "GEMINI_API_KEY",
        "model_env": "GEMINI_MODEL",
        "default_model": "gemini-1.5-flash",
        "url_template": "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
    },
    "groq": {
        "env_key": "GROQ_API_KEY",
        "model_env": "GROQ_MODEL",
        "default_model": "llama-3.3-70b-versatile",
        "url": "https://api.groq.com/openai/v1/chat/completions",
    },
    "openrouter": {
        "env_key": "OPENROUTER_API_KEY",
        "model_env": "OPENROUTER_MODEL",
        # Free-tier model id on OpenRouter as of writing. OpenRouter's free
        # lineup changes over time — check https://openrouter.ai/models?max_price=0
        # and set OPENROUTER_MODEL if this one is no longer available.
        "default_model": "meta-llama/llama-3.1-8b-instruct:free",
        "url": "https://openrouter.ai/api/v1/chat/completions",
    },
}


async def get_mentor_reply(message: str, history: list) -> str:
    provider = PROVIDERS.get(AI_PROVIDER)
    api_key = os.getenv(provider["env_key"]) if provider else None

    if not provider or not api_key:
        return _stub_reply(message)

    model = os.getenv(provider["model_env"], provider["default_model"])

    try:
        if AI_PROVIDER == "gemini":
            url = provider["url_template"].format(model=model)
            return await _call_gemini(message, history, api_key, url)
        return await _call_openai_compatible(message, history, api_key, provider["url"], model)
    except Exception as exc:
        # Never let a flaky external API break the chat experience — but log it
        # so a wrong model id / bad key shows up somewhere during setup.
        print(f"[ai_service] {AI_PROVIDER} call failed, falling back to stub: {exc}")
        return _stub_reply(message)


async def _call_openai_compatible(message, history, api_key, url, model):
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    for m in (history or [])[-8:]:
        messages.append({"role": m.role, "content": m.content})
    messages.append({"role": "user", "content": message})

    async with httpx.AsyncClient(timeout=20) as client:
        res = await client.post(
            url,
            headers={"Authorization": f"Bearer {api_key}"},
            json={"model": model, "messages": messages, "max_tokens": 300},
        )
        res.raise_for_status()
        data = res.json()
        return data["choices"][0]["message"]["content"].strip()


async def _call_gemini(message, history, api_key, url):
    contents = [{"role": "user", "parts": [{"text": SYSTEM_PROMPT}]}]
    for m in (history or [])[-8:]:
        role = "user" if m.role == "user" else "model"
        contents.append({"role": role, "parts": [{"text": m.content}]})
    contents.append({"role": "user", "parts": [{"text": message}]})

    async with httpx.AsyncClient(timeout=20) as client:
        res = await client.post(f"{url}?key={api_key}", json={"contents": contents})
        res.raise_for_status()
        data = res.json()
        return data["candidates"][0]["content"]["parts"][0]["text"].strip()


# --- Rule-based stub, used when no AI key is configured -------------------

_TOPIC_RULES = [
    (r"\bmath|maths\b.*\b(hate|dislike)\b.*coding|\bcoding\b.*\b(hate|dislike)\b",
     "It's great that maths clicks for you — plenty of strong careers lean on that "
     "without heavy coding, like Data Analysis, Actuarial Science, or Civil Engineering. "
     "Since coding feels rough right now, try one small, visual coding exercise this week — "
     "sometimes it's the *way* it was taught, not the subject itself, that didn't click."),
    (r"\bdraw|drawing|art|design\b",
     "Creative instincts like that are a real signal, not just a hobby. UX/Graphic Design, "
     "Architecture, and Animation all reward exactly what you're describing. "
     "Next step: try redesigning one screen of an app you use daily — it'll show you fast "
     "whether design work energizes you day-to-day."),
    (r"\bdoctor|medicine|medical\b",
     "Wanting to become a doctor is a strong pull toward Biology and direct patient care. "
     "It's worth checking that pull against reality early — try shadowing a doctor for a day "
     "or volunteering at a health camp. If it still feels right, start building your Biology "
     "and Chemistry foundation now; entrance exam prep rewards consistency over years."),
    (r"\bparent|parents\b.*\bdoctor|engineer|want\b",
     "It's genuinely hard when what your parents want and what excites you don't fully line up. "
     "Both things can be true: their concern usually comes from wanting stability for you. "
     "Try having a conversation where you share what you enjoy *and* ask what worries them — "
     "often there's more overlap than it first seems."),
    (r"\bweak in\b.*physics|\bweak\b.*\bphysics\b",
     "A weak spot in one subject doesn't rule out related fields — it just points to where to "
     "focus. If the concepts feel abstract, try a hands-on angle: robotics, simple circuits, or "
     "an intro engineering YouTube series. Careers like Design, Data, or Biology-heavy medicine "
     "may also suit you better than physics-heavy paths."),
]

_DEFAULT_REPLIES = [
    "That's useful to know. Careers that fit people best usually sit where a real interest "
    "meets a real strength — tell me more about what you're naturally good at, even outside school.",
    "Thanks for sharing that. Could you tell me a bit about a subject or activity that makes "
    "time fly for you? That's often the clearest signal of where to look next.",
    "Good to know. What's something you'd keep doing even if no one graded it? That usually "
    "points toward the right direction faster than any quiz.",
]

_counter = {"i": 0}


def _stub_reply(message: str) -> str:
    text = message.lower()
    for pattern, reply in _TOPIC_RULES:
        if re.search(pattern, text):
            return reply

    reply = _DEFAULT_REPLIES[_counter["i"] % len(_DEFAULT_REPLIES)]
    _counter["i"] += 1
    return reply
