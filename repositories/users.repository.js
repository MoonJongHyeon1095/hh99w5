const { User } = require('../models');
const { Op } = require("sequelize");

class UserRepository {
    
    createUser = async (nickname, hashed) => {
        const createUserData = await User.create({
          nickname,
          hashed
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
