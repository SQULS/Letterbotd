const Twitter = require('twitter')
const webshot = require('webshot')
const schedule = require('node-schedule')
const env = require('node-env-file')
const fs = require('fs')

env(__dirname + '/.env')

let PROFILE = process.env.LetterboxdProfile
let CONSUMER_KEY = process.env.TwitterConsumerKey
let CONSUMER_SECRET = process.env.TwitterConsumerSecret
let ACCESS_TOKEN_KEY = process.env.TwitterAccessKey
let ACCESS_TOKEN_SECRET = process.env.TwitterAccessSecret
let USERNAME = process.env.LastfmUser
let LASTFMAPIKEY = process.env.LastfmKey

const optionsMobile = {
  screenSize: {
    width: 650,
    height: 280
  },
  shotSize: {
    width: 650,
    height: 280
  },
  shotOffset: {
    left: 46,
    right: 0,
    top: 610,
    bottom: 40
  },
  userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
}

const client = new Twitter({
    consumer_key: CONSUMER_KEY,
    consumer_secret: CONSUMER_SECRET,
    access_token_key: ACCESS_TOKEN_KEY,
    access_token_secret: ACCESS_TOKEN_SECRET
})

function getFilms() {
  webshot('https://letterboxd.com/' + PROFILE, 'films.png', optionsMobile, function(err) {
    if (!err) {
      tweet()
    }
  })
}

function tweet() {

    var imgfile = fs.readFileSync('films.png')

    client.post('media/upload', {
        media: [imgfile]
    }, function (error, media, response) {

        if (!error) {

            var status = {
                status: "Recently watched films #letterboxd",
                media_ids: media.media_id_string
            }

            client.post('statuses/update', status, function (error, tweet, response) {});

        }
    })
}

getFilms()
schedule.scheduleJob('0 5 15 * * 6', function () {
    getFilms()
})
