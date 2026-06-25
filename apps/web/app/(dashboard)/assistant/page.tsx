"use client";

import { Bot, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { useCareerAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { askAssistant } from "@/services/assistant";

export default function AssistantPage() {
  const { user } = useCareerAuth();

  const userId =
    user?.primaryEmailAddress?.emailAddress;

  const getUserKey = (
    key: string
  ) => `${userId || "guest"}_${key}`;

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
{
role:"assistant",
text:"Hi 👋 I'm your AI Career Assistant. Ask me about resumes, projects, interviews, or learning plans."
}
]);

  return (
    <div className="space-y-6">

      <Card className="rounded-[30px] border border-white/10">
        <CardContent className="p-8">

          <div className="flex items-center gap-4">

            <div
              className="
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-3xl
              bg-gradient-to-br
              from-cyan-400
              to-teal-500
            "
            >
              <Bot className="h-8 w-8 text-white" />
            </div>

            <div>

              <h1 className="text-3xl font-bold">
                AI Career Assistant
              </h1>

              <p className="mt-2 text-zinc-400">
                Ask anything about resumes, interviews,
                projects, learning plans, and career growth.
              </p>

            </div>

          </div>

        </CardContent>
      </Card>

      <Card className="rounded-[30px] border border-white/10">
        <CardContent className="space-y-5 p-6">

          <div className="rounded-2xl bg-white/[0.03] p-5">

            <div className="flex gap-3">

              <Sparkles className="h-5 w-5 text-cyan-400" />

              <div>

                <p className="font-medium">
                  Try asking:
                </p>

                <ul className="mt-3 space-y-2 text-sm text-zinc-400">

                  <li>How can I improve my ATS score?</li>
                  <li>Suggest projects for my profile</li>
                  <li>Generate interview questions</li>
                  <li>Create a 30-day roadmap</li>

                </ul>
                <div className="mt-5 flex flex-wrap gap-3">

<Button
variant="outline"
onClick={async()=>{

const prompt =
"Generate technical interview questions from my resume";

setMessages((prev)=>[
...prev,
{
role:"user",
text:prompt
}
]);

const resumeText =
localStorage.getItem(
  getUserKey("uploadedResumeText")
) || "";

const data =
await askAssistant(
prompt,
resumeText
);

setMessages((prev)=>[
...prev,
{
role:"assistant",
text:data.response
}
]);

}}
>

⚡ Technical

</Button>


<Button
variant="outline"
onClick={async()=>{

const prompt =
"Generate HR interview questions from my resume";

setMessages((prev)=>[
...prev,
{
role:"user",
text:prompt
}
]);

const resumeText =
localStorage.getItem(
  getUserKey("uploadedResumeText")
) || "";

const data =
await askAssistant(
prompt,
resumeText
);

setMessages((prev)=>[
...prev,
{
role:"assistant",
text:data.response
}
]);

}}
>

⚡ HR

</Button>


<Button
variant="outline"
onClick={async()=>{

const prompt =
"Generate project-based interview questions from my resume";

setMessages((prev)=>[
...prev,
{
role:"user",
text:prompt
}
]);

const resumeText =
localStorage.getItem(
  getUserKey("uploadedResumeText")
) || "";

const data =
await askAssistant(
prompt,
resumeText
);

setMessages((prev)=>[
...prev,
{
role:"assistant",
text:data.response
}
]);

}}
>

⚡ Projects

</Button>

</div>
              </div>

            </div>

          </div>
          <div className="
max-h-[400px]
space-y-3
overflow-y-auto
">

{messages.map((msg,index)=>(

<div
key={index}
className={`
rounded-2xl
p-4
max-w-[80%]
${
msg.role==="user"
?"ml-auto bg-cyan-500 text-white"
:"bg-white/[0.03]"
}
`}
>

{msg.text}

</div>

))}

</div>
          <div className="flex gap-3">

            <Input
              value={message}
              onChange={(e)=>setMessage(e.target.value)}
              placeholder="Ask AI Career Assistant..."
            />

            <Button
onClick={async()=>{

if(!message.trim()) return;

const userMessage=message;

setMessages((prev)=>[
...prev,
{
role:"user",
text:userMessage
}
]);

setMessage("");

try{

const resumeText =
localStorage.getItem(
  getUserKey("uploadedResumeText")
) || "";

const data=await askAssistant(
  userMessage,
  resumeText
);

setMessages((prev)=>[
...prev,
{
role:"assistant",
text:data.response
}
]);

}
catch{

setMessages((prev)=>[
...prev,
{
role:"assistant",
text:"Unable to connect to AI service."
}
]);

}

}}
>

<Send className="h-4 w-4"/>

</Button>

          </div>

        </CardContent>
      </Card>

    </div>
  );
}