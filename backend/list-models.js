import dotenv from 'dotenv';
dotenv.config({ path: '../.env.local' });

import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

async function listModels() {
  try {
    console.log('Fetching available models...\n');

    // Using the REST API directly to list models
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log('Available models:');
    console.log('================\n');

    data.models.forEach(model => {
      console.log(`Model: ${model.name}`);
      console.log(`Display Name: ${model.displayName}`);
      console.log(`Description: ${model.description}`);
      console.log(`Supported methods: ${model.supportedGenerationMethods.join(', ')}`);
      console.log('---');
    });

  } catch (error) {
    console.error('Error listing models:', error.message);
  }
}

listModels();
