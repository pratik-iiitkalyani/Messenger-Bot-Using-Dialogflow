const fetch = require('node-fetch');
const Config = require("./config");

// You can find your project ID in your Dialogflow agent settings
const projectId = 'hotel-search-iubkcx'; //https://dialogflow.com/docs/agents#settings
const sessionId = '123456';
const languageCode = 'en-US';

const dialogflow = require('dialogflow');

const config = {
    credentials: {
        private_key: Config.DIALOGFLOW_PRIVATE_KEY,
        client_email: Config.DIALOGFLOW_CLIENT_EMAIL
    }
};

const sessionClient = new dialogflow.SessionsClient(config);

const sessionPath = sessionClient.sessionPath(projectId, sessionId);

// Remember the Page Access Token you got from Facebook earlier?
// Don't forget to add it to your `variables.env` file.
const  FACEBOOK_ACCESS_TOKEN  = Config.FACEBOOK_ACCESS_TOKEN;

const sendTextMessage = (userId, text) => {
    console.log('Client Email in sendTe', Config.DIALOGFLOW_CLIENT_EMAIL)
    console.log(Config.DIALOGFLOW_PRIVATE_KEY)
    return fetch(
        `https://graph.facebook.com/v2.6/me/messages?access_token=${FACEBOOK_ACCESS_TOKEN}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                messaging_type: 'RESPONSE',
                recipient: {
                    id: userId,
                },
                message: {
                    text,
                },
            }),
        }
    );
}

module.exports = (event) => {
    console.log('Client Email', Config.DIALOGFLOW_CLIENT_EMAIL)
    const userId = event.sender.id;
    const message = event.message.text;

   

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: message,
                languageCode: languageCode,
            },
        },
    };


    sessionClient
        .detectIntent(request)
        .then(responses => {
            const result = responses[0].queryResult;
            return sendTextMessage(userId, result.fulfillmentText);
        })
        .catch(err => {
            console.error('ERROR:', err);
        });
}