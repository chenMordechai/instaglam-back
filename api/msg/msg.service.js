import mongodb from 'mongodb'
const { ObjectId } = mongodb
import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

export const msgService = {
    getById,
    addMsgToHistory,
    addMsg,

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

async function addMsg(msgInfo) {
    try {
        const msgInfoToAdd = { ...msgInfo }
        const collection = await dbService.getCollection('msg')
        await collection.insertOne(msgInfoToAdd)
        return msgInfoToAdd
    } catch (err) {
        logger.error('cannot insert post', err)
        throw err
    }
}



async function addMsgToHistory(newMsg, msgId) {
    try {
        newMsg._id = utilService.makeId()
        newMsg.createdAt = Date.now()
        console.log('newMsg:', newMsg)
        const collection = await dbService.getCollection('msg')
        await collection.updateOne({ _id: new ObjectId(msgId) }, { $push: { history: newMsg } })
        return newMsg
    } catch (err) {
        logger.error(`cannot add like post ${postId}`, err)
        throw err
    }
}