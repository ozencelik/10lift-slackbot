const tokenizer = require('string-tokenizer')

const commandParser = (commandText) => {
  const tokens = tokenizer()
    .input(commandText)
    .token('time', /^\d+$/, match => match[2])
    .resolve()

  return tokens.time
}

module.exports = commandParser