import { app } from "./app.js"
import { connectDB } from "./db/index.js"

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 3001,()=>{
        console.log(`server is running on port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log(err) 
    console.log(" Unabele to connect to database and start server")   
})