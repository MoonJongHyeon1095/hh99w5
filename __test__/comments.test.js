const CommentRepository = require('../repositories/Comments.repository');

jest.mock('../models/comment')
//const Comment = require('../models/comment');
const { test } = require('../config/config');

describe('createComment',()=>{
   
    test('POST /comments/:postId', async ()=>{
        expect(CommentRepository.createComment(1,1,"test","테스트"))
        .toStrictEqual({
            postId : 1,
            userId : 1,
            nickname : "test",
            comment : "테스트"
        })
        
    })
    
})