const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const { dbConnection } = require('./database/config');
const { readdirSync } = require('fs');
require('dotenv').config();

// import routes
const authRoutes = require('./routes/auth');

// app
const app = express();

// db
dbConnection();

// middlewares
app.use(morgan('dev'));
app.use(express.json());
// app.use(bodyParser.json({ limit: '2mb' }));
app.use(cors());

// routes middleware
readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)));
// app.use('/api', authRoutes)

// port
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server is running in port ${port}`));
