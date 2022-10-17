const UserService = require('../service/users.service');
const joi = require('../util/joi');
const jwt = require('jsonwebtoken');

class UsersController {
  userService = new UserService();

  //sign up
  signup = async (req, res) => {
    try {
      const { nickname, password, confirm } =
        await joi.signupSchema.validateAsync(req.body);

      if (password !== confirm)
        throw new Error('비밀번호가 확인란과 일치하지 않습니다.');

      if (password.includes(nickname) || nickname.includes(password))
        throw new Error(
          '그런 닉네임, 패스워드로 되겠습니까? 좀 똑바로 지어보세요. 서로 포함되잖아요.'
        );

      // 서비스 계층에 구현된 createUser 로직을 실행합니다.
      const createUserData = await this.userService.createUser(
        nickname,
        password
      );
      res
        .status(201)
        .json({ data: createUserData, message: '회원으로 가입되었다.' });
    } catch (error) {
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      return res.status(400).send({ errorMessage: error.message });
    }
  };

  //login
  login = async (req, res) => {
    try {
      const { nickname, password } = await joi.loginSchema.validateAsync(
        req.body
      );

      const user = await this.userService.findUser(nickname, password);
      console.log(user)
      
      if (!user) {
        res.status(412).send({
          errorMessage: '닉네임 또는 패스워드를 확인해주세요.',
        });
        return;
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
      console.log(`${req.method} ${req.originalUrl} : ${error.message}`);
      return res.status(400).send({ errorMessage: error.message });
    }
  };
}

module.exports = UsersController;
