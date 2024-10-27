
import User from '../models/User'; 

// Mock the User model
jest.mock('../models/User');

jest.mock('../models/User', () => ({
    find: jest.fn(),
    updateOne: jest.fn(),
  }));
  
  describe('User Model', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

  describe('User.find', () => {
    it('should return a list of users', async () => {
      const mockUsers = [
        { name: 'User1', email: 'user1@gmail.com' },
        { name: 'User2', email: 'user2@gmail.com' },
      ];
      User.find.mockResolvedValue(mockUsers);

      const result = await User.find();
      expect(result).toEqual(mockUsers);
    });

    it('should return an empty array if no users are found', async () => {
      User.find.mockResolvedValue([]);

      const result = await User.find();
      expect(result).toEqual([]);
    });
  });

  // Additional test cases for updateOne, deleteOne, etc.
  describe('User.updateOne', () => {
    it('should update the user and return the modified count', async () => {
      User.updateOne.mockResolvedValue({ modifiedCount: 1 });

      const result = await User.updateOne({ email: 'user1@gmail.com' }, { name: 'UpdatedUser' });
      expect(result.modifiedCount).toBe(1);
    });
  });

 
});
