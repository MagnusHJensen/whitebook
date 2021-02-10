
async function checkForMemberMention(message, string) {
    const mentions = message.mentions.members;
    if (mentions.first() != null) {
        const mention = mentions.first();
        mentions.delete(mention.id);
        return mention;
    }

    if (string.match("[0-9]+")) {
        return await message.guild.members.fetch(string);
    } else {
        const membersFetched = await message.guild.members.fetch({query: string, limit: 1});
        return membersFetched.first();
    }
}

async function convertMilSecToDayObject(milliseconds) {
    let seconds = milliseconds / 1000;

    const days = seconds / (24 * 3600);

    seconds %= 24 * 3600;
    const hours = seconds / 3600;

    seconds %= 3600;
    const minutes = seconds / 60;

    seconds %= 60;

    return {
        days: Math.floor(days),
        hours: Math.floor(hours),
        minutes: Math.floor(minutes),
        seconds: Math.floor(seconds)
    };
}

async function convertDayObjectToMilliseconds(dayObject) {
   const millisecondsFromDay = dayObject.days * 24 * 60 * 60 * 1000;
   const millisecondsFromHours = dayObject.hours * 60 * 60 * 1000;
   const millisecondsFromMinutes = dayObject.minutes * 60 * 1000;
   const millisecondsFromSeconds = dayObject.seconds * 1000;

   return millisecondsFromDay + millisecondsFromHours + millisecondsFromMinutes + millisecondsFromSeconds;
}

async function parseTimeToMilliseconds(stringArr) {
    let milliseconds = 0;
    let totalCases = 0;
    let timesNoDate = 0;

    stringArr.every((str) => {
        str = str.toLowerCase();
        if (str.match('^[0-9]*d(a?y?s?)$') ) {
            const index = str.indexOf('d');
            milliseconds += parseInt(str.substring(0, index)) * 24 * 60 * 60 * 1000;
            totalCases++;
            return true;
        } else if (str.match('^[0-9]*h(o?u?r?s?)$') ) {
            const index = str.indexOf('h');
            milliseconds += parseInt(str.substring(0, index)) * 60 * 60 * 1000;
            totalCases++;
            return true;
        } else if (str.match('^[0-9]*m(i?n?u?t?e?s?)$') ) {
            const index = str.indexOf('m');
            milliseconds += parseInt(str.substring(0, index)) * 60 * 1000;
            totalCases++;
            return true;
        } else if (str.match('^[0-9]*s(e?c?o?n?d?s?)$') ) {
            const index = str.indexOf('s');
            milliseconds += parseInt(str.substring(0, index)) * 1000;
            totalCases++;
            return true;
        }
        timesNoDate++;
        if (timesNoDate === 2) {
            return false;
        }
    });

    return {
        milliseconds,
        totalCases
    };
}


module.exports = {
    checkForMemberMention,
    convertMilSecToDayObject,
    convertDayObjectToMilliseconds,
    parseTimeToMilliseconds,
};
