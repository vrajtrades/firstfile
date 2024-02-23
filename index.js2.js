const Discord = require('discord.js');
const Twit = require('twit');

const discordClient = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
  ],
});

const twitterClient = new Twit({
  consumer_key: 'YOUR_TWITTER_CONSUMER_KEY',
  consumer_secret: 'YOUR_TWITTER_CONSUMER_SECRET',
  access_token: 'YOUR_TWITTER_ACCESS_TOKEN',
  access_token_secret: 'YOUR_TWITTER_ACCESS_TOKEN_SECRET',
});

const twitterUserToTrack = 'TwitterUsername'; // Replace with the Twitter username you want to track
const discordChannelId = 'YOUR_DISCORD_CHANNEL_ID'; // Replace with your Discord channel ID

discordClient.on('ready', () => {
  console.log(`Logged in as ${discordClient.user.tag}`);
  startTwitterStream();
});

function startTwitterStream() {
  const stream = twitterClient.stream('statuses/filter', { follow: getUserID(twitterUserToTrack) });

  stream.on('tweet', (tweet) => {
    if (tweet.user.screen_name === twitterUserToTrack) {
      postTweetToDiscord(tweet);
    }
  });

  stream.on('error', (error) => {
    console.error('Twitter Stream Error:', error);
  });
}

function postTweetToDiscord(tweet) {
  const channel = discordClient.channels.cache.get(discordChannelId);

  if (channel) {
    channel.send(`New tweet from ${tweet.user.screen_name}: ${tweet.text}`);
  }
}

function getUserID(username) {
  return twitterClient
    .get('users/show', { screen_name: username })
    .then((user) => user.id_str)
    .catch((error) => {
      console.error('Twitter User ID Error:', error);
      process.exit(1);
    });
}

discordClient.login('YOUR_DISCORD_BOT_TOKEN'); // Replace with your Discord bot token

