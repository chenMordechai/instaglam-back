import { msgService } from './msg.service.js'
import { logger } from '../../services/logger.service.js'

import mongodb from 'mongodb'
const { ObjectId } = mongodb

export async function getMsgById(req, res) {
    console.log('getMsgById')
    try {
        const msgId = req.params.id
        const msg = await msgService.getById(msgId)
        res.json(msg)
    } catch (err) {
        logger.error('Failed to get msg', err)
        res.status(500).send({ err: 'Failed to get msg' })
    }
}

export async function addMsg(req, res) {
    console.log('addMsg')
    // const { loggedinUser } = req
    // try {
    //     const post = req.body
    //     post.by = loggedinUser
    //     post.createdAt = Date.now()
    //     const addedPost = await postService.add(post)

    //     if (post.type.includes('image')) {

    //         const postMini = {
    //             commentCount: post.commentCount,
    //             imgUrl: post.imgUrl,
    //             likeCount: post.likeCount,
    //             _id: new ObjectId(addedPost._id),
    //             type: post.type,
    //             url: post.url,

    //         }
    //         const updatedUser = await userService.updatePost(postMini, post.by._id)
    //     }

    //     socketService.broadcast({ type: 'post-added', data: addedPost, userId: loggedinUser._id })

    //     res.json(addedPost)
    // } catch (err) {
    //     logger.error('Failed to add post', err)
    //     res.status(500).send({ err: 'Failed to add post' })
    // }
}
