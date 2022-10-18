const UserService = require('../service/users.service');
const joi = require('../util/joi');
const jwt = require('jsonwebtoken');
const { InvalidParamsError, ValidationError } = require('../exceptions/index.exception');

class UsersController {
  userService = new UserService();

  /**
   * @param {import("express").request} req - express Request
   * @param {import("express").response} res - express Response
   * @param {import("express").NextFunction} next - express Next
   * **/
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

      // 서비스 계층에 구현된 createUser 로직을 실행합니다.
      const createUserData = await this.userService.createUser(
        nickname,
        password
      );
      res
        .status(201)
        .json({ data: createUserData, message: '회원으로 가입되었다.' });
    } catch (error) {
      next(error)
    }
  };


    /**
   * @param {import("express").request} req - express Request
   * @param {import("express").response} res - express Response
   * @param {import("express").NextFunction} next - express Next
   * **/
  //login
  login = async (req, res, next) => {
    try {
      const { nickname, password } = await joi.loginSchema.validateAsync(
        req.body
      );

      if (!nickname || !password ) {
        throw new InvalidParamsError('뭐 하나 빼먹으셨는데?');
      }   

      const user = await this.userService.findUser(nickname, password);
      console.log(user)
      
      if (!user) {
        throw new ValidationError('그런 사람 없대요.');
      }  

      const expires = new Date();
      expires.setMinutes(expires.getMinutes() + 60); //쿠키 만료시간 60분

      const token = jwt.sign(
        { userId: user.userId },
        process.env.SECRET_KEY,
        { expiresIn: 60 * 24 }
        // 일단 24시간짜리로 실험.
      );

      res.cookie(process.env.COOKIE_NAME, `Bearer ${token}`, {
        expires: expires,
      });

      return res
        .status(200)
        .json({ token, data: user, message: '로그인이 되었다.' });
    } catch (error) {
      next(error)
    }
  };
}

module.exports = UsersController;
