import { Request as ExpressRequest,Request, Response } from 'express';
import prisma from '../config/prisma';
import { HTTP_STATUS } from '../constants/httpStatus';

interface AuthenticatedRequest extends ExpressRequest {
  user?: { id: string };
}

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
      console.log(error);
      
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
  },

  // Find user by email
  async findUserByPhoneNumber(req: Request, res: Response) {
    const { phoneNumber: phone_number } = req.params;
    try {
      const user = await prisma.user.findUnique({
        where: { phone_number },
        select: { id: true, phone_number: true, username: true, password: true, role: true, isActive: true }
      });
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'User not found' });
      }
      res.status(HTTP_STATUS.OK).json(user);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching user' });
    }
  },

  // Validate user credentials
  async validateUserCredentials(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, password: true }
      });
      if (!user) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Invalid credentials' });
      }
      // Note: In a real-world scenario, you should use a proper password hashing library
      const isPasswordValid = user.password === password;
      if (!isPasswordValid) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'Invalid credentials' });
      }
      res.status(HTTP_STATUS.OK).json({ message: 'Credentials are valid' });
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Error validating credentials' });
    }
  },

  // Update user password
  async updateUserPassword(req: Request, res: Response) {
    const { id } = req.params;
    const { password } = req.body;
    try {
      const updatedUser = await prisma.user.update({
        where: { id },
        data: { password },
        select: { id: true, email: true, username: true }
      });
      res.status(HTTP_STATUS.OK).json(updatedUser);
    } catch (error) {
      res.status(HTTP_STATUS.BAD_REQUEST).json({ error: 'Error updating user password' });
    }
  },

  async getCurrentUser(req: AuthenticatedRequest, res: Response) {
    console.log(req.user);
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({ error: 'User not authenticated' });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { 
          id: true, 
          email: true, 
          username: true, 
          firstName: true, 
          lastName: true, 
          role: true, 
          isActive: true,
          phone_number: true
        }
      });

      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'User not found' });
      }

      res.status(HTTP_STATUS.OK).json(user);
    } catch (error) {
      res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: 'Error fetching current user' });
    }
  },

  
};