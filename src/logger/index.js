const {createLogger, transports: {Console, File}, format:{combine, colorize, simple}} = require('winston')
const config = require('../config/config')
const options = {
    colors: {
      error: 'red',
      warning: 'yellow',
      info: 'blue',
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