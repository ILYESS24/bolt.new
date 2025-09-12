import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import prisma from '@/lib/db';
import { CreateProjectData } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (req.method === 'GET') {
    try {
      if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const projects = await prisma.project.findMany({
        where: {
          userId: (session.user as any).id,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      });

      res.status(200).json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'POST') {
    try {
      if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { name, description, content, isPublic }: CreateProjectData = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Name is required' });
      }

      const project = await prisma.project.create({
        data: {
          name: name.trim(),
          description: description?.trim() || null,
          content: content || '',
          isPublic: isPublic || false,
          userId: (session.user as any).id,
        },
      });

      res.status(201).json(project);
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}