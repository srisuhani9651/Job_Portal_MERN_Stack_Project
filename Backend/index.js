import express from 'express'
import dotenv from 'dotenv'
dotenv.config({})
import cookieParser from 'cookie-parser'
import cors from 'cors'

import dns from 'dns'

dns.setServers(['8.8.8.8', '8.8.4.4'])

import db from './utils/db.js'

import userRouter from './router/user.router.js'
import companyRouter from './router/company.route.js'
import jobRouter from './router/job.route.js'
import applicationRoute from './router/application.route.js'


const app = express()

//middleware
app.use(express.json())
app.use(express.urlencoded({extended:true})) 
app.use(cookieParser())
const corsOptions = {
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    credentials: true
}
app.use(cors(corsOptions))
app.use('/api/v1/user', userRouter)
app.use('/api/v1/company', companyRouter)
app.use('/api/v1/job', jobRouter)
app.use('/api/v1/application', applicationRoute)


const PORT =process.env.PORT || 3000

app.listen(PORT, ()=> {db()})