(async()=>{
    const {MONGO_URL, HOST, PORT} = require('./src/config/config.passwords')
    const express = require('express')
    const http = require('http')
    const Routes = require('./src/routes/index')
    const path = require('path')
    const handlebars = require('express-handlebars')
    const { Server } = require("socket.io")
    const mongoose = require('mongoose')
    const cookieParser = require('cookie-parser')
    const session = require('express-session')
    const MongoStore = require('connect-mongo')
    const passport = require('passport')
    const initPassportLocal = require('./src/config/passport.init.js')
    
    const socketManager = require('./src/websocket')

    await mongoose.connect(MONGO_URL)
    const app = express() 
    const server = http.createServer(app) 
    const io = new Server(server) 
    
    app.engine('handlebars', handlebars.engine()) 
    app.set('views', path.join(__dirname, '/src/views')) 
    app.set('view engine', 'handlebars') 
    
    app.use(express.urlencoded({ extended: true}))
    app.use(express.json())
    app.use('/static', express.static(path.join(__dirname + '/src/public')))
    app.use(cookieParser('secretkey'))
    app.use(session({
        secret:'secretkey',
        resave:true,
        saveUninitialized: true,
        store: MongoStore.create({
            mongoUrl: MONGO_URL,
            ttl: 60 * 60
        })
    }))

    initPassportLocal()
    app.use(passport.initialize())
    app.use(passport.session())

    app.use(async(req, res, next) =>{
        a = console.log(req.session, req.user)
    //     if(req.session?.user){
    //         req.user={
    //             firstname: req.session.user.firstname,
    //             lastname: req.session.user.lastname,
    //             role: req.session.user.role,
    //             user: req.session.user.user,
    //             cart: req.session.user.cart
    //         }
    //     }
        next()
    })
    
    app.use('/', Routes.home)
    app.use('/api', Routes.api)
    
    
    // websocket
    io.on('connection',  socketManager)
    
    //---- Defino Express------
    
    
    
    server.listen(PORT, ()=>{
        console.log(`Express Server listening at http://${HOST}:${PORT}`)
    })
    
    //-------------------------
    
})()



