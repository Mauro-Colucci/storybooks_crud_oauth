const mongoose = require('mongoose')


const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true})
        console.log(`MongoDB connected to ${conn.connection.name} database`)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}


module.exports = connectDB