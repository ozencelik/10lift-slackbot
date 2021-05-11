const Express = require('express')
const bodyParser = require('body-parser')


const app = new Express()
app.use(bodyParser.urlencoded({ extended: true }))
require('dotenv').config()


// Get global envs
const { SLACK_TOKEN: slackToken, PORT } = process.env
// Establishing the port 
const port = PORT || 3000;


app.get('/', (req, res) => {
    res.send('Hello world');
})


app.listen(port, () => {
    console.log(`Server started at localhost:${port}`)
})