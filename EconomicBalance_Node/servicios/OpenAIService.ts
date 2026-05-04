import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function generateChatReply(message: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('Falta OPENAI_API_KEY en el .env');
  }

  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || 'gpt-5.4-mini',
    input: [
      {
        role: 'system',
        content: 'Eres un asistente útil para Economic Balance. Responde claro y breve.'
      },
      {
        role: 'user',
        content: message
      }
    ],
    max_output_tokens: 300
  });

  return response.output_text;
}
