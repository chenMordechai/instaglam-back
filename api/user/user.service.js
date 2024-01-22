import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'

import mongodb from 'mongodb'
import { postService } from '../post/post.service.js'
import { socketService } from '../../services/socket.service.js'

const { ObjectId } = mongodb

export const userService = {
    query,
    getById,
    getByUsername,
    update,
    updateImg,
    updatePost,
    remove,
    removePost,
    add,
    addFollowing,
    removeFollowing,
    addNotificationPost,
    addNotificationUser,
    updateUserNotification
}

async function query(filterBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('user')
        // var users = await collection.find().toArray()
        var users = await collection.find(criteria).toArray()
        users = users.map(user => {
            delete user.password
            // Returning fake fresh data
            // user.createdAt = Date.now() - (1000 * 60 * 60 * 24 * 3) // 3 days ago
            return user
        })
        return users
    } catch (err) {
        logger.error('cannot find users', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
        criteria.$or = [
            {
                username: txtCriteria
            },
            {
                fullname: txtCriteria
            }
        ]
    }
    // if (filterBy.minBalance) {
    //     criteria.balance = { $gte: filterBy.minBalance }
    // }
    return criteria
}

async function getById(userId) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ _id: new ObjectId(userId) })
        delete user.password
        return user
    } catch (err) {
        logger.error(`while finding user ${userId}`, err)
        throw err
    }
}

async function getByUsername(username) {
    try {
        const collection = await dbService.getCollection('user')
        const user = await collection.findOne({ username })
        return user
    } catch (err) {
        logger.error(`while finding user ${username}`, err)
        throw err
    }
}

async function remove(userId) {
    try {
        const collection = await dbService.getCollection('user')
        await collection.deleteOne({ _id: new ObjectId(userId) })
    } catch (err) {
        logger.error(`cannot remove user ${userId}`, err)
        throw err
    }
}

async function update(user) {
    try {
        // peek only updatable fields!
        // const {_id,userName}
        const userToSave = {
            _id: new ObjectId(user._id),
            username: user.username,
            fullname: user.fullname,
            imgUrl: user.imgUrl,
            bio: user.bio
        }
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ _id: userToSave._id }, { $set: userToSave })
        return userToSave
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function updatePost(postMini, userId) {

    try {

        const collection = await dbService.getCollection('user')
        await collection.updateOne({ _id: new ObjectId(userId) }, { $push: { postsMini: postMini } })

        return postMini
    } catch (err) {
        logger.error(`cannot update user ${userId}`, err)
        throw err
    }
}

async function removePost(postMiniId, userId) {

    try {
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ _id: new ObjectId(userId) }, { $pull: { postsMini: { _id: new ObjectId(postMiniId) } } })
        return postMiniId
    } catch (err) {
        logger.error(`cannot update user ${userId}`, err)
        throw err
    }
}

async function updateImg(user) {
    try {
        // peek only updatable fields!
        const userToSave = {
            _id: new ObjectId(user._id),
            imgUrl: user.imgUrl
        }
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ _id: userToSave._id }, { $set: { imgUrl: userToSave.imgUrl } })


        return userToSave
    } catch (err) {
        logger.error(`cannot update user ${user._id}`, err)
        throw err
    }
}

async function add(user) {
    try {
        // Validate that there are no such user:
        const existUser = await getByUsername(user.username)
        if (existUser) throw new Error('Username taken')

        // peek only updatable fields!
        const userToAdd = {
            username: user.username,
            password: user.password,
            fullname: user.fullname,
            email: user.email,
            imgUrl: 'https://res.cloudinary.com/dnluclrao/image/upload/t_square/v1704182274/user_afklid.jpg',
            createdAt: Date.now(),
            following: [],
            followers: [],
            savedPostsMini: [],
            postsMini: [],
            tagedPostsMini: [],
            highlights: [{
                _id: 'h101',
                name: 'travel',
                imgUrl: 'https://res.cloudinary.com/dnluclrao/image/upload/v1705417530/4_kvlqwr_square_pj0sey.png',
                imgs: []
            },
            {
                _id: 'h102',
                name: 'friend',
                imgUrl: 'https://res.cloudinary.com/dnluclrao/image/upload/v1705417568/3_ktgblo_square_o6fhfx.png',
                imgs: []
            },
            {
                _id: 'h103',
                name: 'family',
                imgUrl: 'https://res.cloudinary.com/dnluclrao/image/upload/v1705417599/2_crpq3m_square_hcqyt1.png',
                imgs: []
            },
            {
                _id: 'h104',
                name: 'working',
                imgUrl: 'https://res.cloudinary.com/dnluclrao/image/upload/v1705417426/6_ssoiua_square_phgkeq.png',
                imgs: []
            },
            {
                _id: 'h105',
                name: 'workout',
                imgUrl: 'https://res.cloudinary.com/dnluclrao/image/upload/v1705417488/5_w0naxv_square_ho4hwf.png',
                imgs: []
            },
            {
                _id: 'h106',
                name: 'my story',
                imgUrl: 'https://res.cloudinary.com/dnluclrao/image/upload/v1705417700/1_v6nok7_square_rlmco8.png',
                imgs: []
            }],
            stories: [],
            bio: '',
            notifications: []
        }
        const collection = await dbService.getCollection('user')
        await collection.insertOne(userToAdd)
        return userToAdd
    } catch (err) {
        logger.error('cannot insert user', err)
        throw err
    }
}

async function addFollowing(loggedinUser, miniUser) {
    try {
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ _id: loggedinUser._id }, { $push: { following: miniUser } })
        await collection.updateOne({ _id: miniUser._id }, { $push: { followers: loggedinUser } })
        return miniUser
    } catch (err) {
        logger.error(`cannot add like post ${postId}`, err)
        throw err
    }
}

async function removeFollowing(loggedinUserId, userId) {
    try {
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ _id: loggedinUserId }, { $pull: { following: { _id: userId } } })
        await collection.updateOne({ _id: userId }, { $pull: { followers: { _id: loggedinUserId } } })
        return userId
    } catch (err) {
        logger.error(`cannot add like post ${postId}`, err)
        throw err
    }
}

async function addNotificationPost(notification, postId) {
    try {
        const post = await postService.getById(postId)
        const userId = post.by._id

        notification.postImgUrl = post.imgUrl
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ _id: new ObjectId(userId) }, { $push: { notifications: notification } })

        socketService.emitToUser({ type: 'notification-added', userId })

        return notification
    } catch (err) {
        logger.error(`cannot add notification post ${postId}`, err)
        throw err
    }

}

async function addNotificationUser(notification, userId, postId) {
    try {
        if (postId) {
            const post = await postService.getById(postId)
            notification.postImgUrl = post.imgUrl
        }

        const collection = await dbService.getCollection('user')
        await collection.updateOne({ _id: new ObjectId(userId) }, { $push: { notifications: notification } })

        socketService.emitToUser({ type: 'notification-added', userId })


        return notification
    } catch (err) {
        logger.error(`cannot add like post ${postId}`, err)
        throw err
    }

}

async function updateUserNotification(userId) { // seen => true
    try {
        const collection = await dbService.getCollection('user')
        await collection.updateOne({ _id: new ObjectId(userId) }, { $set: { 'notifications.$[elem].seen': true } }, { 'arrayFilters': [{ 'elem.seen': false }], 'multi': true })

        return userId
    } catch (err) {
        logger.error(`cannot update user ${userId}`, err)
        throw err
    }
}
