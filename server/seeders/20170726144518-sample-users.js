const bcrypt = require('bcrypt');
require('dotenv').config();

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('Users', [{
      fullName: 'Baas Bank',
      email: 'baas@test.com',
      password: bcrypt.hashSync(process.env.TEST_ADMIN_PASSWORD, bcrypt.genSaltSync(10)),
      roleType: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      fullName: 'John Bosco',
      email: 'john@test.com',
      password: bcrypt.hashSync(process.env.TEST_SUPER_USER_PASSWORD, bcrypt.genSaltSync(10)),
      roleType: 'super user',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      fullName: 'Blessing Philip',
      email: 'blessing@test.com',
      password: bcrypt.hashSync(process.env.TEST_REGULAR_USER_PASSWORD, bcrypt.genSaltSync(10)),
      roleType: 'regular user',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    ], {});
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
