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
    console.error('Missing environment variables SLACK_TOKEN')
    process.exit(1)
}

app.post('/', async (req, res) => {
    res.json(await slashCommandFactory(slackToken, req.body));
})


app.listen(port, () => {
    console.log(`Server started at localhost:${port}`)
})