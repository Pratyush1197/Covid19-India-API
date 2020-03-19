const express = require('express');
const app = express();

const postsRoute = require('./routes/posts');
var PORT = process.env.PORT || 3005;
app.use('/', postsRoute); 



app.listen(PORT);
