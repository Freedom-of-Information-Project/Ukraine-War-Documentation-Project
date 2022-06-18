const http = require('follow-redirects').https;
let lastIDs = { 
  reddit: {}, 
  twitter: {}
}

function getRedditPosts(notify, subreddit) {
  // TODO This is callback hell
  http.get(`https://reddit.com/${subreddit}/new.json?limit=100`, res => {
    const { statusCode } = res;
    let error;
    // Any 2xx status code signals a successful response but
    // here we're only checking for 200.
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
                        `Status Code: ${statusCode}`);
    }
    if (error) {
      console.error(error.message);
      // Consume response data to free up memory
      res.resume();
      return;
    }
    res.setEncoding('utf8')
    let data = ''
    res.on('data', d => data += d)
    res.on('end', function redditDataGot() {
      try {
        const parsed = JSON.parse(data)
        let newPosts = []
        for(let post of parsed.data.children) {
          post = post.data
          if((lastIDs.reddit[subreddit] || {})[post.id]) {
            break // Exit loop, the posts following this are already indexed
          }
          console.log("Found new post!")
          newPosts.unshift(post)
        }
        for(let post of newPosts) {
          if(post.selftext === '')
              post.selftext = post.url
          let unified = { source: 'reddit:' + subreddit.substring(2), authorName: post.author, title: post.title, text: post.selftext.replace(/\[.*?\]\((.*?)\)/g, '$1'), url: 'https://reddit.com' + post.permalink, images: [] }
          notify(unified);
          (lastIDs.reddit[subreddit] || (lastIDs.reddit[subreddit] = {}))[post.id] = 1
        }
      } catch(e) {
        console.log(e)
        console.log(data)
      }
    })
  }).on('error', console.log)
}

module.exports = function (config) {
  lastIDs = config.save.lastIDs || lastIDs
  let notifiers = []
  function getReddit() {
    for(let subreddit of config.reddit) {
      getRedditPosts( function notify(data) { for(let notifier of notifiers) notifier(data) }, subreddit)
    }
    config.save.lastIDs = lastIDs
  }
  setInterval(getReddit, 10000)
  function getTwitter() {
    // TODO implement this
  }
  setInterval(getTwitter, 10000)
  return {
    getReddit: getReddit,
    getTwitter: getTwitter,
    onPost: function onPost(notifier) {
        notifiers.push(notifier)
    }
  }
}
