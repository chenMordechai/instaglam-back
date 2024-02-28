import mongodb from 'mongodb'
const { ObjectId } = mongodb

import { msgService } from './msg.service.js'
import { userService } from '../user/user.service.js'
import { logger } from '../../services/logger.service.js'

export async function getMsgs(req, res) {
    console.log('getMsgs')
    try {
        const { userId } = req.query
        console.log('userId:', userId)

        const filterBy = { userId }
        const msgs = await msgService.query(filterBy)
        res.send(msgs)
    } catch (err) {
        logger.error('Failed to get msgs', err)
        res.status(500).send({ err: 'Failed to get msgs' })
    }
}

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
    const { loggedinUser } = req
    try {
        const userToChat = req.body
        const msgInfo = {
            users: [userToChat, loggedinUser],
            history: []
        }
        const addedMsgInfo = await msgService.addMsg(msgInfo)


        // update the users in the msgId
        await userService.addMsgId(addedMsgInfo)

        res.json(addedMsgInfo)
    } catch (err) {
        logger.error('Failed to add msg', err)
        res.status(500).send({ err: 'Failed to add msg' })
    }
}
