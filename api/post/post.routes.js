import express from 'express'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getPosts, getPostById, addPost, updatePost, removePost, addLikePost, removeLikePost, addComment ,removeComment,addLikeComment,removeLikeComment} from './post.controller.js'

export const postRoutes = express.Router()

// middleware that is specific to this router

// work
postRoutes.get('/', log, getPosts)
// work
postRoutes.get('/:id', getPostById)
// work
postRoutes.post('/', requireAuth, addPost)
// work
postRoutes.put('/:id', requireAuth, updatePost)
// work
postRoutes.delete('/:id', requireAuth, removePost)

postRoutes.post('/:id/like', requireAuth, addLikePost)
postRoutes.delete('/:id/like/:likeById', requireAuth, removeLikePost)

postRoutes.post('/:id/comment', requireAuth, addComment)
postRoutes.delete('/:id/comment/:commentId', requireAuth, removeComment)

postRoutes.post('/:id/comment/like/:commentId', requireAuth, addLikeComment)
postRoutes.delete('/:id/comment/like/:commentId/:likeById', requireAuth, removeLikeComment)