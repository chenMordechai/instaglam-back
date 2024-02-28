import express from 'express'

import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { getUser, getUsers, deleteUser, updateUserNotification, updateUser, updateUserImg, addFollowing, removeFollowing } from './user.controller.js'

export const userRoutes = express.Router()

userRoutes.get('/', getUsers)
userRoutes.get('/:id', getUser)
userRoutes.put('/:id/img',requireAuth, updateUserImg)
userRoutes.put('/:id', updateUser)

userRoutes.delete('/:id', deleteUser)

userRoutes.post('/:id/following', requireAuth, addFollowing)
userRoutes.delete('/:id/following', requireAuth, removeFollowing)

userRoutes.put('/:id/notification', updateUserNotification)
