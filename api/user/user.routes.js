import express from 'express'

// import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { getUser, getUsers, deleteUser, updateUser , updateUserImg } from './user.controller.js'

export const userRoutes = express.Router()

// middleware that is specific to this router
// userRoutes.use(requireAuth)

// work
userRoutes.get('/', getUsers)
// work
userRoutes.get('/:id', getUser)
// work
userRoutes.put('/:id/img',  updateUserImg)
// userRoutes.put('/:id/img',requireAuth,  updateUserImg)
userRoutes.put('/:id',  updateUser)

// toyRoutes.delete('/:id/img/:imgId', requireAuth, removeToyMsg)
// work
userRoutes.delete('/:id',  deleteUser)

// userRoutes.put('/:id',  requireAuth, updateUser)
// userRoutes.delete('/:id',  requireAuth, requireAdmin, deleteUser)
