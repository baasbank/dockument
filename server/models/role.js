module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    roleType: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          message: 'Role type cannot be empty.',
        },
        is: /^[a-z ]+$/i,
        len: [2, 50],
      },
    }
  }, {
    classMethods: {
      associate: (models) => {
        Role.hasMany(models.User, {
          foreignKey: 'roleType',
          as: 'users',
        });
      }
    }
  });
  return Role;
};

