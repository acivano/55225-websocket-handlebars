(async()=>{
    const { Command } = require('commander')

    const program = new Command()
  
    program.option('-e, --env <env>', 'Entorno de ejecucion', 'development')
    program.parse()
  
    const { env } = program.opts()

    const path = require('path')
    const dotenv = require('dotenv')
    
    dotenv.config({
      path: path.join(__dirname, env === 'development' ? '.env.development' : '.env')
    })
    // console.log(env)
    const config = require('./src/config/config')

    const express = require('express')
    const http = require('http')
    const Routes = require('./src/routes/index')
    const handlebars = require('express-handlebars')
    const { Server } = require("socket.io")
    const mongoose = require('mongoose')
    const cookieParser = require('cookie-parser')
    const session = require('express-session')
    const MongoStore = require('connect-mongo')
    const passport = require('passport')
    const initPassportLocal = require('./src/config/passport.init.js')
    
    const socketManager = require('./src/websocket')


    await mongoose.connect(config.MONGO_URL)
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
            mongoUrl: config.MONGO_URL,
            ttl: 60 * 60
        })
    }))

    initPassportLocal()
    app.use(passport.initialize())
    app.use(passport.session())

    app.use(async(req, res, next) =>{

        next()
    })
    
    app.use('/', Routes.home)
    app.use('/api', Routes.api)
    
    app.use((err, req, res, next) => {
        console.log('error!!')
        console.log(err.message)
      
        res.send({
          success: false,
          error: err.stack
        })
      })
    
    // websocket
    io.on('connection',  socketManager)
    
    //---- Defino Express------
    
    
    
    server.listen(config.PORT, ()=>{
        console.log(`Express Server listening at http://${config.URL}:${config.PORT}`)
    })
    
    //-------------------------
    
})()



