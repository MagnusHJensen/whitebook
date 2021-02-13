class AddProfile extends Command {
    constructor() {
        super();
        this.name = "addprofile";
        this.allowed_channels = [];
        this.allowed_permissions = ['ADMINISTRATOR'];
        this.aliases = ['ap'];
    }

    async execute(message, author, ...params) {
        const guild = message.guild;
        if (!guild.available) {
            await author.send("The server is not available.\nIt may be do to an outage, please try again later.");
            return;
        }

        if (params.length < 1) {
            const reply = await message.reply("You are missing a user!\nCorrect usage: `wb!addprofile <User>`");
            await reply.delete({timeout: 3000});
            return;
        }




        const memberQuery = params.shift();

        const userObject = {
            discordAlts: [],
            minecraftAlts: [],
            nicknames: []
        };

        const member = await Util.checkForMemberMention(message, memberQuery);

        if (member == null) {
            await message.reply("Couldn't find user!");
            return;
        }

        const checkUser = await User.get_user_profile_from_discord_id(member.id).catch(e => false);

        if (checkUser) {
            const userExists = await message.channel.send("A profile already exists for that user.");
            await userExists.delete({timeout: 5000});
            return;
        }

        userObject.discordId = member.id;

        const rootMessage = await message.reply(`Please provide ${member}'s discord alts.\nUse the mention, id of the user, or type their name.`);


        const filter = msg => msg.author.id === author.id;
        const altCollection = await rootMessage.channel.awaitMessages(filter, {max: 1, time: 45000, errors: ['time']})
            .catch(async collected => {
                const response = await message.channel.send("I timed out!\nPlease try again.");
                await response.delete({timeout: 3000});
                return;
            });

        const altMessage = altCollection.first();

        for (let potMember of altMessage.content.split(' ')) {
            const foundMember = await Util.checkForMemberMention(altMessage, potMember);
            if (foundMember != null) {
                userObject.discordAlts.push(foundMember.id);
            }
        }

        await rootMessage.edit(`Please provide ${member}'s minecraft UUID!`);

        const mcUserCollection = await rootMessage.channel.awaitMessages(filter, {max: 1, time: 45000, errors: ['time']})
            .catch(async collected => {
                const response = await message.channel.send("I timed out!\nPlease try again.");
                await response.delete({timeout: 3000});
                return;
            });

        const mcUserMessage = mcUserCollection.first();

        if (mcUserMessage.content.match("^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$") || mcUserMessage.content.includes("skip")) {
            if (!mcUserMessage.content.includes("skip")) {
                userObject.minecraftId = mcUserMessage.content;
            } else {
                userObject.minecraftId = "NA";
            }
        }

        await rootMessage.edit(`Please provide ${member}'s minecraft alts UUID's!`);

        const mcAltCollection = await rootMessage.channel.awaitMessages(filter, {max: 1, time: 45000, errors: ['time']})
            .catch(async collected => {
                const response = await message.channel.send("I timed out!\nPlease try again.");
                await response.delete({timeout: 3000});
                return;
            });

        const mcAltMessage = mcAltCollection.first();

        if (!mcAltMessage.content.includes("skip")) {
            for (let potAlt of mcAltMessage.content.split(" ")) {
                if (mcUserMessage.content.match("^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$")) {
                    userObject.minecraftAlts.push(potAlt);
                }
            }
        }


        await rootMessage.edit(`Please provide ${member}'s often used nicknames!`);

        const nicknamesCollection = await rootMessage.channel.awaitMessages(filter, {max: 1, time: 45000, errors: ['time']})
            .catch(async error => {
                const response = await message.channel.send("I timed out!\nPlease try again.");
                await response.delete({timeout: 3000});
                return;
            });

        const nicknamesMessage = nicknamesCollection.first();

        if (!nicknamesMessage.content.includes("skip")) {
            for (let nick of nicknamesMessage.content.split(" ")) {
                userObject.nicknames.push(nick);
            }
        }



        const user = new User({discord_id: userObject.discordId, mc_uuid: userObject.minecraftId}).create();

        // TODO: UPADTE THE MESSAGE BELOW; TO CONTAIN THE GIVEN INFORMATION
        const resMessage = await message.channel.send(`A profile for ${member} was created! _(If anything is incorrect, please use the correct edit command.)_\n`);
        resMessage.delete({timeout: 5000});
    }

}

module.exports = AddProfile;
