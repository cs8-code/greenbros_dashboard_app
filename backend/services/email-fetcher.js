import Imap from 'imap';
import { simpleParser } from 'mailparser';

/**
 * Fetch new/unread emails from Gmail IMAP
 * @returns {Promise<Array>} Array of parsed email objects
 */
export async function fetchNewEmails() {
  console.log('Connecting to Gmail IMAP...');

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error('Gmail credentials not configured. Please set GMAIL_USER and GMAIL_APP_PASSWORD in .env file.');
  }

  return new Promise((resolve, reject) => {
    const emails = [];

    // Remove spaces from app password
    const password = process.env.GMAIL_APP_PASSWORD.replace(/\s/g, '');

    const imap = new Imap({
      user: process.env.GMAIL_USER,
      password: password,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: {
        rejectUnauthorized: false
      }
    });

    imap.once('ready', () => {
      console.log('IMAP connection ready');

      imap.openBox('INBOX', false, (err, box) => {
        if (err) {
          console.error('Error opening INBOX:', err);
          imap.end();
          return reject(new Error('Failed to open INBOX: ' + err.message));
        }

        console.log('INBOX opened');

        // Search for UNSEEN emails
        imap.search(['UNSEEN'], (err, results) => {
          if (err) {
            console.error('Error searching emails:', err);
            imap.end();
            return reject(new Error('Failed to search emails: ' + err.message));
          }

          if (!results || results.length === 0) {
            console.log('No unread emails found');
            imap.end();
            return resolve([]);
          }

          console.log(`Found ${results.length} unread email(s)`);

          const fetch = imap.fetch(results, { bodies: '' });

          fetch.on('message', (msg, seqno) => {
            console.log(`Processing message #${seqno}`);

            msg.on('body', (stream, info) => {
              simpleParser(stream, async (err, parsed) => {
                if (err) {
                  console.error('Error parsing email:', err);
                  return;
                }

                try {
                  // Extract from address with name if available
                  let from = 'unknown@example.com';
                  if (parsed.from && parsed.from.value && parsed.from.value[0]) {
                    const fromData = parsed.from.value[0];
                    if (fromData.name && fromData.address) {
                      from = `${fromData.name} <${fromData.address}>`;
                    } else {
                      from = fromData.address;
                    }
                  }

                  // Extract subject
                  const subject = parsed.subject || '(No Subject)';

                  // Extract text content (prefer plain text over HTML)
                  let content = parsed.text || '';

                  // If no plain text, try to extract from HTML
                  if (!content && parsed.html) {
                    // Simple HTML to text conversion (remove tags)
                    content = parsed.html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
                  }

                  if (!content) {
                    content = '(Empty email)';
                  }

                  // Auto-detect keywords
                  const keywords = extractKeywords(subject, content);

                  emails.push({
                    from,
                    subject,
                    content,
                    keywords,
                    type: 'received',
                    status: 'unread'
                  });

                  console.log(`Parsed email from ${from}: ${subject}`);
                } catch (parseErr) {
                  console.error('Error processing email:', parseErr);
                }
              });
            });
          });

          fetch.once('error', (err) => {
            console.error('Fetch error:', err);
            imap.end();
            reject(new Error('Failed to fetch emails: ' + err.message));
          });

          fetch.once('end', () => {
            console.log('Done fetching messages');
            imap.end();
          });
        });
      });
    });

    imap.once('error', (err) => {
      console.error('IMAP error:', err);
      reject(new Error('IMAP connection failed: ' + err.message));
    });

    imap.once('end', () => {
      console.log('IMAP connection ended');
      resolve(emails);
    });

    imap.connect();
  });
}

/**
 * Extract keywords from email subject and content
 * @param {string} subject - Email subject
 * @param {string} content - Email content
 * @returns {Array<string>} Array of detected keywords
 */
function extractKeywords(subject, content) {
  const keywordMap = {
    'Preisanfrage': /preis|angebot|kosten|quote|price|offer|cost/i,
    'Terminanfrage': /termin|appointment|schedule|datum|meeting|date/i,
    'Anfrage': /anfrage|inquiry|frage|question|request/i,
    'Beschwerde': /beschwerde|complaint|problem|reklamation|issue/i
  };

  const text = `${subject} ${content}`;
  const detected = [];

  for (const [keyword, regex] of Object.entries(keywordMap)) {
    if (regex.test(text)) {
      detected.push(keyword);
    }
  }

  return detected.length > 0 ? detected : ['Sonstiges'];
}
