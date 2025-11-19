import { GoogleGenerativeAI } from '@google/generative-ai';

export async function analyzeEmail(emailContent, emailSubject, existingClients) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `
Analyze this customer service email and extract structured information.

EMAIL SUBJECT: ${emailSubject}

EMAIL CONTENT:
${emailContent}

EXISTING CLIENTS:
${existingClients.map(c => `- ${c.name} (${c.email || 'no email'})`).join('\n')}

Extract the following information in JSON format:
{
  "emailType": "one of: Preisanfrage, Terminanfrage, Auftrag, Beschwerde, Sonstiges",
  "customerName": "extracted customer name or null",
  "customerEmail": "extracted email address or null",
  "customerPhone": "extracted phone number or null",
  "serviceRequested": "what service is being requested (e.g., Rasenmähen, Heckenschneiden, Gartenpflege)",
  "urgency": "low, medium, or high",
  "matchingClient": "ID of matching existing client from the list, or null if no match",
  "suggestedTaskTitle": "a concise task title (max 60 chars)",
  "suggestedTaskDescription": "a detailed task description",
  "keywords": ["array", "of", "relevant", "keywords"],
  "estimatedDuration": "estimated time needed (e.g., '2 hours', '1 day')",
  "location": "extracted location/address if mentioned, or null"
}

Rules:
- Match customer to existing client by name or email if possible
- Be conservative with urgency - only mark high if explicitly urgent
- Extract all contact information carefully
- Keywords should be relevant for filtering/searching
- Task title should be action-oriented
- Return ONLY valid JSON, no markdown or explanation
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Remove markdown code blocks if present
    const jsonText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const analysis = JSON.parse(jsonText);
    return analysis;
  } catch (error) {
    console.error('AI Analysis Error:', error);
    throw new Error('Failed to analyze email with AI: ' + error.message);
  }
}
