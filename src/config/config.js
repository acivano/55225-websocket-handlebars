module.exports = {
    MONGO_URL: process.env.MONGO_URL,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    PORT: process.env.PORT,
    URL: process.env.URL,
    PERSISTANCE: process.env.MANAGER_PERSISTANCE,
    GITHUB_STRATEGY_NAME: process.env.GITHUB_STRATEGY_NAME,
    mail: {
      GMAIL_ADDRESS: process.env.GMAIL_ADDRESS,
      GMAIL_PWD: process.env.GMAIL_PWD
    },
    CONSOLE_LOG_LEVEL: process.env.CONSOLE_LOG_LEVEL,
    FILE_LOG_LEVEL: process.env.FILE_LOG_LEVEL
  }