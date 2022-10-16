const UserRepository = require("../repositories/Users.repository");
const jwt = require('jsonwebtoken');

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
        console.log(user)
        const userId = user.userId
        const token = this.setToken(userId)
        
        return {
          token,  
          userId: user.userId,
          nickname: user.nickname,
          password: user.password,
        };
      };  

    setToken= async ( userId ) => {
        const expires = new Date();
          expires.setMinutes(expires.getMinutes() + 60); //쿠키 만료시간 60분
      
          const token = jwt.sign(
            { userId },
            process.env.SECRET_KEY, 
            { expiresIn: 60 * 24 },
             // 일단 24시간짜리로 실험. 
          );
      

          return token;  
    }  
}

module.exports = UserService;