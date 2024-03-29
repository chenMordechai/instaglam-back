import http from 'http'
import path, { dirname } from 'path';
import cors from 'cors'
import express from 'express'
import cookieParser from 'cookie-parser'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

import { logger } from './services/logger.service.js'
logger.info('server.js loaded...')

const app = express()
const server = http.createServer(app)
// Express App Config
app.use(cookieParser()) // for res.cookies
app.use(express.json()) // for req.body
app.use(express.static('public'))


if (process.env.NODE_ENV === 'production') {
    console.log('process.env.NODE_ENV:', process.env.NODE_ENV)
    // Express serve static files on production environment
    app.use(express.static(path.resolve(__dirname, 'public')))
    console.log('__dirname: ', __dirname)
} else {
    // Configuring CORS
    const corsOptions = {
        // Make sure origin contains the url your frontend is running on
        origin: ['http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://localhost:5174', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true
    }
    app.use(cors(corsOptions))
}

import { authRoutes } from './api/auth/auth.routes.js'
import { userRoutes } from './api/user/user.routes.js'
import { postRoutes } from './api/post/post.routes.js'
import { msgRoutes } from './api/msg/msg.routes.js'
import { setupSocketAPI } from './services/socket.service.js'

// routes 
import { setupAsyncLocalStorage } from './middlewares/setupAls.middleware.js'
app.all('*', setupAsyncLocalStorage)

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/post', postRoutes)
app.use('/api/msg', msgRoutes)

setupSocketAPI(server)

// Make every unmatched server-side-route fall back to index.html
// So when requesting http://localhost:3030/index.html/car/123 it will still respond with
// our SPA (single page app) (the index.html file) and allow vue-router to take it from there

app.get("/service-worker.js", (req, res) => {
    console.log('hi')
    res.sendFile(path.resolve(__dirname, "public", "service-worker.js"));
});
//   app.get("*", function response(req, res) {
//     res.sendFile(path.join(__dirname, "public", "index.html"));
//   });

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const port = process.env.PORT || 3030

server.listen(port, () => {
    logger.info(`Server listening on port http://127.0.0.1:${port}/`)

})


