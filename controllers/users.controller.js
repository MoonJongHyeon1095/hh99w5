const UserService = require('../service/users.service');
const joi = require('../util/joi');
const jwt = require('jsonwebtoken');
const { InvalidParamsError, ValidationError } = require('../exceptions/index.exception');
const tokenFactory = require('../util/tokenFactory')
const bcrypt = require('bcrypt');

class UsersController {
  userService = new UserService();
  tokenfactory = new tokenFactory();

  /**
   * 클라이언트로 부터 받은 유저정보를 검증하고 암호화 합니다.
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  //sign up
  signup = async (req, res, next) => {
    try {

      const { nickname, password, confirm } =
        await joi.signupSchema.validateAsync(req.body);

      if (!nickname || !password || !confirm) {
          throw new InvalidParamsError('뭐 하나 빼먹으셨는데?');
        }     

      if (password !== confirm)
        throw new ValidationError('비번이 확인란이랑 다른 걸요.')

      if (password.includes(nickname) || nickname.includes(password))
        throw new ValidationError('닉네임이랑 비번이 그게 뭐에요.')
      
      // 비밀번호 hash
      const hashed = await bcrypt.hash(password, 12);
      
      //const users = Object.create({ nickname, password: hashed });

      // hash된 유저 정보를 service로 전달
      // 서비스 계층에 구현된 createUser 로직을 실행합니다.
      const createUserData = await this.userService.createUser(
        {nickname, hashed}
      );
      res
        .status(201)
        .json({ data: createUserData, message: '회원으로 가입되었다.' });
    } catch (error) {
      next(error)
    }
  };


  /**
   * 클라이언트로부터 받은 정보를 1차적으로 검증하고 service로 전달합니다.
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  //login
  login = async (req, res, next) => {
    try {
      const { nickname, password } = await joi.loginSchema.validateAsync(
        req.body
      );

      if (!nickname || !password ) {
        throw new InvalidParamsError('뭐 하나 빼먹으셨는데?');
      }   

      const token = await this.userService.findUser(req, res);
      
      
      // const userId = user.userId
      // const token = this.tokenfactory.setToken(userId)

      return res
        .status(200)
        .json({ token, message: '로그인이 되었다.' });
    } catch (error) {
      next(error)
    }
  };
}

module.exports = UsersController;
