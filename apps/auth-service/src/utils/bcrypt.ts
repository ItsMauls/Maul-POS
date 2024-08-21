import bcrypt from 'bcrypt';

export const hashPassword = (password: string) => bcrypt.hash(password, 10);
export const comparePassword = (password: string, hashedPassword: string) => bcrypt.compare(password, hashedPassword);