import dotenv from 'dotenv';
dotenv.config({ path: '../.env.local' });

const apiKey = process.env.GEMINI_API_KEY;

async function testDirect() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const body = {
    contents: [{
      parts: [{
        text: "Say hello"
      }]
    }]
  };

  console.log('Testing direct API call to Gemini...');
  console.log('API Key:', apiKey.substring(0, 10) + '...');
  console.log('');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    console.log('Response status:', response.status);
    console.log('Response statusText:', response.statusText);

    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ SUCCESS! API key is working!');
    } else {
      console.log('\n❌ FAILED! API returned an error.');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testDirect();
