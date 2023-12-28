import express from 'express'
// import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getStories ,getStoryById ,addStory ,removeStory} from './story.controller.js'

export const storyRoutes = express.Router()

// middleware that is specific to this router

storyRoutes.get('/', log, getStories) 
storyRoutes.get('/:id', getStoryById)
storyRoutes.post('/', addStory)
storyRoutes.delete('/:id', removeStory)

// storyRoutes.post('/', requireAdmin, addStory)
// // storyRoutes.put('/:id', updateStory)
// storyRoutes.put('/:id', requireAdmin, updateStory)
// // storyRoutes.delete('/:id', requireAuth, removeStory)
// storyRoutes.delete('/:id', requireAdmin, removeStory)

// storyRoutes.post('/:id/msg', requireAuth, addStoryMsg)
// storyRoutes.delete('/:id/msg/:msgId', requireAuth, removeStoryMsg)