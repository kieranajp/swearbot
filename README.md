# @*!#bot

**A Slackbot that tells you off for swearing!**

This bot reads slack channels for messages containing (configurable) swear words, and if it finds them:

- Posts a message back in the channel to tell the user off
- Saves the swears to a sqlite database - so we can get metrics later on who swears the most!

## Requirements and Installation

Tested on node.js 6.0, any lower and you may need to run it through an ES6 transpiler.

Clone this, `npm install`, copy `config.js.dist` to `config.js` and fill in your Slack API token.

`node index.js` to start. (or `node-babel` if you want to transpile it)

### Contributing

PRs welcome!

### License

MIT
