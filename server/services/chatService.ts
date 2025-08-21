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
        content: `You are a friendly Event Selection Assistant for sonic path website.help user to give most matching events from sonic path  events list. 
Respond in a helpful, creative,short way if its even not related to events. Use response in markdown format to make it more stylish and detailed.
If no events match, suggest the closest alternatives.
Here are the events: 
${JSON.stringify(events, null, 2)}

Important : response should be in markdown. event link path is replit.dev/event/eventid`,
      },
      {
        role: "user",
        content: ` ${userQuery}`,
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
