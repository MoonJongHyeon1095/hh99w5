const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware')

const PostsController = require('../controllers/posts.controller');
const postsController = new PostsController();

//좋아요 게시글 조회
router.get('/', authMiddleware, postsController.getPostLike)
//좋아요 등록 혹은 취소
router.put('/:postId', authMiddleware, postsController.updatePostLike)

module.exports = router;