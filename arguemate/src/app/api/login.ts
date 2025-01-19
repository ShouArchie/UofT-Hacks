import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "POST") {
      const { username, password } = req.body;
      
      const user = await prisma.user.findUnique({
        where: { email: username }
      });

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      return res.status(200).json({ success: true });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Login error:', error instanceof Error ? error.message : 'Unknown error');
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
