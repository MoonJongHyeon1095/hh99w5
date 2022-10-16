const UserService = require('../service/users.service');
const Joi = require('joi');

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
    createUser = async (req, res, next) => {
        
        const { nickname, password, confirm } = await userSchema.validateAsync(req.body);   
       
        // 서비스 계층에 구현된 createUser 로직을 실행합니다.
        const createUserData = await this.userService.createUser(
          nickname,
          password,
        );
        res
          .status(201)
          .json({ data: createUserData, message: '회원으로 가입되었다.' });
      };

    //login  
    findUser = async (req, res, next) => {
        const { nickname, password } = await loginSchema.validateAsync(req.body);

        const findUserData = await this.userService.findUser(nickname, password) 

        if (!findUserData) {
            return res.status(412).send({
              errorMessage: '닉네임 또는 패스워드를 확인해주세요.',
            });
          }

        res.status(200).json({data: findUserData, message: '로그인이 되었다.'})
    }  
}

module.exports = UsersController;
