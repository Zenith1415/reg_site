import { v4 as uuidv4 } from 'uuid';

export function generateTeamId(): string {
  const uuid = uuidv4().replace(/-/g, '').toUpperCase();
  const part1 = uuid.substring(0, 4);
  const part2 = uuid.substring(4, 8);
  return `TEAM-${part1}-${part2}`;
}

export async function verifyRecaptcha(token: string): Promise<boolean> {
  if (!token) {
    return false;
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  
  if (secretKey === '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe') {
    console.log('🔑 Using reCAPTCHA test keys - verification always passes');
    return true;
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json() as { success: boolean; score?: number; 'error-codes'?: string[] };
    
    if (!data.success) {
      console.error('❌ reCAPTCHA verification failed. Google response:', JSON.stringify(data, null, 2));
    }

    return data.success;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
