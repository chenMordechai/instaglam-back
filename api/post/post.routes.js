import express from 'express'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getPosts,getPostById, addPost,updatePost,  removePost} from './post.controller.js'

export const postRoutes = express.Router()

// middleware that is specific to this router

// work
postRoutes.get('/', log, getPosts)
// work
postRoutes.get('/:id', getPostById)
// work
postRoutes.post('/',requireAuth, addPost)
// work
postRoutes.put('/:id', updatePost)
// work
postRoutes.delete('/:id',  removePost)
// postRoutes.post('/', requireAuth, addPost)
// postRoutes.put('/:id', requireAdmin, updatePost)
// postRoutes.delete('/:id', requireAdmin, removePost)
