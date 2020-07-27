var RPC = require("discord-rpc");
var lastFM = require("last-fm");
const {
    JSDOM
} = require("jsdom");
const {
    window
} = new JSDOM("");
const $ = require("jquery")(window);

const clientId = '736680578568683540';
const lastfm = new lastFM('97640b6683d032228a2844d3b1ae70c1');
const rpc = new RPC.Client({
    transport: 'ipc'
});

var track, artist, album, lastFMname;
console.log("  LastFM - Discord Rich Presence\n----------------------------------\n    Written by Sam Persinger");

//set your lastfm name here
//otherwise it wont work
lastFMname = 'YOUR_LASTFM_NAME_HERE';

async function setActivity() {

    //pulls the json form the lastFM api
    $.getJSON('http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=' + lastFMname + '&api_key=97640b6683d032228a2844d3b1ae70c1&limit=1&format=json', function(data) {
        //sets track, artist, and album variables
        track = data.recenttracks.track[0].name;
        artist = data.recenttracks.track[0].artist['#text'];
        album = data.recenttracks.track[0].album['#text'];

        //quits the loop if the app dies
        if (!rpc) {
            return;
        }

        //sets the activity on the discord profile
        //I chose a metadata scheme that matches the way spotify shows their info on discord profiles
        rpc.setActivity({
            details: track + ' by ' + artist,
            state: 'on ' + album,
            largeImageKey: 'lastfm',
            largeImageText: 'https://github.com/spersinger/LastFM-Discord-Rich-Presence',
            instance: false,
        });

    });
}

rpc.on('ready', () => {
    setActivity();

    //sets the discord rich presence every second
    setInterval(() => {
        setActivity();
    }, 1e3);
});

rpc.login({
    clientId
}).catch(console.error);