import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { prisma } from '@/lib/db';
import { UpdateProjectData } from '@/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid project ID' });
  }

  if (req.method === 'GET') {
    try {
      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      // Check if user has access to the project
      if (!project.isPublic && (!session || project.userId !== session.user.id)) {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.status(200).json(project);
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'PUT') {
    try {
      if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const project = await prisma.project.findUnique({
        where: { id },
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      if (project.userId !== session.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }

      const { title, description, content, isPublic }: UpdateProjectData = req.body;

      const updateData: any = {};
      if (title !== undefined) updateData.title = title.trim();
      if (description !== undefined) updateData.description = description?.trim() || null;
      if (content !== undefined) updateData.content = content;
      if (isPublic !== undefined) updateData.isPublic = isPublic;

      const updatedProject = await prisma.project.update({
        where: { id },
        data: updateData,
      });

      res.status(200).json(updatedProject);
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      if (!session) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const project = await prisma.project.findUnique({
        where: { id },
      });

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      if (project.userId !== session.user.id) {
        return res.status(403).json({ error: 'Access denied' });
      }

      await prisma.project.delete({
        where: { id },
      });

      res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}