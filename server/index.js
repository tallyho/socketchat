import {connectDB} from './db'
import setupRoutes from './routes'
import app from './routes'

connectDB()
app.listen(8081, () => { console.log("Server is listening on 8081!") })
