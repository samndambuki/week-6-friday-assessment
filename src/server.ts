import express, { json } from 'express'
import userRoutes from './routes/userRoutes'

const app = express()
app.use(json())

app.use('/users',userRoutes)
app.listen(6000,()=>{
    console.log("Server is running")
})
