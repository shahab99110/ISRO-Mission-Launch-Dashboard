const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://shahab:testing123456@nasacluster.ojtgt.mongodb.net/isro?retryWrites=true&w=majority'


mongoose.connection.once('open',()=>{
    console.log("MongoDb connection ready");
});

mongoose.connection.on('error',(err)=>{
    console.error(err); 
})

async function mongoConnect(){
  await mongoose.connect(MONGO_URL)
}

async function mongoDisconnect() {
    console.log("disconnect function call hua hae")
    await mongoose.disconnect();
  }

module.exports = {
    mongoConnect,
    mongoDisconnect,
}