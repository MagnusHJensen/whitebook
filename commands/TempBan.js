class TempBan extends Command {
    constructor() {
        super();
        this.name = "tempban";
        this.allowed_channels = [];
        this.allowed_permissions = ['BAN_MEMBERS'];
        this.aliases = ['tb'];
    }

    async execute(message, author, ...params) {
        const guild = message.guild;
        if (!guild.available) {
            await author.send("The server is not available.\nIt may be do to an outage, please try again later.");
            return;
        }

        if (params.length < 1) {
            const reply = await message.reply("You are missing a user!\nCorrect usage: `wb!tempban <User> <Time> [Reason]`");
            await reply.delete({timeout: 3000});
            return;
        }

        const memberQuery = params.shift();

        const member = await Util.checkForMemberMention(message, memberQuery);

        const time = await Util.parseTimeToMilliseconds(params);

        params = params.slice(time.totalCases);

        const dayObject = await Util.convertMilSecToDayObject(time.milliseconds);

        if (time === 0) {
            const reply = await message.reply(`You are missing time!\nCorrect usage: \`wb!tempban <User> <time [?30d ?20h, ?20m, ?10s]> [Reason]\``);
            await reply.delete({timeout: 3000});
            return;
        }


        if (member == null) {
            await message.reply("Couldn't find user!");
            return;
        }

        const user = await User.get_user_profile_from_discord_id(member.id);

        if (user == null) {
            await message.reply("User was not in database!");
        } else {
            await User.ban({user_id: user.id, unban_time: new Date().getTime() + time.milliseconds, guild_id: message.guild.id});
        }

        const reason = params.length < 1 ? 'Misbehaving.' :  params.join(" ");


        await member.send(`You have been temporary banned from the server for \`${dayObject.days} days, ${dayObject.hours} hours, ${dayObject.minutes} minutes, ${dayObject.seconds} seconds\` from ${guild} by ${author} with the following reason: \`${reason}\``);
        const banMember = await member.ban({reason: reason});

        const banMessage = await message.channel.send(banMember.toString() + " got temporary banned with the reason: `" + reason + "`");
        await banMessage.delete({timeout: 5000});


    }

}

module.exports = TempBan;
