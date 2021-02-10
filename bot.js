require('dotenv').config();
global.glob = require('glob');
global.path = require('path');
global.Command = require('./framework/core/Command');
global.Listener = require('./framework/core/Listener');
global.database = require('./util/DB');
global.Util = require('./util/Util');


const base_classes = glob.sync('./base_classes/**/*.js').map(file => {
    const resolved_path = path.resolve(file);
    delete require.cache[resolved_path];
    return require(resolved_path);
});

for (const c of base_classes) {
    global[c.name] = c;
}

const DiscordBot = require("./framework/DiscordBot");
// if using glitch comment out the line below


const bot = new DiscordBot(process.env.DISCORD_PREFIX, process.env.DISCORD_TOKEN).run();
