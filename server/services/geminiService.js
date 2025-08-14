const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ],
});

async function generateCourseOutline(topic) {
  const prompt = `
    You are an expert instructional designer. Based on the topic "${topic}", generate a structured course outline.
    The output must be a single, valid JSON object with the following structure:
    {
      "title": "A compelling course title",
      "description": "A brief, one-sentence course description",
      "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
      "modules": [
        {
          "title": "Title of Module 1",
          "lessons": ["Title of Lesson 1.1", "Title of Lesson 1.2"]
        }
      ]
    }
    Generate 3 to 5 modules, each with 2 to 5 lesson titles. Do not include any text outside the JSON object.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const courseJSON = response.text();
    // Some responses may include markdown code fences like ```json ... ```
    const cleaned = courseJSON
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Error generating course outline from Gemini:', error);
    throw new Error('Failed to generate course outline from Gemini.');
  }
}

async function generateLessonContent(lessonTitle) {
  const prompt = `
    You are an expert educator. Based on the lesson title "${lessonTitle}", generate detailed lesson content.
    The output must be a single, valid JSON object representing an array of content blocks.
    Supported types are "h2", "p", and "code".
    Example structure:
    {
      "content": [
        {
          "type": "h2",
          "content": "Introduction to [Topic]"
        },
        {
          "type": "p",
          "content": "A detailed paragraph..."
        },
        {
          "type": "code",
          "content": "console.log('Hello');"
        }
      ]
    }
    Generate 3 to 5 content blocks. Do not include any text outside the JSON object.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const lessonJSON = response.text();
    const cleaned = lessonJSON
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();
    const parsed = JSON.parse(cleaned);
    return parsed[Object.keys(parsed)[0]];
  } catch (error) {
    console.error('Error generating lesson content from Gemini:', error);
    throw new Error('Failed to generate lesson content from Gemini.');
  }
}

module.exports = { generateCourseOutline, generateLessonContent };