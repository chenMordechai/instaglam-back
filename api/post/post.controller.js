import { postService } from './post.service.js'
import { userService } from '../user/user.service.js'
import { logger } from '../../services/logger.service.js'
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
        console.log('postId:', postId)
        const post = await postService.getById(postId)
        res.json(post)
    } catch (err) {
        logger.error('Failed to get post', err)
        res.status(500).send({ err: 'Failed to get post' })
    }
}

export async function addPost(req, res) {
    const { loggedinUser } = req
    console.log('loggedinUser:', loggedinUser)
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

        // prepare the updated post for sending out
        // addedPost.aboutToy = await toyService.getById(post.aboutToyId)

        // Give the user credit for adding a post
        // var user = await userService.getById(post.byUserId)
        // user.score += 10
        // loggedinUser.score += 10
        // loggedinUser = await userService.update(loggedinUser)
        // post.byUser = loggedinUser
        // User info is saved also in the login-token, update it
        // const loginToken = authService.getLoginToken(loggedinUser)
        // res.cookie('loginToken', loginToken)
        // delete post.aboutToyId
        // delete post.byUserId


        res.json(addedPost)
    } catch (err) {
        logger.error('Failed to add post', err)
        res.status(500).send({ err: 'Failed to add post' })
    }
}

export async function updatePost(req, res) {
    // const { loggedinUser } = req

    console.log('updatePost')
    try {

        const post = req.body
        console.log('post:', post)
        const updatedStory = await postService.update(post)
        // socketService.broadcast({ type: 'story-updated', data: updatedStory, userId: loggedinUser._id })
        res.json(updatedStory)
    } catch (err) {
        logger.error('Failed to update post', err)
        res.status(500).send({ err: 'Failed to update post' })
    }
}

export async function removePost(req, res) {
    try {
        const postId = req.params.id
        await postService.remove(postId)
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to remove post', err)
        res.status(500).send({ err: 'Failed to remove post' })
    }
}

export async function addLikePost(req, res) {
    console.log('addLikePost:')
    const { loggedinUser } = req
    console.log('loggedin user:', loggedinUser)
    // const { _id, fullname } = loggedinUser
    try {
        const postId = req.params.id
        const likedBy = { ...loggedinUser }
        likedBy._id = new ObjectId(likedBy._id)
        const likedByPost = await postService.addLikePost(postId, likedBy)
        console.log('likedByPost:', likedByPost)
        res.json(likedByPost)
    } catch (err) {
        logger.error('Failed to add Like Post', err)
        res.status(500).send({ err: 'Failed to add Like Post' })
    }
}

export async function removeLikePost(req, res) {
    // const { loggedinUser } = req
    try {
        const postId = req.params.id
        console.log('req.params:', req.params)
        const { likeById } = req.params

        const removedId = await postService.removeLikePost(postId, likeById)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove like post', err)
        res.status(500).send({ err: 'Failed to remove like post' })
    }
}


