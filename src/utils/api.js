const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const DEFAULT_MODEL = 'google/gemini-3-pro-preview';

export async function generateImage(prompt, options = {}) {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenRouter API key not configured. Please add VITE_OPENROUTER_API_KEY to your .env file.');
  }

  const { 
    aspectRatio = '1:1',
    quality = 'standard',
    imageSize = '1K',
    model = DEFAULT_MODEL,
    attachments = [],
    signal 
  } = options;

  const aspectRatios = {
    '1:1': '1:1',
    '16:9': '16:9',
    '9:16': '9:16',
    '4:3': '4:3',
    '3:4': '3:4',
    '2:3': '2:3',
    '3:2': '3:2',
    '4:5': '4:5',
    '5:4': '5:4',
    '21:9': '21:9',
  };

  const selectedAspectRatio = aspectRatios[aspectRatio] || '1:1';

  // Build message content - text + any attached images
  let messageContent = [];
  
  // Add attached images first
  for (const attachment of attachments) {
    messageContent.push({
      type: 'image_url',
      image_url: {
        url: attachment
      }
    });
  }
  
  // Add text prompt
  messageContent.push({
    type: 'text',
    text: prompt
  });

  const imageConfig = {
    aspect_ratio: selectedAspectRatio,
    image_size: imageSize
  };

  console.log('API Request:', {
    model: model,
    prompt: prompt,
    aspectRatio: selectedAspectRatio,
    imageSize: imageSize,
    attachments: attachments.length
  });

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Scribbles Image Generator'
    },
    signal,
    body: JSON.stringify({
      model: model,
      modalities: ['image', 'text'],
      messages: [
        {
          role: 'user',
          content: messageContent
        }
      ],
      image_config: imageConfig,
      max_tokens: 4096
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
  }

  const data = await response.json();
  
  console.log('API Response status:', response.status);
  console.log('API Response:', JSON.stringify(data, null, 2));
  
  if (!data.choices || !data.choices[0]) {
    throw new Error('Invalid response from API: ' + JSON.stringify(data));
  }

  const message = data.choices[0].message;
  
  let imageBase64 = null;
  let imageMimeType = 'image/png';
  let responseText = '';

  function detectMimeType(base64Data) {
    if (!base64Data) return 'image/png';
    try {
      const firstChars = base64Data.substring(0, 20);
      const bytes = atob(firstChars).slice(0, 8);
      const byteArr = new Uint8Array([...bytes].map(c => c.charCodeAt(0)));
      
      if (byteArr[0] === 0x89 && byteArr[1] === 0x50) return 'image/png';
      if (byteArr[0] === 0xFF && byteArr[1] === 0xD8) return 'image/jpeg';
      if (byteArr[0] === 0x47 && byteArr[1] === 0x49) return 'image/gif';
      if (byteArr[0] === 0x52 && byteArr[1] === 0x49) return 'image/webp';
    } catch (e) {}
    return 'image/png';
  }

  // Handle various response formats from Gemini
  if (message.content) {
    if (Array.isArray(message.content)) {
      for (const part of message.content) {
        if (part.type === 'image' || part.type === 'image_url') {
          // Handle different image formats
          let data = part.source?.data || part.image_url?.data || part.image_url?.url;
          if (data) {
            // If it's a data URL, extract the base64 part
            if (typeof data === 'string' && data.startsWith('data:')) {
              const base64Match = data.match(/base64,(.+)/);
              if (base64Match) {
                imageBase64 = base64Match[1];
                imageMimeType = detectMimeType(imageBase64);
              } else {
                // Data URL without base64 prefix (rare), keep as is
                const parts = data.split(',');
                imageBase64 = parts.length > 1 ? parts[1] : data;
                imageMimeType = parts.length > 1 && parts[0].includes('image/') ? parts[0].split(';')[0] : 'image/png';
              }
            } else {
              // Raw base64 string
              imageBase64 = data;
              // If it's already a data URL, extract the base64 part for detection
              if (data.startsWith('data:')) {
                const base64Match = data.match(/base64,(.+)/);
                imageMimeType = base64Match ? detectMimeType(base64Match[1]) : 'image/png';
              } else {
                imageMimeType = detectMimeType(data);
              }
            }
          }
        } else if (part.type === 'text') {
          responseText += part.text || '';
        }
      }
    } else if (typeof message.content === 'string') {
      responseText = message.content;
    }
  }

  // Fallback: check for inline_data (some API responses use this)
  if (!imageBase64 && message.inline_data) {
    let data = message.inline_data.data;
    if (typeof data === 'string' && data.startsWith('data:')) {
      const base64Match = data.match(/base64,(.+)/);
      if (base64Match) {
        imageBase64 = base64Match[1];
        imageMimeType = detectMimeType(imageBase64);
      }
    } else {
      imageBase64 = data;
      imageMimeType = detectMimeType(data);
    }
  }

  // Check for image in the root message
  if (!imageBase64 && message.image) {
    if (typeof message.image === 'string') {
      if (message.image.startsWith('data:')) {
        const base64Match = message.image.match(/base64,(.+)/);
        imageBase64 = base64Match ? base64Match[1] : message.image.split(',')[1];
        imageMimeType = detectMimeType(imageBase64);
      } else {
        imageBase64 = message.image;
        imageMimeType = detectMimeType(message.image);
      }
    } else if (message.image.data) {
      let data = message.image.data;
      if (typeof data === 'string' && data.startsWith('data:')) {
        const base64Match = data.match(/base64,(.+)/);
        imageBase64 = base64Match ? base64Match[1] : data.split(',')[1];
        imageMimeType = detectMimeType(imageBase64);
      } else {
        imageBase64 = data;
        imageMimeType = detectMimeType(data);
      }
    }
  }

  // Check for images array (OpenRouter/Gemini format)
  if (!imageBase64 && message.images && Array.isArray(message.images)) {
    for (const img of message.images) {
      if (img.image_url?.url) {
        const urlData = img.image_url.url;
        if (urlData.startsWith('data:image')) {
          const base64Match = urlData.match(/base64,(.+)/);
          if (base64Match) {
            imageBase64 = base64Match[1];
            imageMimeType = detectMimeType(imageBase64);
            break;
          }
        }
      }
    }
  }

  if (!imageBase64) {
    console.warn('No image found in response. Full response:', message);
  }

  return {
    text: responseText,
    image: imageBase64 ? (imageBase64.startsWith('data:') ? imageBase64 : `data:${imageMimeType};base64,${imageBase64}`) : null,
    usage: data.usage
  };
}

export function cancelRequest(abortController) {
  if (abortController) {
    abortController.abort();
  }
}
