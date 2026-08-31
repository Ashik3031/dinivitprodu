import express from 'express';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();

let genAIClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genAIClient;
}

router.post('/generate-content', async (req, res) => {
  try {
    const { promptType, coupleNames, eventType, tone, extraDetails } = req.body;
    const ai = getAIClient();

    if (!ai) {
      // Fallback pre-crafted luxury wedding & event copies if no key is supplied
      const fallbacks: Record<string, string[]> = {
        invitation_intro: [
          `Together with their families, ${coupleNames || 'the happy couple'} request the honour of your presence as they unite in holy matrimony and celebrate the beginning of forever.`,
          `Because you have shared in our lives and supported our journey, we warmly invite you to share in our joy as we exchange wedding vows and celebrate our love.`,
          `Two lives, two hearts, joined together in friendship, united forever in love. Join us for an evening of joy, fine dining, and dancing.`
        ],
        story: [
          `From serendipitous coffee conversations to sunset walks along the coastline, our story has been built on shared dreams, endless laughter, and boundless affection. We cannot wait to begin our next chapter with our cherished family and friends.`,
          `It began as a spark, grew into unwavering devotion, and now blossoms into a lifelong promise. We invite you to be part of our most treasured milestone.`
        ],
        dress_code: [
          `Attire: Formal Black Tie / Modern Elegance. We invite our guests to dress in deep jewel tones, classic tuxedos, or flowing evening gowns.`,
          `Attire: Garden Cocktail Chic. Light pastels, linen suits, and floral dresses are warmly encouraged for an open-air celebration.`
        ],
        itinerary: [
          `4:00 PM: Welcome Champagne & Preludes\n4:30 PM: Sacred Marriage Ceremony\n5:30 PM: Sunset Cocktail Hour & Canapés\n7:00 PM: Candlelight Banquet & Heartfelt Toasts\n8:30 PM: First Dance & Dancing Under the Stars`
        ]
      };

      const options = fallbacks[promptType] || fallbacks.invitation_intro;
      const text = options[Math.floor(Math.random() * options.length)];
      return res.json({ text, source: 'curated-template' });
    }

    const systemPrompt = `You are a world-class luxury wedding and digital invitation copywriter.
Generate elegant, poetic, and pristine text for an invitation.
Type: ${promptType}
Event: ${eventType || 'Wedding'}
Names: ${coupleNames || 'The Couple'}
Tone: ${tone || 'Romantic and Sophisticated'}
Context: ${extraDetails || 'Formal evening event'}

Rules:
- Keep the output concise, polished, and ready to paste directly onto a digital card.
- No markdown wrappers, no commentary, only the polished copy text.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: systemPrompt
    });

    const outputText = response.text || '';
    return res.json({ text: outputText.trim(), source: 'gemini' });
  } catch (error: any) {
    console.error('AI generation error:', error);
    return res.json({
      text: `Together with their families, we warmly invite you to celebrate our special day with joyous festivities and cherished memories.`,
      source: 'fallback'
    });
  }
});

export default router;
