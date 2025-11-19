import dotenv from 'dotenv';
dotenv.config({ path: '../.env.local' });

import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

console.log('Testing Gemini API key...');
console.log('API Key (first 10 chars):', apiKey ? apiKey.substring(0, 10) + '...' : 'NOT FOUND');
console.log('API Key length:', apiKey ? apiKey.length : 0);
console.log('');

if (!apiKey) {
  console.error('❌ No API key found in environment variables!');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

async function testAPI() {
  try {
    console.log('Sending test request to Gemini API...');
    const result = await model.generateContent('Say hello in one word');
    const response = await result.response;
    const text = response.text();

    console.log('✅ SUCCESS! API key is working!');
    console.log('Response from Gemini:', text);
    console.log('');
    console.log('Your API is activated and working correctly.');
  } catch (error) {
    console.error('❌ FAILED! API key is not working.');
    console.error('Error:', error.message);
    console.log('');
    console.log('Possible reasons:');
    console.log('1. API key is invalid or expired');
    console.log('2. Generative Language API is not enabled in Google Cloud Console');
    console.log('3. API key has restrictions that prevent usage');
    console.log('');
    console.log('To fix:');
    console.log('- Go to https://aistudio.google.com/app/apikey');
    console.log('- Create a new API key or verify existing one');
    console.log('- Make sure "Generative Language API" is enabled');
    console.log('- Update .env.local with the correct key');
  }
}

testAPI();
