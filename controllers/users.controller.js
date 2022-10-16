const UserService = require('../service/users.service');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const re_nickname = /^[a-zA-Z0-9]{3,10}$/;
const re_password = /^[a-zA-Z0-9]{4,30}$/;

const userSchema = Joi.object({
  nickname: Joi.string().pattern(re_nickname).required(),
  password: Joi.string().pattern(re_password).required(),
  confirm: Joi.string(),
});

const loginSchema = Joi.object({
  nickname: Joi.string().required(),
  password: Joi.string().required(),
});

class UsersController {
  userService = new UserService();

  //sign up
  signup = async (req, res) => {
    const { nickname, password, confirm } = await userSchema.validateAsync(
      req.body
    );

    if (password !== confirm) {
      res.status(412).send({
        errorMessage: '패스워드가 일치하지 않습니다.',
      });
      return;
    }

    // 서비스 계층에 구현된 createUser 로직을 실행합니다.
    const createUserData = await this.userService.createUser(
      nickname,
      password
    );
    res
      .status(201)
      .json({ data: createUserData, message: '회원으로 가입되었다.' });
  };

  //login
  login = async (req, res) => {
    const { nickname, password } = await loginSchema.validateAsync(req.body);

    const user = await this.userService.findUser(nickname, password);

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
  };
}

module.exports = UsersController;
