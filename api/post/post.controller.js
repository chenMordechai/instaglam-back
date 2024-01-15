import { postService } from './post.service.js'
import { userService } from '../user/user.service.js'
import { logger } from '../../services/logger.service.js'
import { log } from '../../middlewares/logger.middleware.js'
import { utilService } from '../../services/util.service.js'
import mongodb from 'mongodb'
const { ObjectId } = mongodb

export async function getPosts(req, res) {
    try {
        // const { txt, aboutToyId, byUserId } = req.query
        // const filterBy = { txt, aboutToyId, byUserId }
        // const sortBy = {}

        // logger.debug('Getting Posts', filterBy, sortBy)
        // const posts = await postService.query(filterBy, sortBy)
        const posts = await postService.query()
        res.json(posts)
    } catch (err) {
        logger.error('Failed to get posts', err)
        res.status(500).send({ err: 'Failed to get posts' })
    }
}

export async function getPostById(req, res) {
    try {
        const postId = req.params.id
        const post = await postService.getById(postId)
        res.json(post)
    } catch (err) {
        logger.error('Failed to get post', err)
        res.status(500).send({ err: 'Failed to get post' })
    }
}

export async function addPost(req, res) {
    const { loggedinUser } = req
    try {
        const post = req.body
        // // post.byUserId = '656c29766b05f4baadc8ca9d'
        post.by = loggedinUser
        post.createdAt = Date.now()
        const addedPost = await postService.add(post)

        const postMini = {
            commentCount: post.commentCount,
            imgUrl: post.imgUrl,
            likeCount: post.likeCount,
            _id: new ObjectId(addedPost._id),
            imgFilter: post.imgFilter
        }
        const updatedUser = await userService.updatePost(postMini, post.by._id)

        res.json(addedPost)
    } catch (err) {
        logger.error('Failed to add post', err)
        res.status(500).send({ err: 'Failed to add post' })
    }
}

export async function updatePost(req, res) {
    try {

        const post = req.body
        const updatedStory = await postService.update(post)
        // socketService.broadcast({ type: 'story-updated', data: updatedStory, userId: loggedinUser._id })
        res.json(updatedStory)
    } catch (err) {
        logger.error('Failed to update post', err)
        res.status(500).send({ err: 'Failed to update post' })
    }
}

export async function removePost(req, res) {
    const { loggedinUser } = req
    try {
        const userId = loggedinUser._id
        const postId = req.params.id
        await postService.remove(postId)
        const updatedUser = await userService.removePost(postId, userId)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to remove post', err)
        res.status(500).send({ err: 'Failed to remove post' })
    }
}

export async function addLikePost(req, res) {
    const { loggedinUser } = req
    try {
        const postId = req.params.id
        const likedBy = { ...loggedinUser }
        likedBy._id = new ObjectId(likedBy._id)
        const likedByPost = await postService.addLikePost(postId, likedBy)

        const notification = {
            miniUser: likedBy,
            action: 'liked your post:',
            postImgUrl: '',
            timeStamp: Date.now(),
        }
        await userService.addNotificationPost(notification, postId)

        res.json(likedByPost)
    } catch (err) {
        logger.error('Failed to add Like Post', err)
        res.status(500).send({ err: 'Failed to add Like Post' })
    }
}

export async function removeLikePost(req, res) {
    try {
        const postId = req.params.id
        const { likeById } = req.params

        const removedId = await postService.removeLikePost(postId, likeById)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove like post', err)
        res.status(500).send({ err: 'Failed to remove like post' })
    }
}

export async function addComment(req, res) {
    const { loggedinUser } = req
    try {
        const postId = req.params.id
        const commentBy = { ...loggedinUser }
        commentBy._id = new ObjectId(commentBy._id)
        const comment = {
            _id: utilService.makeId(),
            txt: req.body.txt,
            by: commentBy,
            createdAt: Date.now(),
            likedBy: []
        }

        const addedComment = await postService.addComment(postId, comment)

        const notification = {
            miniUser: commentBy,
            action: 'commented:',
            postImgUrl: '',
            comment: comment.txt,
            timeStamp: Date.now(),
        }
        await userService.addNotificationPost(notification, postId)

        res.json(addedComment)
    } catch (err) {
        logger.error('Failed to add Comment Post', err)
        res.status(500).send({ err: 'Failed to add Comment Post' })
    }
}

export async function removeComment(req, res) {
    try {
        const postId = req.params.id
        const { commentId } = req.params

        const removedId = await postService.removeComment(postId, commentId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove like post', err)
        res.status(500).send({ err: 'Failed to remove like post' })
    }
}

export async function addLikeComment(req, res) {
    const { loggedinUser } = req
    try {
        const postId = req.params.id
        const { commentId } = req.params
        const likedBy = { ...loggedinUser }
        likedBy._id = new ObjectId(likedBy._id)

        const likedByPost = await postService.addLikeComment(postId, commentId, likedBy)
        // console.log('req.body:', req.body)
        const notification = {
            miniUser: likedBy,
            action: 'liked your comment:',
            postImgUrl: '',
            comment: req.body.txt,
            timeStamp: Date.now(),
        }
        const userId = req.body.by._id
        await userService.addNotificationUser(notification, userId, postId)

        res.json(likedByPost)
    } catch (err) {
        logger.error('Failed to add Like Post', err)
        res.status(500).send({ err: 'Failed to add Like Post' })
    }
}

export async function removeLikeComment(req, res) {
    try {
        const postId = req.params.id
        const { commentId } = req.params
        const { likeById } = req.params

        const removedId = await postService.removeLikeComment(postId, commentId, likeById)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove like post', err)
        res.status(500).send({ err: 'Failed to remove like post' })
    }
}



