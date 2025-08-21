import OpenAI from "openai";
import { eventService } from "./eventService"; // assuming you already have eventService

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class ChatService {
  async getChatResponse(userQuery: string, limit: number = 5) {
    // Fetch events from DB
    const events = await eventService.getAllEvents(); 

    const messages = [
      {
        role: "system",
        content: `You are a friendly Event Selection Assistant. 
Given a list of events, choose the ones that best match the user’s request. 
Respond in a helpful, creative way. 
If no events match, suggest the closest alternatives.`,
      },
      {
        role: "user",
        content: `Here are the events: 
${JSON.stringify(events, null, 2)}

User query: ${userQuery}`,
      },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.7,
    });

    return response.choices[0].message?.content || "No response generated.";
  }
}

export const chatService = new ChatService();
