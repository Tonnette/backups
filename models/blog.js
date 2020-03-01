module.exports = function(sequelize, DataTypes) {
    var Blog = sequelize.define("Blog", {
      blog: {
        type: DataTypes.TEXT,
        allowNull: false,
        // validate: {
        //   len: [1]
        // }
      }
    });

    Blog.associate = function(models) {
      // We're saying that a Blog should belong to a Movie
      // A Blog can't be created without a Movie due to the foreign key constraint
      Blog.belongsTo(models.Movie, {
        foreignKey: {
          allowNull: false
        }
      });
    };


    return Blog;
  };
  