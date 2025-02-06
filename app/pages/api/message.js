// pages/api/messages.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    try {
      const message = await prisma.message.create({
        data: { content },
      });
      res.status(200).json(message);
    } catch (error) {
      res.status(500).json({ message: 'Error saving message' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
