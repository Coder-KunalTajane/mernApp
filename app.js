const express = require('express');
const app = express();
const PORT = 5000;
const mongoose = require('mongoose');
const { MONGOURI } = require('./keys.js');
//const  { route }  = require('./routes/auth.js');




mongoose.connect(MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.connection.on('connected', () => {
  console.log("connected to mongo....!")
})

mongoose.connection.on('error', (err) => {
  console.log("err connecting mongo....!", err);
})



require('./models/user.js')
require('./models/post.js')
app.use(express.json());
app.use(require('./routes/auth.js'))
app.use(require('./routes/post.js'))


app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
})
