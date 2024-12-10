const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const userRoutes =  require("./routers/userRouters");
const studentRouters = require("./routers/studentRouter")
dotenv.config();

const app = express();
const PORT = 5000;
mongoose.connect(process.env.MONGODB_URL).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));

app.use(cors());
app.use(bodyParser.json());
app.use('/api/user', userRoutes);
app.use('/api/student', studentRouters);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));