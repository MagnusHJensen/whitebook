require('dotenv').config();
global.glob = require('glob');
global.path = require('path');
global.Command = require('./framework/core/Command');
global.Listener = require('./framework/core/Listener');
global.database = require('./util/DB');
global.Util = require('./util/Util');
WebSocket = require('ws');
global.ws = new WebSocket("ws://212.10.87.252:3000");


const base_classes = glob.sync('./base_classes/**/*.js').map(file => {
    const resolved_path = path.resolve(file);
    delete require.cache[resolved_path];
    return require(resolved_path);
});

for (const c of base_classes) {
    global[c.name] = c;
}


const identifyObject = {
    "op": 2,
    "side": "DC"
}



const { MessageEmbed } = require('discord.js');
const DiscordBot = require("./framework/DiscordBot");
// if using glitch comment out the line below


const bot = new DiscordBot(process.env.DISCORD_PREFIX, process.env.DISCORD_TOKEN).run();

const disconnectObject = {
    "op": 99,
    "side": "DC"
}

process.on('SIGINT', function() {
    console.log("Exiting");
    global.ws.send(JSON.stringify(disconnectObject));
})

ws.onopen = (evt) => {
    ws.send(JSON.stringify(identifyObject));
}

ws.onmessage = async (msg) => {

    const msgData = JSON.parse(msg.data);

    if (msgData.op == 10) {
        const guild = await bot.guilds.fetch("715626418893095012");
        const channel = await guild.channels.resolve("810175506774884362");
        
        channel.send(`:minecraft: >> **${msgData.username}** | ${msgData.message}`);
    }

    if (msgData.op == 4) {
        console.log(msgData);
        global.ws.send('{"op": 4, "side": "DC"}');
    }
   
    
}
