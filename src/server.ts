import express, { json } from 'express'

const app = express()
app.use(json())

app.use('',)
app.listen(6000,()=>{
    console.log("Server is running")
})
