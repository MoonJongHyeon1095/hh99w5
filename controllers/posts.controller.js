const { InvalidParamsError } = require('../exceptions/index.exception');
const PostService = require('../service/posts.service');

class PostsController {
  postService = new PostService();

  //게시글목록조회 : 토큰필요 없음.
  getPosts = async (req, res, next) => {
    try {
      const posts = await this.postService.findAllPost();

      res.status(200).json({ data: posts });
    } catch (error) {
      next(error);
    }
  };

  //게시글상세조회 : 토큰필요없음.
  getPostById = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const post = await this.postService.findPostById(postId);

      res.status(200).json({ data: post });
    } catch (error) {
      next(error);
    }
  };

  //게시물 생성 : 토큰필요
  createPost = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { nickname } = res.locals.user;
      console.log(userId);
      console.log(nickname);
      const { title, content } = req.body;

      if (!userId || !title || !content) {
        // TODO: Joi를 사용하지 않음
        throw new InvalidParamsError('뭐 하나 빼먹으셨는데?');
      }

      // 서비스 계층에 구현된 createPost 로직을 실행합니다.
      const createPostData = await this.postService.createPost(
        userId,
        nickname,
        title,
        content
      );
      res
        .status(201)
        .json({ data: createPostData, message: '게시글을 생성하였습니다.' });
    } catch (error) {
      next(error);
    }
  };

  updatePost = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { userId } = res.locals.user;
      const { title, content } = req.body;

      if (!postId || !userId || !title || !content) {
        // TODO: Joi를 사용하지 않음
        throw new InvalidParamsError('뭐 하나 빼먹으셨는데?');
      }

      const updatePost = await this.postService.updatePost(
        postId,
        userId,
        title,
        content
      );
      res
        .status(200)
        .json({ data: updatePost, message: '게시글을 수정하였습니다.' });
    } catch (error) {
      next(error);
    }
  };

  deletePost = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { userId } = res.locals.user;

      const deletePost = await this.postService.deletePost(postId, userId);

      res
        .status(200)
        .json({ data: deletePost, message: '게시글을 삭제하였습니다.' });
    } catch (error) {
      next(error);
    }
  };

  //좋아요 게시글 조회 //없으면 빈 데이터를 반환해야 함.
  getPostLike = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;

      const Likes = await this.postService.getPostLike(userId, );

      res.status(200).json({ data: Likes });
    } catch (error) {
      next(error);
    }
  };

  //게시글 좋아요 등록 혹은 취소
  updatePostLike = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { userId } = res.locals.user;

      if (!postId) {
        // TODO: Joi를 사용하지 않음
        throw new InvalidParamsError('게시글이 존재하지 않습니다.');
      }

      const Likes = await this.postService.updatePostLike(userId, postId);

      res.status(200).json({ data: Likes });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = PostsController;
