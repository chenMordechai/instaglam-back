import { storyService } from './story.service.js'
import { logger } from '../../services/logger.service.js'
import { socketService } from '../../services/socket.service.js'

// work
export async function getStories(req, res) {
    console.log('get stories')
    try {
        // const { name, price, inStock, labels, type, desc } = req.query
        // const filterBy = { name, price: +price, inStock , labels: (labels) ? labels : [] }
        // const sortBy = { type, desc: +desc }

        // logger.debug('Getting Stories', filterBy, sortBy)
        const stories = await storyService.query()
        // const stories = await storyService.query(filterBy, sortBy)
        res.json(stories)
    } catch (err) {
        logger.error('Failed to get stories', err)
        res.status(500).send({ err: 'Failed to get stories' })
    }
}

// work
export async function getStoryById(req, res) {
    try {
        const storyId = req.params.id
        const story = await storyService.getById(storyId)
        res.json(story)
    } catch (err) {
        logger.error('Failed to get story', err)
        res.status(500).send({ err: 'Failed to get story' })
    }
}

// work
export async function addStory(req, res) {
    console.log('addStory:')
    // const { loggedinUser } = req
    // console.log('loggedinUser:', loggedinUser)
    // if (!loggedinUser.isAdmin) return

    try {
        const story = req.body
        // story.owner = loggedinUser
        const addedStory = await storyService.add(story)
        // socketService.broadcast({ type: 'story-added', data: addedStory, userId: loggedinUser._id })
        
        res.json(addedStory)
    } catch (err) {
        logger.error('Failed to add story', err)
        res.status(500).send({ err: 'Failed to add story' })
    }
}

// work
export async function removeStory(req, res) {
    // const { loggedinUser } = req
    console.log('removeStory')
    try {
        const storyId = req.params.id
        const removedId = await storyService.remove(storyId)
        // socketService.broadcast({ type: 'story-removed', data: storyId, userId: loggedinUser._id })
        res.send({ msg: 'Deleted successfully' })
    } catch (err) {
        logger.error('Failed to remove story', err)
        res.status(500).send({ err: 'Failed to remove story' })
    }
}

// export async function updateStory(req, res) {
//     const { loggedinUser } = req

//     console.log('updateStory')
//     try {
//         const story = req.body
//         const updatedStory = await storyService.update(story)
//         socketService.broadcast({ type: 'story-updated', data: updatedStory, userId: loggedinUser._id })
//         res.json(updatedStory)
//     } catch (err) {
//         logger.error('Failed to update story', err)
//         res.status(500).send({ err: 'Failed to update story' })
//     }
// }

// export async function addStoryMsg(req, res) {
//     const { loggedinUser } = req
//     const {_id , fullname} = loggedinUser
//     try {
//         const storyId = req.params.id
//         const msg = {
//             txt: req.body.txt,
//             by: {_id,fullname},
//         }
//         const savedMsg = await storyService.addStoryMsg(storyId, msg)
//         res.json(savedMsg)
//     } catch (err) {
//         logger.error('Failed to update story', err)
//         res.status(500).send({ err: 'Failed to update story' })
//     }
// }

// export async function removeStoryMsg(req, res) {
//     const { loggedinUser } = req
//     try {
//         const storyId = req.params.id
//         const { msgId } = req.params

//         const removedId = await storyService.removeStoryMsg(storyId, msgId)
//         res.send(removedId)
//     } catch (err) {
//         logger.error('Failed to remove story msg', err)
//         res.status(500).send({ err: 'Failed to remove story msg' })
//     }
// }