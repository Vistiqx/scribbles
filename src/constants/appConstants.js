export const AVAILABLE_MODELS = [
  { id: 'google/gemini-3-pro-preview', name: 'Gemini 3 Pro', provider: 'Google' },
  { id: 'openai/gpt-5-image-mini', name: 'GPT-5 Image Mini', provider: 'OpenAI' },
  { id: 'google/gemini-2.5-flash-image', name: 'Gemini 2.5 Flash Image', provider: 'Google' },
];

export const PROMPT_TEMPLATES = [
  { id: 'portrait', name: 'Portrait', prompt: 'A professional portrait photo of a person, detailed, high quality' },
  { id: 'landscape', name: 'Landscape', prompt: 'A breathtaking landscape scene, golden hour, detailed, photorealistic' },
  { id: 'anime', name: 'Anime', prompt: 'Anime style illustration, vibrant colors, detailed, high quality anime art' },
  { id: '3d-render', name: '3D Render', prompt: '3D rendered scene, unreal engine, detailed, high quality, cinematic lighting' },
  { id: 'abstract', name: 'Abstract', prompt: 'Abstract art, vibrant colors, creative, high quality, modern art style' },
  { id: 'product', name: 'Product', prompt: 'Product photography, clean background, professional lighting, high quality' },
  { id: 'architecture', name: 'Architecture', prompt: 'Architectural visualization, modern building, detailed, photorealistic' },
  { id: 'fantasy', name: 'Fantasy', prompt: 'Fantasy artwork, magical, detailed, epic, high quality fantasy concept art' },
];

export const STYLE_PRESETS = [
  { id: 'none', name: 'None', prompt: '' },
  { id: 'photorealistic', name: 'Photorealistic', prompt: 'photorealistic, realistic lighting, detailed, high resolution' },
  { id: 'anime', name: 'Anime', prompt: 'anime style, manga art, vibrant colors, detailed linework' },
  { id: 'digital-art', name: 'Digital Art', prompt: 'digital art, concept art, intricate details, vibrant colors' },
  { id: 'oil-painting', name: 'Oil Painting', prompt: 'oil painting style, painterly, rich textures, classical art' },
  { id: 'watercolor', name: 'Watercolor', prompt: 'watercolor style, soft colors, flowing, artistic' },
  { id: '3d-render', name: '3D Render', prompt: '3D render, CGI, unreal engine, detailed, cinematic lighting' },
  { id: 'pixel-art', name: 'Pixel Art', prompt: 'pixel art, 8-bit, retro gaming style, detailed sprites' },
  { id: 'line-art', name: 'Line Art', prompt: 'clean line art, minimalist, black and white, illustration' },
  { id: 'cinematic', name: 'Cinematic', prompt: 'cinematic, film grain, dramatic lighting, movie poster style' },
];

export const DEFAULT_SETTINGS = {
  defaultAspectRatio: '1:1',
  defaultFormat: 'png',
  defaultQuality: 'standard',
  defaultImageSize: '1K',
  selectedModel: 'google/gemini-3-pro-preview',
  batchCount: 1,
  seed: '',
  stylePreset: 'none',
  maxStorageMB: 500
};
