'use client'
import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function Home() {
  const [content, setContent] = useState('');
  const [message, setMessage] = useState(null);

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
        getdata();
        setContent('')
      } else {
        const error = await response.json();
        setMessage(`Error: ${error.message}`);
      }
    } catch (error) {
      setMessage('Error: Unable to save the message');
    }
  };

  const getdata = async () => {
    try {
      const response = await axios('/pages/api/messages');
      return response.data;  
    } catch (error) {
      console.error('Error fetching messages:', error);
      return []; 
    }
  };

  const { data = [] } = useQuery({
    queryKey: ['content'],
    queryFn: getdata,
  });

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 min-h-screen p-6">
      <h1 className="text-4xl font-semibold text-blue-600 mb-6">Send a Message</h1>
      
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-4">
        <input
          type="text"
          value={content}
          onChange={handleChange}
          placeholder="Enter your message"
          required
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none">
          Send
        </button>
      </form>

      {message && <p className="mt-4 text-xl text-gray-700">{message}</p>}

      <h2 className="text-3xl font-medium text-blue-600 mt-12 mb-4">All Messages</h2>
      <ul className="w-full max-w-md space-y-2">
        {data.map((msg) => (
          <li key={msg.id} className="p-4 bg-white shadow-sm rounded-lg border border-gray-300">
            <p>{msg.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
