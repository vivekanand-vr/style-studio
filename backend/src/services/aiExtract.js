/**
 * AI Text Extraction Service
 * Uses OpenAI GPT-4o-mini to parse raw product page text into structured item fields.
 * Called when: user pastes raw text from a product page (stores without official API).
 *
 * Prerequisites:
 *   Set OPENAI_API_KEY in .env
 */

let OpenAI;
try {
  OpenAI = require('openai').default || require('openai');
} catch {
  // Library not installed — operations degrade gracefully
}

const SYSTEM_PROMPT = `You are a product data extractor for a fashion wishlist app.
Extract the following fields from raw product page text. Return ONLY valid JSON with these exact keys.
If a field is not found return null for that field.

Fields:
- title (string): full product name
- brand (string): brand or manufacturer name
- price (number): numeric price only, no symbols or commas
- currency (string): 3-letter ISO code like INR, USD, EUR, GBP — default INR if unclear
- color (string): primary color of the item
- size (string): size if mentioned
- description (string): concise 1–2 sentence product description`;

/**
 * Extract product fields from a block of raw text (e.g. Ctrl+A, Ctrl+C from a product page).
 * @param {string} rawText - Raw text from the product page
 * @returns {Object} Partial item fields
 */
async function extractFromText(rawText) {
  if (!OpenAI) {
    console.warn('[aiExtract] openai package not installed — run: npm install openai');
    return { _importMethod: 'manual', _message: 'AI extraction unavailable' };
  }

  if (!process.env.OPENAI_API_KEY) {
    console.warn('[aiExtract] OPENAI_API_KEY not set in .env');
    return { _importMethod: 'manual', _message: 'AI extraction not configured' };
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // Truncate to first 3000 chars — enough for product details, avoids token waste
  const truncated = rawText.slice(0, 3000);

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user',   content: `Product page text:\n\n${truncated}` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0,
      max_tokens: 300,
    });

    const raw = completion.choices[0].message.content;
    const parsed = JSON.parse(raw);

    return {
      title:       parsed.title || '',
      brand:       parsed.brand || '',
      price:       parsed.price ? Number(parsed.price) : null,
      currency:    parsed.currency || 'INR',
      color:       parsed.color || '',
      size:        parsed.size || '',
      description: parsed.description || '',
      _importMethod: 'ai_text',
    };
  } catch (err) {
    console.error('[aiExtract] Error:', err.message);
    return { _importMethod: 'manual', _error: 'AI extraction failed' };
  }
}

module.exports = { extractFromText };
