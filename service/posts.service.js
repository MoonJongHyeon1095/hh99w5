const { ValidationError, InvalidParamsError } = require('../exceptions/index.exception');
const PostRepository = require('../repositories/posts.repository');

class PostService {
  postRepository = new PostRepository();

  //게시글목록조회 : 토큰필요 없음. //비었으면 빈 값 반환
  findAllPost = async () => {
    const allPost = await this.postRepository.findAllPost();

    allPost.sort((a, b) => {
      return b.likes - a.likes;
    });

    return allPost.map((post) => {
      return {
        postId: post.postId,
        userId: post.userId,
        nickname: post.nickname,
        title: post.title,
        likes: post.likes,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    });
  };

  //게시글 상세 조회 : 토큰필요 없음.
  findPostById = async (postId) => {
    const findPost = await this.postRepository.findPostById(postId);
    if (!findPost) throw new InvalidParamsError('게시글이 존재하지 않는데요.');

    return {
      postId: findPost.postId,
      userId: findPost.userId,
      nickname: findPost.nickname,
      title: findPost.title,
      content: findPost.content,
      likes: findPost.likes,
      createdAt: findPost.createdAt,
      updatedAt: findPost.updatedAt,
    };
  };

  //게시물 생성 : 토큰 필요
  createPost = async (userId, nickname, title, content) => {
    const createPostData = await this.postRepository.createPost(
      userId,
      nickname,
      title,
      content
    );

    console.log(createPostData);
    return {
      postId: createPostData.postId,
      userId: createPostData.userId,
      nickname: createPostData.nickname,
      title: createPostData.title,
      content: createPostData.content,
      createdAt: createPostData.createdAt,
      updatedAt: createPostData.updatedAt,
    };
  };

  updatePost = async (postId, userId, title, content) => {
    const findPost = await this.postRepository.findPostById(postId);
    if (!findPost) throw new InvalidParamsError('게시글이 존재하지 않는데요.');

    await this.postRepository.updatePost(postId, userId, title, content);

    const updatePost = await this.postRepository.findPostById(postId);

    return {
      postId: updatePost.postId,
      userId: updatePost.userId,
      nickname: updatePost.nickname,
      title: updatePost.title,
      content: updatePost.content,
      likes: updatePost.likes,
      createdAt: updatePost.createdAt,
      updatedAt: updatePost.updatedAt,
    };
  };

  deletePost = async (postId, userId) => {
    const findPost = await this.postRepository.findPostById(postId);
    if (!findPost) throw new InvalidParamsError('게시글이 존하지 않는데요.');

    await this.postRepository.deletePost(postId, userId);

    return {
      postId: findPost.postId,
      userId: findPost.userId,
      nickname: findPost.nickname,
      title: findPost.title,
      content: findPost.content,
      likes: findPost.likes,
      createdAt: findPost.createdAt,
      updatedAt: findPost.updatedAt,
    };
  };

  //좋아요 게시글 조회
  getPostLike = async (userId ) => {
    const Likes = await this.postRepository.getPostLike({userId});
    console.log(Likes)

    let likeList = [];
    for( const like of Likes ){
      likeList.push({ Post : like.Post })
    }
    console.log(likeList)

    return likeList.sort((a, b) => {
      return b.likes - a.likes;
    });

    // return likeList.map((Like) => {
    //   return {
    //     postId: Like.postId,
    //     userId: Like.userId,
    //     nickname: Like.nickname,
    //     title: Like.title,
    //     likes: Like.likes,
    //     createdAt: Like.createdAt,
    //     updatedAt: Like.updatedAt,
    //   };
    // });
  };

  updatePostLike = async (userId, postId) => {
    const findPost = await this.postRepository.findPostById(postId);
    if (!findPost) throw new InvalidParamsError('게시글이 존하지 않는데요.');

    const isLike = await this.postRepository.findPostLike({ userId, postId });
    if (!isLike) {
      const LikeData = await this.postRepository.createPostLike({userId, postId});
      console.log(LikeData);
      return {
        postId: LikeData.postId,
        userId: LikeData.userId,
        nickname: LikeData.nickname,
        title: LikeData.title,
        likes: LikeData.likes,
      };
    } else if (isLike) {
      const LikeData = await this.postRepository.deletePostLike({
        userId,
        postId,
      });

      console.log(LikeData);
      return {
        postId: LikeData.postId,
        userId: LikeData.userId,
        nickname: LikeData.nickname,
        title: LikeData.title,
        likes: LikeData.likes,
      };
    } else {
      throw new ValidationError('싫어요');
    }
  };
}

module.exports = PostService;
