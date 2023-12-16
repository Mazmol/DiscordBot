/**
 * @file Sample Trigger command.
 * @author Naman Vrati
 * @since 2.0.0
 * @version 3.2.2
 */

// For now, the only available property is name array. Not making the name array will result in an error.

/**
 * @type {import('../../typings').TriggerCommand}
 */
module.exports = {
	name: [""],

	execute(message, member) {
		// Put all your trigger code over here. This code will be executed when any of the element in the "name" array is found in the message content.
		if (message.channel === message.guild.channels.cache.find(channel => channel.name === "media	")) 
		{
			const linkRegex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g)
			if (!linkRegex.test(message.content)) {
				message.delete()
			}
		}
	},
};
