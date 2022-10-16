const express = require('express');
const router = express.Router();

const CommentsController = require('../controllers/comments.controller');
const commentsController = new CommentsController();

router.get('/:postId', );
router.post('/:postId', );
router.put('/:commentId', );
router.delete('/:commentId', );

module.exports = router;
