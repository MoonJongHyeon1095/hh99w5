const UserRepository = require("../repositories/Users.repository");

class UserService {
    userRepository = new UserRepository();

    createUser = async ( nickname, password ) => {
      const existUser = await this.userRepository.findByNickname(nickname);
      if (existUser.length) throw new Error('중복된 닉네임 입니다.');

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
        if (!user) throw new Error("그런 사람 없어요. 회원가입 했어요?");
        
        return {
          userId : user.userId,
          nickname : user.nickname,
          password : user.password,
        };
      };  
}

module.exports = UserService;