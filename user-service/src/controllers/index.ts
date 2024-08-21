import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { HTTP_STATUS } from '../constants/httpStatus';


export const userController = {
  // Get all users
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany({
        select: { id: true, email: true, username: true, role: true, isActive: true }
      });
      res
        .status(HTTP_STATUS.OK)
      .json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching users' });
    }
  },

  // Get user by ID
  async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: { profile: true }
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res
        .status(HTTP_STATUS.OK)
      .json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user' });
    }
  },

  // Create new user
  async createUser(req: Request, res: Response) {
    const { email, username, password, firstName, lastName } = req.body;
    try {
      const newUser = await prisma.user.create({
        data: { email, username, password, firstName, lastName }
      });
      res
        .status(HTTP_STATUS.CREATED)
        .json(newUser);
    } catch (error) {
      res.status(400).json({ error: 'Error creating user' });
    }
  },

  // Update user
  async updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { email, username, firstName, lastName, isActive } = req.body;
    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { email, username, firstName, lastName, isActive }
      });
      res
        .status(HTTP_STATUS.OK)
        .json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: 'Error updating user' });
    }
  },

  // Delete user
  async deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await prisma.user.delete({ where: { id } });
      res
        .status(HTTP_STATUS.OK)
        .json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: 'Error deleting user' });
    }
  }
};