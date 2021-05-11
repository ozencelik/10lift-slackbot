const properResponse = (command, time) => {
    switch (command) {
      case '/running':
        return 'Bad Request'
      case '/biking':
        return 'Unauthorized: Be sure you configured the integration to use a valid API key'
      case '/leaderboard':
        return `1. ozenc.celik 50\n2. marry.jane 25\n3. john.doe 20`
      default:
        return new Error('Command not found')
    }
  }
  
  module.exports = properResponse