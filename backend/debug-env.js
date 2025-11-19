import dotenv from 'dotenv';
dotenv.config({ path: '../.env.local' });

console.log('Environment variable check:');
console.log('GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY);
console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY?.length);
console.log('GEMINI_API_KEY first 15 chars:', process.env.GEMINI_API_KEY?.substring(0, 15));
console.log('GEMINI_API_KEY last 5 chars:', process.env.GEMINI_API_KEY?.slice(-5));
console.log('Full key (for debugging):', process.env.GEMINI_API_KEY);
