const { ValidationError } = require('../exceptions/index.exception');
const CommentRepository = require('../repositories/Comments.repository');

class CommentService {
  commentRepository = new CommentRepository();

  createComment = async (postId, userId, nickname, comment) => {
    const createCommentData = await this.commentRepository.createComment(
      postId,
      userId,
      nickname,
      comment,
    );

    console.log(createCommentData);
    return {
      commentId: createCommentData.commentId,
      postId: createCommentData.postId,
      userId: createCommentData.userId,
      nickname: createCommentData.nickname,
      comment: createCommentData.comment,
      createdAt: createCommentData.createdAt,
      updatedAt: createCommentData.updatedAt,
    };
  };

  getComment = async (postId) => {
    const comments = await this.commentRepository.getComment(postId);

    comments.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return comments.map((comment) => {
      return {
        commentId: comment.commentId,
        postId: comment.postId,
        userId: comment.userId,
        nickname: comment.nickname,
        comment: comment.comment,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      };
    });
  };

  updateComment = async (commentId, comment, userId) => {
    
    const isExistComment = await this.commentRepository.findCommentById(commentId);
    
    if (!isExistComment) throw new ValidationError('그런 댓글이 없어....');

    const updatedComment = await this.commentRepository.updateComment(
      userId,
      commentId,
      comment
    );
    if (!updatedComment) throw new new ValidationError('너가 쓴 댓글이 아닐 거 같은데?');

    return {
      commentId: updatedComment.commentId,
      postId: updatedComment.postId,
      userId: updatedComment.userId,
      nickname: updatedComment.nickname,
      comment: updatedComment.comment,
      createdAt: updatedComment.createdAt,
      updatedAt: updatedComment.updatedAt,
    };
  };

  deleteComment = async (commentId, userId) => {
    const isExist = await this.commentRepository.findCommentById(commentId);
    if (!isExist) throw new ValidationError('그런 댓글이 없어....');

    const deletedComment = await this.commentRepository.deleteComment(
      commentId,
      userId
    );
    if (!deletedComment) throw new ValidationError('너가 쓴 댓글 아닌듯?');

    return {
      commentId: deletedComment.commentId,
      postId: deletedComment.postId,
      userId: deletedComment.userId,
      nickname: deletedComment.nickname,
      comment: deletedComment.comment,
      createdAt: deletedComment.createdAt,
      updatedAt: deletedComment.updatedAt,
    };
  };
}

module.exports = CommentService;
