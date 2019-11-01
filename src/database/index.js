const mongoose = require("mongoose");

mongoose.connect('mongodb+srv://omnistack9:omnistack9@cluster0-sve8q.mongodb.net/api-nodejs-mongo-express?retryWrites=true&w=majority',
 { 
     useNewUrlParser: true,
     useUnifiedTopology: true,
     useCreateIndex: true,
     useFindAndModify: false,
 })
mongoose.Promise = global.Promise

module.exports = mongoose