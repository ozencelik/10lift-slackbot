const Express = require('express')
const bodyParser = require('body-parser')
const commandParser = require('./commandParser')
const validateCommandInput = require('./validateCommandInput')
const properResponse = require('./properResponse')

const app = new Express()
app.use(bodyParser.urlencoded({ extended: true }))
require('dotenv').config()

const createErrorAttachment = (error) => ({
    color: 'danger',
    text: `*Error*:\n${error.message}`,
    mrkdwn_in: ['text']
})

const createSuccessAttachment = (message) => ({
    color: 'good',
    text: `${message}`,
    mrkdwn_in: ['text']
})

const createAttachment = (result) => {
    if (result.constructor === Error) {
        return createErrorAttachment(result)
    }
    return createSuccessAttachment(result)
}


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
    const body = req.body;
    if (!body) {
        res.json({
            text: '',
            attachments: [createErrorAttachment(new Error('Invalid body'))]
        });
    }

    if (slackToken !== body.token) {
        res.json({
            text: '',
            attachments: [createErrorAttachment(new Error('Invalid token'))]
        });
    }


    const time = commandParser(body.text)
    const properResponse = await getProperResponse(body.command, body.user_id, body.user_name, time);

    switch (body.command) {
        case '/running':
        case '/biking':
            let error
            if ((error = validateCommandInput(time))) {
                res.json({
                    text: '',
                    attachments: [createErrorAttachment(error)]
                });
            }
            res.json({
                text: 'Your activity time saved successfully !',
                attachments: [createAttachment(properResponse)]
            });
        case '/leaderboard':
            res.json({
                response_type: 'in_channel',
                text: '----- Top 3 -----',
                attachments: [createAttachment(properResponse)]
            });
        case '/mostactiveacitiviesofusers':
            res.json({
                response_type: 'in_channel',
                text: '----- Most Active Activities Of User  -----',
                attachments: [createAttachment(properResponse)]
            });
    }
})


app.listen(port, () => {
    console.log(`Server started at localhost:${port}`)
})

async function getProperResponse(command, user_id, user_name, time) {
    return await properResponse(command, user_id, user_name, time);
}