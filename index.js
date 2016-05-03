const SlackBot = require('slackbots');
const sqlite   = require('sqlite3').verbose();
const config   = require('./config');

// Setup
try {
    const bot = new SlackBot(config.slack);
} catch (e) {
    console.error('Unable to connect to Slack with the provided config!');
}

try {
    const db = new sqlite.Database(config.database.dsn);

    db.serialize(() => {
        db.run(`
            CREATE TABLE IF NOT EXISTS swears(
                id INTEGER PRIMARY KEY ASC,
                user TEXT NOT NULL,
                message TEXT NOT NULL,
                num INTEGER NOT NULL,
                ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
            )
        `);
        db.close();
    });
} catch (e) {
    console.error('Unable to connect to db with the provided config!');
}


const countSwears = (message) => {
    const re = new RegExp(config.words.join('|'), 'gi');

    return (message.match(re) || []).length;
};

const saveSwears = (event, numSwears) => {
    return new Promise(() => {
        // Add to the leaderboard
        const db = new sqlite.Database(config.database.dsn);

        db.serialize(() => {
            db.run(
                `INSERT INTO swears (user, message, num, ts)
                VALUES ($user, $message, $num, $ts)`,
                {
                    $user: event.user,
                    $message: event.text,
                    $num: numSwears,
                    $ts: event.ts
                }
            );

            db.close();
        });
    });
};

const respondToSwears = (channel) => {
    // Tell them off
    return bot.postMessage(
        channel,
        config.bot.message,
        config.bot.config
    );
};

const checkForSwears = (event) => {
    console.log(event);

    if (event.type !== 'message' || ! event.text) {
        return;
    }

    numSwears = countSwears(event.text);
    if (! numSwears) {
        return;
    }

    respondToSwears(event.channel);
    saveSwears(event, numSwears);
};

bot.on('message', checkForSwears);
