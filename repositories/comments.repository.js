const { Comment } = require('../models');

class CommentRepository {
  createComment = async (postId, userId, nickname, comment) => {
    const createCommentData = await Comment.create({
      postId,
      userId,
      nickname,
      comment,
    });
    return createCommentData;
  };

  getComment = async (postId) => {
    const comments = await Comment.findAll({
      where: {
        postId,
      },
      // order: [['createdAt', 'desc']],
    });

    return comments;
  };

  updateComment = async (userId, commentId, comment) => {
    const updatedComment = await Comment.update(
      { comment },
      { where: { commentId, userId } }
    );
    return updatedComment;
  };

  deleteComment = async (commentId, userId) => {
    const deletedComment = await Comment.destroy({
      where: { commentId, userId },
    });
    return deletedComment;
  };

  findCommentById = async (commentId) => {
    const isExistComment = await Comment.findByPk(commentId);
    return isExistComment;
  };
}

module.exports = CommentRepository;
