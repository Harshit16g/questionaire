'use server'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { cookies } from 'next/headers';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(apiKey);
const RATE_LIMIT = 2; // 2 requests
const RATE_LIMIT_WINDOW = 60 * 1 * 1000; // 1 minute in milliseconds

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

export async function generateQuestions(exam: string, topic: string, difficulty: string): Promise<Question[]> {
  console.log('Starting generateQuestions with:', { exam, topic, difficulty });
  
  if (!exam || !topic || !difficulty) {
    throw new Error('Missing required parameters');
  }

  // Rate limiting
  const cookieStore = cookies();
  const lastRequestTime = cookieStore.get('lastRequestTime')?.value;
  const requestCount = cookieStore.get('requestCount')?.value;
  const now = Date.now();

  if (lastRequestTime && requestCount) {
    const timeSinceLastRequest = now - parseInt(lastRequestTime);
    if (timeSinceLastRequest < RATE_LIMIT_WINDOW) {
      if (parseInt(requestCount) >= RATE_LIMIT) {
        const remainingTime = Math.ceil((RATE_LIMIT_WINDOW - timeSinceLastRequest) / 60000);
        throw new Error(`Rate limit exceeded. Please try again in ${remainingTime} minutes.`);
      }
    }
  }

  // Update rate limiting cookies
  cookieStore.set('lastRequestTime', now.toString());
  cookieStore.set('requestCount', requestCount ? (parseInt(requestCount) + 1).toString() : '1');

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Generate 5 multiple-choice questions for a ${difficulty} level ${exam} exam on the topic of ${topic}. For each question, provide 4 options and indicate the correct answer. Format the output as a JSON array of objects, each containing 'question', 'options' (an array of 4 strings), and 'correctAnswer' (index of the correct option).`;
    
    console.log('Sending prompt to Gemini API:', prompt);
    const result = await model.generateContent(prompt);
    console.log('Received response from Gemini API');
    const text = result.response.text();
    console.log('Raw API response:', text);
    
    // Extract JSON content between ```json and ``` markers if present
    const jsonMatch = text.match(/```json\n?(.*?)\n?```/s);
    const jsonString = jsonMatch ? jsonMatch[1].trim() : text.trim();
    
    let parsedData: Question[];
    try {
      parsedData = JSON.parse(jsonString);
      console.log('Parsed data:', parsedData);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      throw new Error('Failed to parse API response: ' + (parseError instanceof Error ? parseError.message : String(parseError)));
    }

    if (!Array.isArray(parsedData) || parsedData.length === 0) {
      console.error('Invalid response format:', parsedData);
      throw new Error('Invalid response format from AI');
    }

    // Validate the structure of each question
    parsedData.forEach((question, index) => {
      if (!question.question || 
          !Array.isArray(question.options) || 
          question.options.length !== 4 || 
          typeof question.correctAnswer !== 'number' ||
          question.correctAnswer < 0 ||
          question.correctAnswer > 3) {
        console.error(`Invalid question format at index ${index}:`, question);
        throw new Error(`Invalid question format at index ${index}`);
      }
    });

    return parsedData;
  } catch (error) {
    console.error('Error in generateQuestions:', error);
    throw error instanceof Error ? error : new Error('Unknown error occurred: ' + String(error));
  }
}

