import mongodb from 'mongodb'
const { ObjectId } = mongodb

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

export const postService = {
    query,
    getById,
    add,
    update,
    remove
}

async function query(filterBy = {}, sortBy = {}) {
    try {
        // const criteria = _buildCriteria(filterBy)
        // const sort = {}
        // if (sortBy.type) {
        //     sort = {
        //         [sortBy.type]: sortBy.desc
        //     }
        // }
        const collection = await dbService.getCollection('post')
        var posts = await collection.find().toArray()
        // var posts = await collection.find(criteria).sort(sort).toArray()
        // console.log('posts:', posts)
        // var posts = await collection.aggregate([
        //     {
        //         $match: criteria
        //     },
        //     {
        //         $lookup:
        //         {
        //             localField: 'byUserId',
        //             from: 'post',
        //             foreignField: '_id',
        //             as: 'byUser'
        //         }
        //     },
        //     {
        //         $unwind: '$byUser'
        //     },
        //     {
        //         $lookup:
        //         {
        //             localField: 'aboutToyId',
        //             from: 'toy',
        //             foreignField: '_id',
        //             as: 'aboutToy'
        //         }
        //     },
        //     {
        //         $unwind: '$aboutToy'
        //     }
        // ]).toArray()
        // posts = posts.map(post => {
        //     post.byUser = { _id: post.byUser._id, fullname: post.byUser.fullname }
        //     post.aboutToy = { _id: post.aboutToy._id, name: post.aboutToy.name, imgUrl: post.aboutToy.imgUrl }
        //     delete post.byUserId
        //     delete post.aboutToyId
        //     return post
        // })
        return posts

    } catch (err) {
        logger.error('cannot find posts', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        criteria.txt = { $regex: filterBy.txt, $options: 'i' }
    }
    if (filterBy.aboutToyId) {
        criteria.aboutToyId = new ObjectId(filterBy.aboutToyId)
    }
    if (filterBy.byUserId) {
        criteria.byUserId = new ObjectId(filterBy.byUserId)
    }
    return criteria
}

async function getById(postId) {
    console.log('getById', postId)
    try {
        const collection = await dbService.getCollection('post')
        const post = await collection.findOne({ _id: postId })
        // const post = await collection.findOne({ _id: new ObjectId(postId) })
        console.log('post:', post)
        return post
        // var posts = await collection.aggregate([
        //     {
        //         $match: { _id: new ObjectId(postId) }
        //     },
        //     {
        //         $lookup:
        //         {
        //             localField: 'byUserId',
        //             from: 'post',
        //             foreignField: '_id',
        //             as: 'byUser'
        //         }
        //     },
            // {
            //     $unwind: '$byUser'
            // },
            // {
            //     $lookup:
            //     {
            //         localField: 'aboutToyId',
            //         from: 'toy',
            //         foreignField: '_id',
            //         as: 'aboutToy'
            //     }
            // },
            // {
            //     $unwind: '$aboutToy'
            // }
        // ]).toArray()
        // console.log('posts:', posts)
        // posts = posts.map(post => {
        //     post.byUser = { _id: post.byUser._id, fullname: post.byUser.fullname }
        //     post.aboutToy = { _id: post.aboutToy._id, name: post.aboutToy.name, imgUrl: post.aboutToy.imgUrl }
        //     delete post.byUserId
        //     delete post.aboutToyId
        //     return post
        // })
        // console.log('posts[0]:', posts[0])
        // return posts[0]
    } catch (err) {
        logger.error(`while finding toy ${postId}`, err)
        throw err
    }
}

async function add(post) {
    console.log('add')
    console.log('post:', post)
    try {
        const postToAdd = {...post }
        postToAdd.by._id = new ObjectId(postToAdd.by._id)
        // const postToAdd = {
        //     byUserId: new ObjectId(post.byUserId),
        //     aboutToyId: new ObjectId(post.aboutToyId),
        //     txt: post.txt
        // }
        const collection = await dbService.getCollection('post')
        await collection.insertOne(post)
        return post
    } catch (err) {
        logger.error('cannot insert post', err)
        throw err
    }
}

async function update(post) {
    console.log('update')
    try {
        // peek only updatable fields!
        const postToSave = {
            _id: new ObjectId(post._id),
            name: post.name,
        }
        const collection = await dbService.getCollection('post')
        await collection.updateOne({ _id: postToSave._id }, { $set: postToSave })
        return postToSave
    } catch (err) {
        logger.error(`cannot update post ${post._id}`, err)
        throw err
    }
}

async function remove(postId) {
    try {
        const collection = await dbService.getCollection('post')
        await collection.deleteOne({ _id: new ObjectId(postId) })
    } catch (err) {
        logger.error(`cannot remove post ${postId}`, err)
        throw err
    }
}


