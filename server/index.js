import {connectDB} from './db'
import {setupSocket} from './socket'
import app from './routes'

connectDB()
app.listen(8081, () => { console.log("Server is listening on 8081!") })
