const {default: mongoose} = require ('mongoose');
const dbConnect = () => {
    try {
        const conn = mongoose.connect(process.env.MONGODB_URL);
        console.log("database is connected now");
        
    } catch (error) {
        console.log('database connection failed');
        
    }

}
module.exports= dbConnect;