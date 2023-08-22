(async()=>{
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
    
    const socketManager = require('./src/websocket')
    //mongodb+srv://agustincivano:CyIyEfz39CK8k6Je@cluster0.hcav26p.mongodb.net/
    
    await mongoose.connect("mongodb+srv://agustincivano:CyIyEfz39CK8k6Je@cluster0.hcav26p.mongodb.net/ecommerce?retryWrites=true&w=majority")
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
            mongoUrl: 'mongodb+srv://agustincivano:CyIyEfz39CK8k6Je@cluster0.hcav26p.mongodb.net/ecommerce?retryWrites=true&w=majority',
            ttl: 60 * 60
        })
    }))
    app.use((req, res, next) =>{
        console.log(req.session)
        if(req.session?.user){
            req.user={
                firstname: req.session.user.firstname,
                lastname: req.session.user.lastname,
                role: req.session.user.role,
                user: req.session.user.user,
                cart: req.session.user.cart
            }
        }
        next()
    })
    
    app.use('/', Routes.home)
    app.use('/api', Routes.api)
    
    
    // websocket
    io.on('connection',  socketManager)
    
    //---- Defino Express------
    
    const port = 8081
    
    server.listen(port, ()=>{
        console.log(`Express Server listening at http://localhost:${port}`)
    })
    
    //-------------------------
    
})()



