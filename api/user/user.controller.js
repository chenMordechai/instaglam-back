import { userService } from './user.service.js'
import { logger } from '../../services/logger.service.js'
import { authService } from '../auth/auth.service.js'
import mongodb from 'mongodb'
const { ObjectId } = mongodb

export async function getUsers(req, res) {
    try {
        const { txt } = req.query

        const filterBy = { txt }
        const users = await userService.query(filterBy)
        res.send(users)
    } catch (err) {
        logger.error('Failed to get users', err)
        res.status(500).send({ err: 'Failed to get users' })
    }
}

export async function getUser(req, res) {
    try {
        const user = await userService.getById(req.params.id)
        res.send(user)
    } catch (err) {
        logger.error('Failed to get user', err)
        res.status(500).send({ err: 'Failed to get user' })
    }
}

export async function updateUser(req, res) {
    try {
        const user = req.body
        const savedUser = await userService.update(user)
        res.send(savedUser)
    } catch (err) {
        logger.error('Failed to update user', err)
        res.status(500).send({ err: 'Failed to update user' })
    }
}

export async function updateUserImg(req, res) {
    console.log('updateUserImg')
    try {
        // const { loggedinUser } = req
        // console.log('loggedinUser:', loggedinUser)
        const user = req.body
        console.log('user:', user)
        const savedUser = await userService.updateImg(user)

        // update imgUrl of loggedinUser 
        const loggedinUser = authService.validateToken(req.cookies.loginToken)
        // console.log('loggedinUser:', loggedinUser)
        const newUser = {...loggedinUser,imgUrl:user.imgUrl}
        // console.log('newUser:', newUser)
        const loginToken = authService.getLoginToken(newUser)
        // res.cookie('loginToken', loginToken)

        res.send(savedUser)
    } catch (err) {
        logger.error('Failed to update user', err)
        res.status(500).send({ err: 'Failed to update user' })
    }
}

export async function deleteUser(req, res) {
    try {
        await userService.remove(req.params.id)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to delete user', err)
        res.status(500).send({ err: 'Failed to delete user' })
    }
}

export async function addFollowing(req, res) {
    const { loggedinUser } = req
    try {
        loggedinUser._id = new ObjectId(loggedinUser._id)
        const miniUser = req.body
        miniUser._id = new ObjectId(miniUser._id)

        const addedUser = await userService.addFollowing(loggedinUser, miniUser)

        const notification = {
            miniUser: loggedinUser,
            action: 'started following you.',
            timeStamp: Date.now(),
            button: 'txt',
            seen: false
        }
        const userId = req.params.id
        await userService.addNotificationUser(notification, userId)

        res.json(addedUser)
    } catch (err) {
        logger.error('Failed to add Following user', err)
        res.status(500).send({ err: 'Failed to add Following user' })
    }
}

export async function removeFollowing(req, res) {
    const { loggedinUser } = req
    try {
        loggedinUser._id = new ObjectId(loggedinUser._id)
        let userId = req.params.id
        userId = new ObjectId(userId)

        const addedUserId = await userService.removeFollowing(loggedinUser._id, userId)
        res.json(addedUserId)
    } catch (err) {
        logger.error('Failed to add remove Following user', err)
        res.status(500).send({ err: 'Failed to add remove Following user' })
    }
}

export async function updateUserNotification(req, res) {
    try {
        let userId = req.params.id
        const savedUser = await userService.updateUserNotification(userId)
        res.send(savedUser)
    } catch (err) {
        logger.error('Failed to update user', err)
        res.status(500).send({ err: 'Failed to update user' })
    }
}
