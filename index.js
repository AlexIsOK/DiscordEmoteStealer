#!

const Discord = require("discord.js-light");
const request = require("request");
const fs      = require("fs");

const client = new Discord.Client();

const BASE_URL = "https://cdn.discordapp.com/emojis/"


/**
 * Download a file locally to the disk.
 * 
 * @param url {string} the URL to download.
 * @param file {string} the location of the file to download to.
 * @param cb {function} the callback.
 */
function download(url, file, cb) {
    request.head(url, function(err) {
        if(err) throw err;
        
        request(url).pipe(fs.createWriteStream(file))
                    .on('close', cb);
    });
}

client.on("message", (msg) => {
    
    if(msg.content.startsWith(".st")) {
        const emotes = msg.content.split(">");
        
        console.log(`stealing ${emotes.length - 1} emotes from the message`);
        console.log(`see the README on the repository if you need help, or create an issue on github.`);
        
        msg.channel.send("stealing emotes");
        
        emotes.forEach(async (m) => {
            const emoteName = m.split(":")[1];
            const emoteID = m.split(":")[2];
            
            if(emoteID && !emoteID.match("^[0-9]+"))
                return;
            
            const url = BASE_URL + emoteID;
            try {
                download(url, `./stolen_emotes/${emoteName}.gif`, () => {});
            } catch(e) {
                console.log(`Could not download ${url}`);
            }
        });
        
        msg.channel.send("done, emotes have saved to " + __dirname.replace(/\\/g, "/") + "/stolen_emotes/");
    }
    
});

client.login(require("./config.json").token);
