import json
from groq import Groq
from app.core.config import get_settings


class LLMGateway:
    async def structured_insights(self, task: str, payload: dict, fallback: dict) -> dict:
        settings = get_settings()
        if settings.ai_provider == "groq" and settings.groq_api_key:
           return await self._groq(task, payload, fallback)

        if settings.ai_provider == "openai" and settings.openai_api_key:
           return await self._openai(task, payload, fallback)

        if settings.ai_provider == "gemini" and settings.google_api_key:
           return await self._gemini(task, payload, fallback)

        return fallback

    async def _openai(self, task: str, payload: dict, fallback: dict) -> dict:
        try:
            from langchain_openai import ChatOpenAI

            llm = ChatOpenAI(model=get_settings().openai_model, temperature=0.2)
            response = await llm.ainvoke(self._prompt(task, payload))
            return self._json_or_fallback(str(response.content), fallback)
        except Exception:
            return fallback

    async def _gemini(self, task: str, payload: dict, fallback: dict) -> dict:
        try:
            from langchain_google_genai import ChatGoogleGenerativeAI

            llm = ChatGoogleGenerativeAI(model=get_settings().gemini_model, temperature=0.2)
            response = await llm.ainvoke(self._prompt(task, payload))
            return self._json_or_fallback(str(response.content), fallback)
        except Exception:
            return fallback
        
    async def _groq(self, task: str, payload: dict, fallback: dict) -> dict:
        try:
            client = Groq(
            api_key=get_settings().groq_api_key
        )

            response = client.chat.completions.create(
            model=get_settings().groq_model,
            messages=[
                {
                    "role": "user",
                    "content": self._prompt(task, payload),
                }
            ],
            temperature=0.2,
        )

            content = response.choices[0].message.content
            
            print("GROQ RESPONSE:")
            print(content)

            return self._json_or_fallback(
            content,
            fallback,
        )

        except Exception as e:
           print("GROQ ERROR:", e)
           return fallback

    @staticmethod
    def _prompt(task: str, payload: dict) -> str:
        return (
            "You are an expert career coach and technical interviewer. "
            "Return strict JSON only, no markdown. "
            f"Task: {task}\n"
            f"Payload: {json.dumps(payload)[:12000]}"
        )

    @staticmethod
    def _json_or_fallback(content: str, fallback: dict) -> dict:
       try:
        start = content.find("{")
        end = content.rfind("}") + 1

        if start >= 0 and end > start:
            parsed = json.loads(content[start:end])

            if isinstance(parsed, dict):
                merged = fallback.copy()
                merged.update(parsed)
                return merged

       except Exception as e:
        print("JSON PARSE ERROR:", e)

       return fallback
  