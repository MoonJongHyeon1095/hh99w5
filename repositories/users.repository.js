const { User } = require('../models');
const { Op } = require("sequelize");

class UserRepository {
    
    createUser = async (nickname, password) => {
        const createUserData = await User.create({
          nickname,
          password
        });
    
        return createUserData;
      };

    findUser = async (nickname, password) => {
        const user = await User.findOne({
            where: {
              [Op.and]: [{ nickname }, { password }],
            },
          });
    
        return user;
      }; 
      
      findByNickname = async (nickname) => {
        const user = await User.findAll({
          where: {
            nickname,
          },
        });
        return user;
      };

}

module.exports = UserRepository;
