require("dotenv").config();

var twitter = require('twitter')
var keys = require('./keys')
var request = require('request')
var fs = require('fs')
var Spotify = require('node-spotify-api')

// Get rid of first two args
process.argv.shift()
process.argv.shift()

// Get command and argument
var command = process.argv.shift()
var argument = process.argv.shift()

runCommand(command, argument)

function runCommand(command, argument) {
    if (command === `my-tweets`) {
        var client = new twitter(keys.twitter)
        client.get('statuses/user_timeline', {
            Name: 'RandallOlson13',
            count: 20
        }, (error, tweets, response) => {
            if (error) {
                console.error(error.message)
            } else {
                console.log(tweets.map(tweet => {
                    return {
                        date: tweet.created_at,
                        text: tweet.text
                    }
                }))
            }
        })
    } else if (command === `spotify-this-song`) {
        var song = argument || 'The Sign'

        var spotify = new Spotify(keys.spotify);

        spotify
            .request('https://api.spotify.com/v1/search?type=track&limit=1&q=' + song)
            .then(function (data) {
                console.log(JSON.stringify(data));
            })
            .catch(function (error) {
                console.error('Error occurred: ' + error);
            })


    } else if (command === `movie-this`) {

        var movie = argument || 'Mr. Nobody,'

        var options = {
            url: keys.omdb + movie
        }
        request(options, (error, response, body) => {
            if (error) {
                console.error(error.message)
            } else {
                body = JSON.parse(body)
                var details = {
                    Title: body.Title,
                    Year: body.Year,
                    Ratings: {
                        IMDB: body.Ratings.find(rating => rating.Source === 'Internet Movie Database').Value,
                        Rotten_Tomatoes: body.Ratings.find(rating => rating.Source === 'Rotten Tomatoes').Value
                    },
                    Country: body.Country,
                    Language: body.Language,
                    Plot: body.Plot,
                    Actors: body.Actors
                }
                console.log(details)
            }
        })
    } else if (command === `do-what-it-says`) {
        fs.readFile('random.txt', {
            encoding: 'utf-8'
        }, function (error, data) {
            if (error) {
                console.error(error.message)
            } else {
                var args = data.split(',')

                // Get command and argument
                var command = args.shift()
                var argument = args.shift()

                runCommand(command, argument)
            }
        })
    }
}