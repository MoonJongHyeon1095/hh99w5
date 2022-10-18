const CommentService = require('../service/comments.service');
const joi = require('../util/joi');

class CommentsController {
  commentService = new CommentService();

  createComment = async (req, res, next) => {
    try {
      const { comment } = await joi.commentSchema.validateAsync(req.body);
      const { postId } = req.params;
      const { userId } = res.locals.user;
      const { nickname } = res.locals.user;
      console.log(userId);
      console.log(nickname);
      console.log(postId)
      console.log(comment)

      if (!userId || !comment || !postId) {
        throw new InvalidParamsError('뭐 하나 빼먹으셨는데?');
      }

      // 서비스 계층에 구현된 createComment 로직을 실행합니다.
      const createCommentData = await this.commentService.createComment(
        postId,
        userId,
        nickname,
        comment,
      );
      res
        .status(201)
        .json({ data: createCommentData, message: '댓글을 생성하였습니다.' });
    } catch (error) {
      next(error)
    }
  };

  getComment = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const comments = await this.commentService.getComment(postId);

      res.status(200).json({
        data: comments,
      });
    } catch (error) {
      next(error)
    }
  };

  updateComment = async (req, res) => {
    try {
      const { commentId } = req.params;
      const { comment } = await joi.commentSchema.validateAsync(req.body);
      const { userId } = res.locals.user;

      const updatedComment = await this.commentService.updateComment(
        commentId,
        comment,
        userId
      );

      res.status(200).json({
        data: updatedComment,
        message: '댓글 수정했어요.',
      });
    } catch (error) {
      next(error)
    }
  };
  
  deleteComment = async (req, res) => {
    try {
      const { commentId } = req.params;
      const { userId } = res.locals.user;

      const deletedComment = await this.commentService.deleteComment(
        commentId,
        userId
      );

      res.status(200).json({
        data: deletedComment,
        message: '댓글 삭제했어요.',
      });
    } catch (error) {
      next(error)
    }
  };
}

module.exports = CommentsController;
