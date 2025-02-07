import { PrismaClient } from "@prisma/client";

// PrismaClient ka instance banaya gaya
const prisma = new PrismaClient()

// handler ek API function hai jo Next.js ke backend me run hota hai.
// req (request): Frontend ya API call se jo bhi request aayegi wo isme store hogi.
// res (response): Isko hum response bhejne ke liye use karenge.

export default async function handler(req, res) {
    // Agar request POST method se aayi hai, toh execute hoga.
    if (req.method === 'POST') {
        try {
            // `req.body` se data extract kiya, jaise ki `content`
            const { content } = req.body; // `title` ko bhi add kiya

            // Database query: Hum Prisma ka use karte hue post create kar rahe hain.
            // Hum `data` key mein `title` aur `content` bhejte hain.
            const post = await prisma.post.create({
                data: {
                    content      // Content ko data object mein include kiya
                }
            });

            // Agar post successfully create ho gaya, toh success message ke sath post data bheja.
            res.status(201).json({ message: 'Post created successfully!', post });

        } catch (error) {
            // Agar koi error aata hai, toh 500 status code aur error message bhejte hain
            res.status(500).json({ error: 'Something went wrong!' });
        }
    } else {
        // Agar method POST ke alawa koi aur method aayi, toh 405 Method Not Allowed response bhejte hain.
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
