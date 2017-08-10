import faker from 'faker';
import dotenv from 'dotenv';

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
  incompleteLoginCredentials: {
    email: 'baas@test.com',
    password: ''
  },
  userPasswordMismatch: {
    email: 'blessing@test.com',
    password: 'wrong'
  },
  updateUser: {
    fullName: 'Baas my man Bank',
    email: 'baasbank@test.com'
  },
  fakeEsther: {
    fullName: faker.name.findName(),
    email: faker.internet.email(),
    password: 'esther',
  },
  fakeUserDetails: {
    name: faker.name.findName(),
    email: faker.internet.email(),
    roleType: 'admin',
    createdAt: 'date',
    updatedAt: new Date()
  },
  fakeAudax: {
    fullName: 'Audax Audax',
    email: 'audax@test.com',
    password: 'audax',
    roleType: 'regular user'

  },
  documentOne: {
    title: faker.lorem.word(),
    content: faker.lorem.paragraph(),
    accessType: 'public',
    userId: 2
  },
  updateDocument: {
    title: 'My fourth updated document',
    content: 'Fourth updated lorem ipsum things. You know how we do it.',
    accessType: 'public'
  },
  fakeDocument: {
    title: faker.lorem.word(),
    content: faker.lorem.paragraph(),
  }
};
