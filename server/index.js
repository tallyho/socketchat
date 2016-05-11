import {connectDB} from './db'
import {setupSocket} from './socket'
import app from './routes'

import {Server} from 'http'

connectDB()
const server = Server(app)
setupSocket(server)
server.listen(8081, () => { console.log("Server is listening on 8081!") })
