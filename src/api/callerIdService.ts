const CALLERAPI_KEY = process.env.EXPO_PUBLIC_CALLERAPI_KEY;
const CALLERAPI_BASE_URL = 'https://api.callerapi.com/v1';

interface CallerIdReputation {
  isSpam: boolean;
  score: number;
  type: string;
  name?: string;
}

export async function getCallerIdReputation(phoneNumber: string): Promise<CallerIdReputation | null> {
  if (!CALLERAPI_KEY) {
    console.error('CallerAPI key is not set in environment variables.');
    return null;
  }

  try {
    const response = await fetch(`${CALLERAPI_BASE_URL}/reputation?number=${phoneNumber}`, {
      headers: {
        'X-API-Key': CALLERAPI_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`CallerAPI request failed with status: ${response.status}`);
      return null;
    }

    const data = await response.json();

    // Assuming the API returns a structure like:
    // { "number": "+1234567890", "reputation": { "is_spam": true, "score": 90, "type": "scam", "name": "Scam Call" } }
    if (data && data.reputation) {
      return {
        isSpam: data.reputation.is_spam,
        score: data.reputation.score,
        type: data.reputation.type,
        name: data.reputation.name,
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching caller ID reputation:', error);
    return null;
  }
}