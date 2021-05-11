const validateCommandInput = (time) => {
  if (!time) {
    return new Error('No time value (as number) found in the message')
  }

  if (time.length > 5) {
    return new Error('Dude !\nHow did you do that much.\nPlease enter a value under 1000')
  }
}

module.exports = validateCommandInput