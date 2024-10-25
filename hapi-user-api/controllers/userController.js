import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const createUser = async (request, h) => {
  const { name, email, password } = request.payload;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ name, email, password: hashedPassword });
    return h.response({ id: user.id, name: user.name, email: user.email }).code(201);
  } catch (error) {
    return h.response({ error: 'User creation failed' }).code(500);
  }
};

export const loginUser = async (request, h) => {
  const { email, password } = request.payload;

  const user = await User.findOne({ where: { email } });
  if (!user) return h.response({ error: 'Invalid credentials' }).code(401);

  const match = await bcrypt.compare(password, user.password);
  if (!match) return h.response({ error: 'Invalid credentials' }).code(401);

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  return h.response({ token });
};
