import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const { content } = await req.json();

        if (!content) {
            return new Response(JSON.stringify({ message: 'Content is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const newMessage = await prisma.message.create({
            data: { content },
        });

        return new Response(JSON.stringify(newMessage), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ message: 'Database error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}



export async function GET(req) {
    try {
        const messages = await prisma.message.findMany();
        return new Response(JSON.stringify(messages), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Database error:', error);
        return new Response(JSON.stringify({ message: 'Database error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
