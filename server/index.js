import express from 'express'
import bodyParser from 'body-parser'
import {connectDB} from './db'
import setupRoutes from './routes'

connectDB()

const app = express()
app.use(bodyParser.json())
setupRoutes(app)
app.listen(8080, () => { console.log("Server is running!") })
