const Listener = require("../framework/core/Listener");

class ChatListener extends Listener {
    constructor() {
        super();
        this.event_name = "message";
    }

    execute(message) {
        
        if (message.channel.id == 810175506774884362 && !message.author.bot) {
            console.log("hello");
            const username = message.author.username;
            const content = message.content;

            const channel = message.channel;
            message.delete();

            channel.send(`<:discord:810181135002239026> >> **${username}** | ${content}`);

            const chatObject = {
                "op": 9,
                "side": "DC",
                "data": {
                    "message": content,
                    "username": username
                }
            }

            global.ws.send(JSON.stringify(chatObject));
        }
    }
}

module.exports = ChatListener;