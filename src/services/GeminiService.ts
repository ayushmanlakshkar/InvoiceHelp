import axios from 'axios';
import  {GEMINI_FORM_FILLING_PROMPT}  from './geminiPrompt';
// Define the expected format for the output (matches FormFillingScreen)
export interface GeminiFormData {
  [key: string]: any;
  lineItems?: Array<{
    id: string;
    description: string;
    hsnCode: string;
    quantity: number;
    units: string;
    amount: number;
    _rateInput: string;
  }>;
}

// Replace with your Gemini API endpoint and key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = 'AIzaSyCAhmnBUMREZNkp8GGe9DIgbSPw8A8-s5E'; // Store securely in production

/**
 * Calls Gemini API to analyze and convert transcribed text to form data.
 * @param transcribedText The text to analyze.
 * @param prompt The prompt to guide Gemini for conversion.
 * @returns GeminiFormData object matching FormFillingScreen format.
 */
export async function analyzeAndConvertText(transcribedText: string): Promise<GeminiFormData> {
  try {
    console.log('Transcribed text:', transcribedText);
    const systemPrompt = `${GEMINI_FORM_FILLING_PROMPT}\n\nTranscribed Text:\n${transcribedText}\n\nReturn the result as a JSON object matching the required form fields, including lineItems as an array if present.`;

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: [
          { role: 'user', parts: [{ text: systemPrompt }] }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // Gemini's response may contain the JSON as a string in the text field
    const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Remove markdown code block markers if present
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json/, '').trim();
    }
    if (cleanText.endsWith('```')) {
      cleanText = cleanText.replace(/```$/, '').trim();
    }
    // Try to parse as JSON directly if possible
    try {
      return JSON.parse(cleanText);
    } catch (e) {
      // Fallback: extract JSON substring if text is not pure JSON
      const jsonStart = cleanText.indexOf('{');
      const jsonEnd = cleanText.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonString = cleanText.substring(jsonStart, jsonEnd + 1);
        return JSON.parse(jsonString);
      }
      throw new Error('Could not parse Gemini response as JSON.');
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
}
