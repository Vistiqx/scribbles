import { v4 as uuidv4 } from 'uuid';

export function createConversation(title = 'New Chat') {
  return {
    id: uuidv4(),
    title,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: []
  };
}

export function createMessage(role, content, image = null, attachments = []) {
  return {
    id: uuidv4(),
    role,
    content,
    image,
    attachments,
    timestamp: Date.now()
  };
}

export function deleteConversation(conversations, conversationId) {
  return conversations.filter(conv => conv.id !== conversationId);
}

export function generateTitle(prompt) {
  const maxLength = 30;
  const cleaned = prompt.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  if (cleaned.length <= maxLength) return cleaned;
  return cleaned.substring(0, maxLength) + '...';
}
