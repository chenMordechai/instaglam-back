import mongodb from 'mongodb'
const { ObjectId } = mongodb
import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'

export const msgService = {

    getById,
    add,

}

async function getById(msgId) {
    console.log('getById')
    try {
        const collection = await dbService.getCollection('msg')
        const msg = await collection.findOne({ _id: new ObjectId(msgId) })
        return msg

    } catch (err) {
        logger.error(`while finding toy ${msgId}`, err)
        throw err
    }
}

async function add(msg) {
    console.log('add')
    // try {
    //     const postToAdd = { ...post }
    //     postToAdd.by._id = new ObjectId(postToAdd.by._id)
    //     // const postToAdd = {
    //     //     byUserId: new ObjectId(post.byUserId),
    //     //     aboutToyId: new ObjectId(post.aboutToyId),
    //     //     txt: post.txt
    //     // }
    //     const collection = await dbService.getCollection('post')
    //     await collection.insertOne(post)
    //     return post
    // } catch (err) {
    //     logger.error('cannot insert post', err)
    //     throw err
    // }
}
