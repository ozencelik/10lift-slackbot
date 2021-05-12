const commandParser = require('./commandParser')
const validateCommandInput = require('./validateCommandInput')
const properResponse = require('./properResponse')

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

async function slashCommandFactory(slackToken, body) {
    return new Promise((resolve, reject) => {
        if (!body) {
            return resolve({
                text: '',
                attachments: [createErrorAttachment(new Error('Invalid body'))]
            })
        }

        if (slackToken !== body.token) {
            return resolve({
                text: '',
                attachments: [createErrorAttachment(new Error('Invalid token'))]
            })
        }


        const time = commandParser(body.text)
        const properResponse = getProperResponse(body.command, body.user_id, body.user_name, time);


        if (body.command != '/leaderboard') {
            let error
            if ((error = validateCommandInput(time))) {
                return resolve({
                    text: '',
                    attachments: [createErrorAttachment(error)]
                })
            }
            return resolve({
                text: 'Your activity time saved successfully !',
                attachments: [createAttachment(properResponse)]
            })
        }
        else {
            return resolve({

                text: '----- Top 3 -----',
                attachments: [createAttachment(properResponse)]
            })
        }
    });
}

async function getProperResponse(command, user_id, user_name, time) {
    return await properResponse(command, user_id, user_name, time);
}

module.exports = slashCommandFactory