if (module.hot) {
    module.hot.accept();
}

$(document).ready(()=>{    
    const mytweets = require('./tweets').default;
    
    console.log(localStorage.getItem("state"))
    if(localStorage.getItem("state") == undefined){
        localStorage.setItem("state", "relative");
        
    }


    // MANAGE DATE

    function setDateFormat(string){
        localStorage.setItem('state', string);
        getTweets(mytweets)
        
    }

    function getAbsoluteDate(date){
        var time =  new Date(date);
        var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

        const month = time.getUTCMonth() + 1;
        const day = time.getUTCDate();
        return time = (day+" "+monthNames[month]);

        //console.log(time);
    }

    function getRelativeDate(date){
        var time =  new Date(date);
        
        const oneDay = 24*60*60*1000;
        const today = new Date();
        time = Math.round(Math.abs((today.getTime() - time.getTime())/(oneDay)));
        var tail = " days ago"
        if(time > 30){
            time /=30
            tail =" months ago"
        }
        if(time > 12){
            time/=12
            tail =" years ago"
            
        }

        time = Math.floor(time);
        return time += tail;
        
        //console.log(time += tail)

    }



    function manageDate(date, state){
        if(state == "absolute"){
        return getAbsoluteDate(date)
        } else if(state == "relative") {
        return getRelativeDate(date)
        }

    }


    // FIND DIFFERENT PATTERNS LIKE URLS, USERS OR HASHTAGS

    function findHashtags(text){
        var hashtags = text.match(/#\w+/gi)
        if(hashtags){
            hashtags.forEach((hashtag)=>{
                var hashtagTail = hashtag.replace('#', '');
                text = text.replace(hashtag, '<a href="https://twitter.com/hashtag/'+ hashtagTail+'">'+hashtag+'</a>')
            })
        }
        return text;
    }


    function findUsers(text){
        var users = text.match(/@\w+/gi)
        if(users){
            users.forEach((user)=>{
                var username = user.replace('/@/', "");
                text = text.replace(user, '<a href="https://twitter.com/'+ username+'">'+user+'</a>')
            })
        }
        return text;
    }

    function findUrls(text){
        var urls = text.match(/\w+(:\/\/)+\w+\W\w+(\W\w+)/gi)
        if(urls){
            urls.forEach((url)=>{
                text = text.replace(url, '<a href="'+ url+'">'+url+'</a>')
            })
        }
        return text;
    }

    // FUNCTION FOR APPLYING THE FINDERS

    function manageTags(text){
        var newText = findUrls(text)
        newText = findUsers(newText)
        newText = findHashtags(newText)
        return newText;
    }


    // FUNCTION FOR GETTING ALL TWEETS

    function getTweets(){
        $('.content').empty();
        mytweets.forEach((tweet, idx)=>{
            if(idx < 5){
                var newTweet = createHtml(tweet);
                printingTweet(newTweet);
            }
         
        })

    }

    // FUNCTION FOR CREATING HTML

    function createHtml(tweet){
        const html = `<div class="tweet-item"><img class="tweet-item__tweet-image" src="https://pbs.twimg.com/profile_images/767691156469710848/cvN7l6RQ_400x400.jpg">
        <div class="tweet-item__tweet-info">
            <div class="tweet-info__user">
                <p><a href="https://twitter.com/${tweet.user.screen_name}" class="username">${tweet.user.name}</a><a href="https://twitter.com/${tweet.user.screen_name}" class="hidden nick">@${tweet.user.screen_name}</a></p>
                <span class="date">`+ manageDate(tweet.created_at, localStorage.getItem("state"))+`</span>
            </div>
        
            <div class="tweet-info__text">`
            + manageTags(tweet.text)+
            `</div>
        </div>
        </div>`;

        return html;
    }


    // FUNCTION FOR PRINTING HTML

    function printingTweet(tweet){
        $('.content').append(tweet);

    }


    getTweets(mytweets)

    // getDates(mytweets)


    $('.date').click(function(e){
        e.preventDefault();
        let state = $(this).attr("state")
        localStorage.setItem("state", state)
        getTweets(mytweets)
        
    })  

    // toggle_menu

    $('.site-menu__toggle').click(()=>{
        $('.site-menu__list').toggleClass('hidden')
    })

})