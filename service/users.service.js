const UserRepository = require("../repositories/Users.repository");

class UserService {
    userRepository = new UserRepository();

    createUser = async ( nickname, password) => {
        const createUserData = await this.userRepository.createUser(
          nickname,
          password,
        );
    
        console.log(createUserData)
        return {
          nickname: createUserData.nickname,
          password: createUserData.password,
        };
      };

    findUser = async (nickname, password, ) => {
        const user = await this.userRepository.findUser(nickname, password);
        
        return {
          userId : user.userId,
          nickname : user.nickname,
          password : user.password,
        };
      };  
}

module.exports = UserService;