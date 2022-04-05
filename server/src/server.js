const http = require('http')
const app = require('./app')
const mongoose = require('mongoose')
const {loadPlanetsData} = require('./models/plantes.model');

const PORT = process.env.PORT || 8000;

const MONGO_URL = 'mongodb+srv://shahab:testing123456@nasacluster.ojtgt.mongodb.net/isro?retryWrites=true&w=majority'

const server = http.createServer(app);

mongoose.connection.once('open',()=>{
    console.log("MongoDb connection ready");
});

mongoose.connection.on('error',(err)=>{
    console.error(err); 
})

async function startServer(){
    await mongoose.connect(MONGO_URL)
    await loadPlanetsData();

    server.listen(PORT,()=>{
        console.log("server is running on " + PORT);
    })
}

startServer();