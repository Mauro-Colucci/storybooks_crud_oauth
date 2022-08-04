const express = require('express')
require('dotenv').config({path: './config/config.env'})
const connectDB = require('./config/db')
const morgan = require('morgan')
const { engine } = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const app = express()
const PORT = process.env.PORT || 3000
//passport config
require('./config/passport')(passport)


//logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//handelbars helpers
const {formatDate, stripTags, truncate, editIcon, select} = require('./helpers/hbs')

//bodyparser
app.use(express.urlencoded({extended: false}))
app.use(express.json())

//method override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method
      delete req.body._method
      return method
    }
  }))

//handlebars
app.engine('.hbs', engine({helpers:{
    formatDate,
    stripTags,
    truncate,
    editIcon,
    select
},defaultLayout: 'main',extname: '.hbs'
}));
app.set('view engine', '.hbs');

//sessions
app.use(session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
    //creates a mongostore to save the session
    store: MongoStore.create({mongoUrl: process.env.MONGO_URL })
}))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//set global variable
app.use(function(req, res, next){
    res.locals.user = req.user || null
    next()
})

//static folder
app.use(express.static('public'))

//routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))


app.listen(PORT, ()=>{
    connectDB()
    console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})