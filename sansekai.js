const axios = require('axios');
const { BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, generateWAMessageContent, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType } = require("@whiskeysockets/baileys");
const fs = require("fs");
const util = require("util");
const chalk = require("chalk");
const { button } = require('@whiskeysockets/baileys');
const { MessageType, MessageOptions, Mimetype } = require('@whiskeysockets/baileys');

class Completion {
    /**
     * This class provides methods for generating completions based on prompts.
     */

    async create(prompt) {
        /**
         * Create a completion for the given prompt using an AI text generation API.
         * @param {string} prompt - The input prompt for generating the text.
         * @returns {string} The generated text as a response from the API.
         * @throws {Error} If there is an issue with sending the request or fetching the response.
         */

        try {
            const response = await axios.post(
                'https://api.binjie.fun/api/generateStream',
                {
                    prompt: prompt,
                    system: 'Always talk in English.',
                    withoutContext: true,
                    stream: false
                },
                {
                    headers: {
                        'origin': 'https://chat.jinshutuan.com',
                        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.79 Safari/537.36'
                    }
                }
            );
            return response.data;
        } catch (error) {
            throw new Error('Unable to fetch the response.');
        }
    }
}


module.exports = sansekai = async (client, m, chatUpdate) => {
    try {
        var body =
            m.mtype === "conversation"
                ? m.message.conversation
                : m.mtype == "imageMessage"
                    ? m.message.imageMessage.caption
                    : m.mtype == "videoMessage"
                        ? m.message.videoMessage.caption
                        : m.mtype == "extendedTextMessage"
                            ? m.message.extendedTextMessage.text
                            : m.mtype == "buttonsResponseMessage"
                                ? m.message.buttonsResponseMessage.selectedButtonId
                                : m.mtype == "listResponseMessage"
                                    ? m.message.listResponseMessage.singleSelectReply.selectedRowId
                                    : m.mtype == "templateButtonReplyMessage"
                                        ? m.message.templateButtonReplyMessage.selectedId
                                        : m.mtype === "messageContextInfo"
                                            ? m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text
                                            : "";
        var budy = typeof m.text == "string" ? m.text : "";
        var prefix = /^[\\/!#.]/gi.test(body) ? body.match(/^[\\/!#.]/gi) : "/";
        const isCmd2 = body.startsWith(prefix);
        const command = body.replace(prefix, "").trim().split(/ +/).shift().toLowerCase();
        const args = body.trim().split(/ +/).slice(1);
        const pushname = m.pushName || "No Name";
        const botNumber = await client.decodeJid(client.user.id);
        const itsMe = m.sender == botNumber ? true : false;
        let text = (q = args.join(" "));
        const arg = budy.trim().substring(budy.indexOf(" ") + 1);
        const arg1 = arg.trim().substring(arg.indexOf(" ") + 1);
        const color = (text, color) => {
          return !color ? chalk.green(text) : chalk.keyword(color)(text);
        };
        const from = m.chat;
        const reply = m.reply;
        const sender = m.sender;
        const mek = chatUpdate.messages[0];
        const tempButton = async (remoteJid, text, footer, content) => {
      // const { displayText, url, contentText, footer } = content
      //send a template message!
          const templateMessage = {
            viewOnceMessage: {
              message: {
                templateMessage: {
                  hydratedTemplate: {
                    hydratedContentText: text,
                    hydratedContentFooter: footer,
                    hydratedButtons: content,
                  },
                },
              },
            },
          };
          const sendMsg = await client.relayMessage(remoteJid, templateMessage, {});
        };
        // Group
        const groupMetadata = m.isGroup ? await client.groupMetadata(m.chat).catch((e) => {}) : "";
        const groupName = m.isGroup ? groupMetadata.subject : "";

        // Push Message To Console
        let argsLog = budy.length > 30 ? `${q.substring(0, 30)}...` : budy;

        if (isCmd2 && !m.isGroup) {
            console.log(chalk.black(chalk.bgWhite("[ LOGS ]")), color(argsLog, "turquoise"), chalk.magenta("From"), chalk.green(pushname), chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`));
        } else if (isCmd2 && m.isGroup) {
            console.log(
                chalk.black(chalk.bgWhite("[ LOGS ]")),
                color(argsLog, "turquoise"),
                chalk.magenta("From"),
                chalk.green(pushname),
                chalk.yellow(`[ ${m.sender.replace("@s.whatsapp.net", "")} ]`),
                chalk.blueBright("IN"),
                chalk.green(groupName)
            );
        }

        if (isCmd2) {
            switch (command) {
                case "help": case "menu": case "start": case "info":
                    m.reply(`*Whatsapp Bot OpenAI*
                    
*(ChatGPT)*
Cmd: ${prefix}ai 
Tanyakan apa saja kepada AI.`)
                    break;
                case "ai": case "openai": case "chatgpt": case "ask":
                    try {
                        const completion = new Completion();
                        const generatedText = await completion.create(q);
                        await m.reply(generatedText);
                    } catch (error) {
                        console.log(error);
                        m.reply("Maaf, sepertinya ada yang error :" + error.message);
                    }
                    break;
                case "cilik": case "alive":
                    m.reply("SmallUbot\n    status: smallbot | founder\n    • expired: 04-August-2026\n    • server: 1\n    • dc_id: 5\n    • ping_dc: 4.792 ms\n    • cilik_uptime: 15h:24m:9s\n\n® small bot, but lots of features");
                    break;
                case "zi": case "memek":
                    var textReply = `SmallUbot\n    status: smallbot | founder\n    • expired: 04-August-2026\n    • server: 1\n    • dc_id: 5\n    • ping_dc: 4.792 ms\n    • cilik_uptime: 15h:24m:9s\n\n® small bot, but lots of features`
                    var buttonReply = [
				        { urlButton: { displayText: `Owner 💌`, url : `https://instagram.com/irfann._x` } },
				        { urlButton: { displayText: `Source Code 🔗`, url: `https://github.com/rtwone/openai-botwa` } },
				        { urlButton: { displayText: `Share This Bot ❤️`, url: `https://api.whatsapp.com/send?`+new URLSearchParams({ text: textShare }) } }
			        ]
			        tempButton(from, textReply, '', buttonReply);
                    break;                    
                    
                default: {
                    if (isCmd2 && budy.toLowerCase() != undefined) {
                        if (m.chat.endsWith("broadcast")) return;
                        if (m.isBaileys) return;
                        if (!budy.toLowerCase()) return;
                        if (argsLog || (isCmd2 && !m.isGroup)) {
                            console.log(chalk.black(chalk.bgRed("[ ERROR ]")), color("command", "turquoise"), color(`${prefix}${command}`, "turquoise"), color("tidak tersedia", "turquoise"));
                        } else if (argsLog || (isCmd2 && m.isGroup)) {
                            console.log(chalk.black(chalk.bgRed("[ ERROR ]")), color("command", "turquoise"), color(`${prefix}${command}`, "turquoise"), color("tidak tersedia", "turquoise"));
                        }
                    }
                }
            }
        }
    } catch (err) {
        m.reply(util.format(err));
    }
};

let file = require.resolve(__filename);
fs.watchFile(file, () => {
    fs.unwatchFile(file);
    console.log(chalk.redBright(`Update ${__filename}`));
    delete require.cache[file];
    require(file);
});
