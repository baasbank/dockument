
module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('Documents', [{
      title: 'My first document',
      content: 'lorem ipsum and the rest of it',
      accessType: 'public',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      title: 'My second document',
      content: 'second lorem ipsum and the rest of it',
      accessType: 'private',
      userId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    }, {
      title: 'My third document',
      content: 'third lorem ipsum and the rest of it',
      accessType: 'role',
      userId: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'My fourth document',
      content: 'fourth lorem ipsum and the rest of it',
      accessType: 'public',
      userId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },
  down: (queryInterface) => {
    return queryInterface.bulkDelete('Documents', null, {});
  }
};
