
module.exports = {
  up: queryInterface =>
    queryInterface.bulkInsert('Roles', [{
      roleType: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      roleType: 'super user',
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      roleType: 'regular user',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {}),

  down: queryInterface => queryInterface.bulkDelete('Roles', null, {})
};
