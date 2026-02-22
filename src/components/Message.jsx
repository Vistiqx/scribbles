import ImageMessage from './ImageMessage';

function getImageKey(image, index) {
  if (typeof image === 'string') {
    return `img-${image.substring(0, 30)}-${index}`;
  }
  if (image && image.imageId) {
    return `img-${image.imageId}`;
  }
  return `img-${index}`;
}

export default function Message({ message }) {
  if (!message) {
    console.error('Message component received invalid message:', message);
    return null;
  }

  const isUser = message.role === 'user';
  const images = Array.isArray(message.image) ? message.image : message.image ? [message.image] : [];

  return (
    <div className={`message ${message.role}`}>
      {isUser ? (
        <>
          <div className="message-content">
            {message.content && (
              <div className="message-bubble">
                {message.content}
              </div>
            )}
            {images.map((image, idx) => (
              <ImageMessage key={getImageKey(image, idx)} image={image} prompt={message.content} />
            ))}
          </div>
          <span className="message-label">User</span>
        </>
      ) : (
        <>
          <span className="message-label">Scribbles</span>
          <div className="message-content">
            {message.content && (
              <div className="message-bubble">
                {message.content}
              </div>
            )}
            {images.map((image, idx) => (
              <ImageMessage key={getImageKey(image, idx)} image={image} prompt={message.content} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
