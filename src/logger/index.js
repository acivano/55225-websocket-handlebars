const {createLogger, transports: {Console, File}, format:{combine, colorize, simple}} = require('winston')
const config = require('../config/config')
const options = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'blue',
        http: 'green',
        debug: 'white'
    }
}

const logger = createLogger({

    transports:[
        new Console({
            level:config.CONSOLE_LOG_LEVEL,
            format: combine(
                colorize({colors: options.colors}),
                simple()
            )
        }),
        new File({
            filename: './logs/error.log',
            level: config.FILE_LOG_LEVEL,
            format: simple()
        })
    ]
})



module.exports = logger