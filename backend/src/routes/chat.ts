import { Router, Request, Response } from 'express';
import { getChatResponse } from '../services/gemini.js';

const router = Router();

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

interface ChatRequest {
  message: string;
  history?: ChatMessage[];
}

router.post('/', async (req: Request, res: Response) => {
  try {
    const { message, history = [] } = req.body as ChatRequest;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
      });
    }

    const response = await getChatResponse(message, history);

    res.json({
      success: true,
      data: {
        message: response,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get chat response',
    });
  }
});

export default router;
