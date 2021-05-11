const Express = require('express')
const bodyParser = require('body-parser')
const slashCommandFactory = require('./slashCommand')


const app = new Express()
app.use(bodyParser.urlencoded({ extended: true }))
require('dotenv').config()


// Get global envs
const { SLACK_TOKEN: slackToken, PORT } = process.env
// Establishing the port 
const port = PORT || 3000;
//Check whether the slack token is exist or not.
if (!slackToken) {
    console.error('missing environment variables SLACK_TOKEN')
    process.exit(1)
}
const slashCommand = slashCommandFactory(slackToken)

app.post('/', (req, res) => {
    slashCommand(req.body)
      .then((result) => {
        return res.json(result)
      })
      .catch(console.error) 
  })


app.listen(port, () => {
    console.log(`Server started at localhost:${port}`)
})