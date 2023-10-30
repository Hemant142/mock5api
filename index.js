const express=require('express')
require('dotenv').config()
const app=express()
const PORT=8080;

const cors=require('cors')
const connection=require('./db')
const {userRouter}=require('./Router/userRouter')
const {doctorRoute}=require('./Router/doctorRoutes')

app.use(cors())
app.use(express.json())

app.use('/users',userRouter)
app.use('/appointments',doctorRoute)

app.get('/',(req,res)=>{
    res.status(200).send('<h1>Welcome to the Masai Hospital</h1>')
})

app.listen(PORT,async()=>{
    try{
        await connection
        console.log(`server is running at port ${PORT}`)
        console.log('DB is connected')
    }
    catch(err){
        console.log(err.message)
    }
})