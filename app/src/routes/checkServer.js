const util = require('minecraft-server-util');
const axios = require('axios')
const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL
const username = process.env.USERNAME || "Freddy"
const bedrockServerHost = process.env.BEDROCK_SERVER_HOST
const bedrockServerPort = Number(process.env.BEDROCK_SERVER_PORT)
let previousMessage = ""
const postToWebhook = async (message) => {
    const payload = {
        "username": username + "-The Helpful Guy",
        "content": message,
        "embeds": [
        ]
    }
    return axios
        .post(discordWebhookUrl, payload)
        .then(res => {
            console.log(res)
        })
        .catch(error => {
            console.error(error)
        })
}

module.exports = async (req, res) => {
    util.statusBedrock(
        bedrockServerHost,
        { port: bedrockServerPort, enableSRV: true, timeout: 1500 }
    ).then((response) => {
        console.log(response);
        server_state = JSON.parse(JSON.stringify(response, (key, value) =>
            typeof value === 'bigint'
                ? value.toString()
                : value // return everything else unchanged
        ));
        let message = 'Server is online and there '
        switch (server_state.onlinePlayers) {
            case 1:
                message = message + 'is 1 player online'
                break;
            default:
                message = message + 'are ' + server_state.onlinePlayers + ' players online'
        }
        if (message != previousMessage) {
            postToWebhook(message)
        }
        previousMessage = message;
        res.send({ server_state });
    })
        .catch((error) => {
            message = JSON.stringify(error)
            if (message != previousMessage) {
                postToWebhook(message);
            }
            previousMessage = message;
            res.send({ server_state: error });
        });
};
