const Listener = require("../framework/core/Listener");

class ChatListener extends Listener {
    constructor() {
        super();
        this.event_name = "message";
    }

    execute(message) {
        if (message.author.bot) {
            return;
        }
        if (message.channel.id == 810074015229411349) {

            const username = message.author.username;
            const content = message.content;

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