import express from 'express'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getMsgById, addMsg, getMsgs } from './msg.controller.js'

export const msgRoutes = express.Router()

// middleware that is specific to this router

msgRoutes.get('/', getMsgs)
msgRoutes.get('/:id', getMsgById)
msgRoutes.post('/', requireAuth, addMsg)
