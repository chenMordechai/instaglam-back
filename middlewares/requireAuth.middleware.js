import { logger } from '../services/logger.service.js'
import { authService } from '../api/auth/auth.service.js'

export async function requireAuth(req, res, next) {
    console.log('requireAuth')
    if (!req?.cookies?.loginToken) {
        return res.status(401).send('Not Authenticated')
    }
    // console.log('req.cookies.loginToken:', req.cookies.loginToken)
    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    // console.log('loggedinUser:', loggedinUser)
    if (!loggedinUser) return res.status(401).send('Not Authenticated')

    req.loggedinUser = loggedinUser
    next()
}

export async function requireAdmin(req, res, next) {
    if (!req?.cookies?.loginToken) {
        return res.status(401).send('Not Authenticated')
    }

    const loggedinUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedinUser.isAdmin) {
        logger.warn(loggedinUser.fullname + 'attempted to perform admin action')
        res.status(403).end('Not Authorized')
        return
    }
    req.loggedinUser = loggedinUser
    next()
}