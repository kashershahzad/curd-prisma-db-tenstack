'use client'
import { useState, useEffect } from 'react';

export default function Home() {
  const [content, setContent] = useState('');
  const [message, setMessage] = useState(null);
  const [messages, setMessages] = useState([]);

  const handleChange = (e) => setContent(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/pages/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(`Message saved: ${data.content}`);
        fetchMessages(); // Refresh the message list after saving a new message
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message}`);
      }
    } catch (error) {
      setMessage('Error: Unable to save the message');
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch('/pages/api/messages');
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages(); // Fetch the messages when the component is mounted
  }, []);

  return (
    <div>
      <h1>Send a Message</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={content}
          onChange={handleChange}
          placeholder="Enter your message"
          required
        />
        <button type="submit">Send</button>
      </form>
      {message && <p>{message}</p>}

      <h2>All Messages</h2>
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>{msg.content}</li>
        ))}
      </ul>
    </div>
  );
}
