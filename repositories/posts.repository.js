const { Post } = require('../models');

class PostRepository {
  //게시글목록조회 : 토큰필요 없음.
  findAllPost = async () => {
    const posts = await Post.findAll({
      //order: [['createdAt', 'DESC']] 이런 것도 ORM에 따라 다르잖아. 걍 떼어내서 service 단계로 넘기자.
    });
    return posts;
  };

  //게시글 상세 조회 : 토큰필요 없음.
  findPostById = async (postId) => {
    const post = await Post.findByPk(postId);

    return post;
  };

  //게시물 생성 : 토큰 필요
  createPost = async (userId, nickname, title, content) => {
    const createPostData = await Post.create({
      userId,
      nickname,
      title,
      content,
    });

    return createPostData;
  };

  //게시물 수정 : 토큰 필요
  updatePost = async (postId, userId, title, content) => {
    const updatePostData = await Post.update(
      { title, content },
      { where: { postId, userId } }
    );

    return updatePostData;
  };

  //게시물 삭제 : 토큰 필요
  deletePost = async (postId, userId) => {
    const updatePostData = await Post.destroy({ where: { postId, userId } });

    return updatePostData;
  };
}

module.exports = PostRepository;