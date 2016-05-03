import {connectDB} from './db'
import setupRoutes from './routes'
import app from './routes'

connectDB()
app.listen(8080, () => { console.log("Server is running!") })
