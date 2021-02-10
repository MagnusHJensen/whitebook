class Kick extends Command {
    constructor() {
        super();
        this.name = "kick";
        this.allowed_channels = [];
        this.allowed_permissions = ['KICK_MEMBERS'];
        this.aliases = ['k'];
    }

    async execute(message, author, ...params) {
        const guild = message.guild;
        if (!guild.available) {
            await author.send("The server is not available.\nIt may be do to an outage, please try again later.");
            return;
        }

        if (params.length < 1) {
            const reply = await message.reply("You are missing a user!\nCorrect usage: `wb!kick <User> [Reason]`");
            await reply.delete({timeout: 3000});
            return;
        }

        const memberQuery = params.shift();

        const member = await Util.checkForMemberMention(message, memberQuery);

        if (member == null) {
            await message.reply("Couldn't find user!");
            return;
        }

        const reason = params.length < 1 ? 'You have been kicked from the server.' :  params.join(" ");


        await kickedMember.send(`You have been kicked from ${guild} by ${author} with the following reason: \`${reason}\``);
        const kickedMember = await member.kick(reason);

        const kickMessage = await message.channel.send(kickedMember + " got kicked with the reason: `" + reason + "`");
        await kickMessage.delete({timeout: 5000});


    }

}

module.exports = Kick;
