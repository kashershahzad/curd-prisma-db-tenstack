'use client'
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export default function Home() {
  const [content, setContent] = useState('');
  const [message, setMessage] = useState(null);

  const queryClient = useQueryClient();

  const handleChange = (e) => setContent(e.target.value);

  const mutation = useMutation({
    mutationFn: async (content) => {
      const response = await fetch('/pages/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Error saving the message');
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['content']);
      setMessage(`Message saved: ${data.content}`);
      setContent('');
    },
    onError: (error) => {
      setMessage(`Error: ${error.message}`);
    },
  });

  const { data = [] } = useQuery({
    queryKey: ['content'],
    queryFn: async () => {
      const response = await axios('/pages/api/messages');
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch('/pages/api/messages', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        return id;
      } else {
        throw new Error('Error deleting the message');
      }
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries(['content']);
      setMessage(`Message deleted`);
    },
    onError: (error) => {
      setMessage(`Error: ${error.message}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(content); 
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

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

      <h2 className="text-3xl font-medium text-blue-600 mt-12 mb-4">Messages</h2>
      <ul className="w-full max-w-md space-y-2">
        {data.map((msg) => (
          <li key={msg.id} className="p-4 bg-white shadow-sm rounded-lg border border-gray-300">
            <p>{msg.content}</p>
            <button
              onClick={() => handleDelete(msg.id)}
              className="mt-2 text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
