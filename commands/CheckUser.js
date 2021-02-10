const User = require("../base_classes/User");

class CheckUser extends Command {
    constructor() {
        super();
        this.name = "checkuser";
        this.allowed_channels = [];
        this.allowed_permissions = [];
        this.aliases = ['cu'];
    }

    async execute(message, author, ...params) {
        const user = User.get_user_profile_from_discord_id(author.id);

    }

}

module.exports = CheckUser;
