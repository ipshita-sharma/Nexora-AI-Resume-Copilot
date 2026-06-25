export async function askAssistant(
  message: string,
  resumeText: string = ""
) {

  const response = await fetch(
    "http://localhost:8000/assistant",
    {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        message,
        resume_text: resumeText
      })
    }
  );

  if(!response.ok){
    throw new Error("AI request failed");
  }

  return response.json();
}