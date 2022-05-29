const express = require('express');
const app = express();
const checkServer = require('./routes/checkServer');
app.use(require('body-parser').json());
app.use(express.static(__dirname + '/static'));

app.get('/check-server', checkServer);

const port = process.env.PORT || 3000
console.log(process.env);
app.listen(port, () => console.log('Listening on port', port));

const gracefulShutdown = () => {
    db.teardown()
        .catch(() => { })
        .then(() => process.exit());
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon

setInterval(() => { checkServer({}, { send: (message) => console.log(message) }) }, 5 * 1000)
