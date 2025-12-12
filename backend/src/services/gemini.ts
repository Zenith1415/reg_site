import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `You are TeamReg Assistant, a helpful and friendly AI chatbot for a team registration platform. Your role is to assist users with:

1. Team registration process
2. ID card verification questions
3. Technical support
4. General platform inquiries

Platform Information:
- Users can register teams with a unique Team ID (format: TEAM-XXXX-XXXX)
- Registration requires: team name, leader info, team members, and ID card upload
- Accepted ID formats: JPEG, PNG, WebP, PDF (max 10MB)
- Registration is FREE
- Confirmation email is sent automatically after registration
- reCAPTCHA verification is required to prevent bots
- Teams can have 1-10 members

Guidelines:
- Be friendly, helpful, and concise
- Use emojis sparingly to make responses engaging
- Format responses with bullet points or numbered lists when appropriate
- If you don't know something specific about the platform, provide general helpful guidance
- Keep responses under 200 words unless detailed explanation is needed
- Always be encouraging and supportive

Remember: You are specifically for this team registration platform. Stay focused on registration-related topics.`;

let genAI: GoogleGenerativeAI | null = null;
let model: ReturnType<GoogleGenerativeAI['getGenerativeModel']> | null = null;

function initializeGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.warn('⚠️ GEMINI_API_KEY not set. Chatbot will use fallback responses.');
    return false;
  }
  
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });
    console.log('✅ Gemini AI initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize Gemini:', error);
    return false;
  }
}

// Fallback responses when API is not available
const FALLBACK_RESPONSES: Record<string, string> = {
  'register': "To register your team:\n\n1️⃣ Click 'Start Registration'\n2️⃣ Complete the reCAPTCHA verification\n3️⃣ Enter your team details\n4️⃣ Add team members\n5️⃣ Upload your ID card\n\nYou'll receive a confirmation email with your unique Team ID!",
  'id': "For ID verification, you can upload:\n\n📄 Government-issued ID\n📄 Driver's license\n📄 Passport\n📄 Student ID\n\nAccepted formats: JPEG, PNG, WebP, PDF (max 10MB)",
  'help': "I can help you with:\n\n🔹 Registration process\n🔹 ID verification\n🔹 Team management\n🔹 Email confirmation\n🔹 Technical issues\n\nJust ask your question!",
  'default': "I'm here to help with your team registration! You can ask me about:\n\n• How to register\n• ID verification\n• Team members\n• Email confirmation\n\nWhat would you like to know?",
};

function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('register') || lowerMessage.includes('sign up')) {
    return FALLBACK_RESPONSES['register'];
  }
  if (lowerMessage.includes('id') || lowerMessage.includes('document') || lowerMessage.includes('upload')) {
    return FALLBACK_RESPONSES['id'];
  }
  if (lowerMessage.includes('help')) {
    return FALLBACK_RESPONSES['help'];
  }
  if (lowerMessage.match(/^(hi|hello|hey)/)) {
    return "Hello! 👋 I'm TeamReg Assistant. How can I help you with your team registration today?";
  }
  if (lowerMessage.match(/(thank|thanks)/)) {
    return "You're welcome! 😊 Is there anything else I can help you with?";
  }
  
  return FALLBACK_RESPONSES['default'];
}

export async function getChatResponse(
  message: string, 
  conversationHistory: Array<{ role: 'user' | 'model'; text: string }>
): Promise<string> {
  // Initialize on first call
  if (!genAI && !model) {
    initializeGemini();
  }
  
  // Use fallback if Gemini not available
  if (!model) {
    return getFallbackResponse(message);
  }
  
  try {
    // Build chat history
    const history = conversationHistory.map(msg => ({
      role: msg.role as 'user' | 'model',
      parts: [{ text: msg.text }],
    }));
    
    // Start chat with history
    const chat = model.startChat({
      history,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    });
    
    // Send message and get response
    const result = await chat.sendMessage(message);
    const response = result.response.text();
    
    return response;
  } catch (error) {
    console.error('Gemini API error:', error);
    return getFallbackResponse(message);
  }
}

export { initializeGemini };
