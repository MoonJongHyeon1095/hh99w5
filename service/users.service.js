const { DuplicateDBDataError, ValidationError } = require("../exceptions/index.exception");
const UserRepository = require("../repositories/Users.repository");

class UserService {
    userRepository = new UserRepository();

    createUser = async ( nickname, password ) => {
      const isExistUser = await this.userRepository.findByNickname(nickname);
      if (isExistUser.nickname === nickname) {
        throw new DuplicateDBDataError('동일한 Nickname을 가진 User가 이미 존재합니다.')
      }

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
        if (!user) throw new ValidationError("그런 사람 없어요. 회원가입 했어요?");
        
        return {
          userId : user.userId,
          nickname : user.nickname,
          password : user.password,
        };
      };  
}

module.exports = UserService;