import express from 'express'

import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { getUser, getUsers, deleteUser, updateUser, updateUserImg, addFollowing, removeFollowing } from './user.controller.js'

export const userRoutes = express.Router()

// middleware that is specific to this router
// userRoutes.use(requireAuth)

userRoutes.get('/', getUsers)
userRoutes.get('/:id', getUser)
userRoutes.put('/:id/img', updateUserImg)
// userRoutes.put('/:id/img',requireAuth,  updateUserImg)
userRoutes.put('/:id', updateUser)

// userRoutes.delete('/:id/img/:imgId', requireAuth, removeToyMsg)
userRoutes.delete('/:id', deleteUser)

userRoutes.post('/:id/following', requireAuth, addFollowing)
userRoutes.delete('/:id/following', requireAuth, removeFollowing)


// userRoutes.put('/:id',  requireAuth, updateUser)
// userRoutes.delete('/:id',  requireAuth, requireAdmin, deleteUser)
