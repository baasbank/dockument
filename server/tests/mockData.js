import faker from 'faker';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

export default {
  admin: {
    email: 'baas@test.com',
    password: process.env.TEST_ADMIN_PASSWORD
  },
  superUser: {
    email: 'john@test.com',
    password: process.env.TEST_SUPER_USER_PASSWORD
  },
  regularUser: {
    email: 'blessing@test.com',
    password: process.env.TEST_REGULAR_USER_PASSWORD
  },
  fakeEsther: {
    fullName: faker.name.findName(),
    email: faker.internet.email(),
    password: bcrypt.hash('password', 10),
    roleType: 'admin',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  fakeUserDetails: {
    fullName: faker.name.findName(),
    email: faker.internet.email(),
    password: bcrypt.hash('password', 10),
    roleType: 'admin',
    createdAt: 'date',
    updatedAt: new Date()
  },
};
