import mongodb from 'mongodb'
const { ObjectId } = mongodb

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

export const storyService = {
    query,
    getById,
    add,
    remove,
    // update,
    // addStoryMsg,
    // removeStoryMsg,
    // addMsgToChat
}

// work
async function query(filterBy = {}, sortBy = {}) {
    console.log('query', sortBy)
    try {
        // const criteria = _buildCriteria(filterBy)
        // let sort = {}
        // if (sortBy.type) {
        //     sort = {
        //         [sortBy.type]: sortBy.desc
        //     }
        //     console.log('sort:', sort)
        // }
        const collection = await dbService.getCollection('story')
        // var stories = await collection.find(criteria, { sort }).toArray()
        var storyCursor = await collection.find()
        // var storyCursor = await collection.find(criteria).sort(sort)

        // paiging
        // if(filterBy.pageIndex !== undefined){
        //     storyCursor.skip(filterBy.pageIdx *PAGE_SIZE).limit(PAGE_SIZE)
        // }

        const stories = await storyCursor.toArray()
        // console.log('stories:', stories)
        return stories
    } catch (err) {
        logger.error('cannot find stories', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.name) {
        criteria.name = { $regex: filterBy.name, $options: 'i' }
    }
    if (filterBy.price) {
        criteria.price = { $lt: filterBy.price }
    }
    if (filterBy.inStock !== 'all') {
        criteria.inStock = (filterBy.inStock === 'inStock') ? true : false
    }
    if (filterBy.labels && filterBy.labels.length !== 0) {
        // $all - if every labels found
        criteria.labels = { $all: [...filterBy.labels] }
        // $in - if some of the labels found
        // criteria.labels = { $in: [...filterBy.labels] }
    }
    return criteria

}

// work
async function getById(storyId) {
    console.log('getById:', storyId)
    try {
        const collection = await dbService.getCollection('story')
        const story = await collection.findOne({ _id: storyId})
        // const story = await collection.findOne({ _id: new ObjectId(storyId) })
        return story
    } catch (err) {
        logger.error(`while finding story ${storyId}`, err)
        throw err
    }
}

// work
async function add(story) {
    console.log('add' , story)
    try {
        const collection = await dbService.getCollection('story')
        await collection.insertOne(story)
        return story
    } catch (err) {
        logger.error('cannot insert story', err)
        throw err
    }
}

// work
async function remove(storyId) {
    console.log('remove')
    try {
        const collection = await dbService.getCollection('story')
        await collection.deleteOne({ _id: new ObjectId(storyId) })
    } catch (err) {
        logger.error(`cannot remove story ${storyId}`, err)
        throw err
    }
}

// async function update(story) {
//     try {
//         const { name, price, inStock, labels } = story
//         const storyToSave = { name, price, inStock, labels }

//         const collection = await dbService.getCollection('story')
//         await collection.updateOne({ _id: new ObjectId(story._id) }, { $set: storyToSave })
//         return story
//     } catch (err) {
//         logger.error(`cannot update story ${storyId}`, err)
//         throw err
//     }
// }

// async function addStoryMsg(storyId, msg) {
//     try {
//         msg.id = utilService.makeId()
//         const collection = await dbService.getCollection('story')
//         await collection.updateOne({ _id: new ObjectId(storyId) }, { $push: { msgs: msg } })
//         return msg
//     } catch (err) {
//         logger.error(`cannot add story msg ${storyId}`, err)
//         throw err
//     }
// }

// async function removeStoryMsg(storyId, msgId) {
//     try {
//         const collection = await dbService.getCollection('story')
//         await collection.updateOne({ _id: new ObjectId(storyId) }, { $pull: { msgs: { id: msgId } } })
//         return msgId
//     } catch (err) {
//         logger.error(`cannot add story msg ${storyId}`, err)
//         throw err
//     }
// }

// async function addMsgToChat(msg, storyId) {
//     try {
//         console.log('storyId', storyId);
//         const collection = await dbService.getCollection('story')
//         await collection.updateOne({ _id: new ObjectId(storyId) }, { $push: { chatHistory: msg } })
//         console.log('addMsgToChat')
//     } catch (err) {
//         console.log(`ERROR: cannot add message to story`)
//         throw err;
//     }
// }

