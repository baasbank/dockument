
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          message: 'Name field cannot be empty.',
        },
        is: /^[a-z ]+$/i,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          message: 'Please input a valid email address.',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          message: 'Password field cannot be empty.',
        }
      },
    },
    roleType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    classMethods: {
      associate: (models) => {
        User.hasMany(models.Document, {
          foreignKey: 'UserId',
          as: 'documents',
        });

        User.belongsTo(models.Role, {
          foreignKey: 'roleType',
          onDelete: 'CASCADE',
        });
      }
    }
  });
  return User;
};
