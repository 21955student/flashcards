const express = require('express');
const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const cardRouter = require('./routes/cardRoutes');
const authRouter = require('./routes/authRoutes');
const authMiddleware = require('./middleware/auth');
const expressLayouts = require('express-ejs-layouts');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(authMiddleware);
app.use(expressLayouts);
app.set('layout', 'layout');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { user: req.user, error: null, success: null });
});

app.use('/cards', cardRouter);
app.use('/users', authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});