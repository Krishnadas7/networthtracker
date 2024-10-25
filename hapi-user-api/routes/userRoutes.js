import { createUser, loginUser } from '../controllers/userController.js';
import { userSchema, loginSchema } from '../validations/userValidation.js';

const userRoutes = [
  {
    method: 'POST',
    path: '/register',
    handler: async (request, h) => {
      const { error } = userSchema.validate(request.payload);
      if (error) return h.response({ error: error.details[0].message }).code(400);
      return createUser(request, h);
    },
  },
  {
    method: 'POST',
    path: '/login',
    handler: async (request, h) => {
      const { error } = loginSchema.validate(request.payload);
      if (error) return h.response({ error: error.details[0].message }).code(400);
      return loginUser(request, h);
    },
  },
];

export default userRoutes;
