import { createUser, loginUser } from '../controllers/userController.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Mock dependencies
jest.mock('../models/User.js'); // Mock User model
jest.mock('bcrypt'); // Mock bcrypt library
jest.mock('jsonwebtoken'); // Mock jwt library

describe('User Controller', () => {

  afterEach(() => {
    jest.clearAllMocks(); // Reset mocks after each test
  });

  describe('createUser', () => {
    it('should create a new user and return user details with status code 201', async () => {
      // Arrange: Mock request and response objects
      const request = {
        payload: {
          name: 'test1',
          email: 'test1@gmail.com',
          password: 'password123',
        },
      };
      const h = {
        response: jest.fn().mockReturnValue({
          code: jest.fn().mockReturnValue(201),
        }),
      };

      // Mock bcrypt.hash and User.create
      bcrypt.hash.mockResolvedValue('password123');
      User.create.mockResolvedValue({
        id: 1,
        name: 'test1',
        email: 'test1@gmail.com',
        password: 'password123',
      });

      // Act: Call the createUser function
      const result = await createUser(request, h);

      // Assert: Check if createUser behaves as expected
      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(User.create).toHaveBeenCalledWith({
        name: 'test1',
        email: 'test1@gmail.com',
        password: 'password123',
      });
      expect(h.response).toHaveBeenCalledWith({
        id: 1,
        name: 'test1',
        email: 'test1@gmail.com',
      });
      expect(h.response().code).toHaveBeenCalledWith(201);
    });

    it('should return an error with status code 500 if user creation fails', async () => {
      // Arrange
      const request = {
        payload: {
          name: 'test1',
          email: 'test1@gmail.com',
          password: 'password123',
        },
      };
      const h = {
        response: jest.fn().mockReturnValue({
          code: jest.fn().mockReturnValue(500),
        }),
      };

      bcrypt.hash.mockResolvedValue('password123');
      User.create.mockRejectedValue(new Error('Database Error'));

      // Act
      const result = await createUser(request, h);

      // Assert
      expect(h.response).toHaveBeenCalledWith({ error: 'User creation failed' });
      expect(h.response().code).toHaveBeenCalledWith(500);
    });
  });

  describe('loginUser', () => {
    it('should return a token for valid credentials', async () => {
      // Arrange
      const request = {
        payload: {
          email: 'test@example.com',
          password: 'password123',
        },
      };
      const h = {
        response: jest.fn().mockReturnValue({
          code: jest.fn().mockReturnValue(200),
        }),
      };

      // Mocking dependencies
      User.findOne.mockResolvedValue({
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword123',
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('fakeToken123');

      // Act
      const result = await loginUser(request, h);

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword123');
      expect(jwt.sign).toHaveBeenCalledWith({ id: 1 }, process.env.JWT_SECRET, { expiresIn: '1h' });
      expect(h.response).toHaveBeenCalledWith({ token: 'fakeToken123' });
    });

    it('should return an error if the user is not found', async () => {
      // Arrange
      const request = {
        payload: {
          email: 'test1@gmail.com',
          password: 'password123',
        },
      };
      const h = {
        response: jest.fn().mockReturnValue({
          code: jest.fn().mockReturnValue(401),
        }),
      };

      // Mocking findOne to return null
      User.findOne.mockResolvedValue(null);

      // Act
      const result = await loginUser(request, h);

      // Assert
      expect(h.response).toHaveBeenCalledWith({ error: 'Invalid credentials' });
      expect(h.response().code).toHaveBeenCalledWith(401);
    });

    it('should return an error if the password is incorrect', async () => {
      // Arrange
      const request = {
        payload: {
          email: 'test1@gmail.com',
          password: 'wrongpassword',
        },
      };
      const h = {
        response: jest.fn().mockReturnValue({
          code: jest.fn().mockReturnValue(401),
        }),
      };

      User.findOne.mockResolvedValue({
        id: 1,
        email: 'test1@gmail.com',
        password: 'hashedpassword123',
      });
      bcrypt.compare.mockResolvedValue(false);

      // Act
      const result = await loginUser(request, h);

      // Assert
      expect(h.response).toHaveBeenCalledWith({ error: 'Invalid credentials' });
      expect(h.response().code).toHaveBeenCalledWith(401);
    });
  });
});
