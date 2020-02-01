import React from 'react';
import * as d3 from 'd3';
import TweetEmbed from 'react-tweet-embed';
import Graph from './Graph';
import Donut from './Donut';
import TimeHistoGram from './TimeHistoGram';
import data from './dataNew.json';
import './App.css';

function App() {
  data.forEach((d,i) => {
    d['Date And Time'] = new Date(d['Date And Time'])
  })
  let dataByClassification = d3.nest()
    .key(d => d.Classification)
    .entries(data);
  let obj = {}
  let objVal = {}
  dataByClassification.forEach(d => {
    obj[d.key] = d.values.length
    objVal[d.key] = d.values
  })

  let falsehoodByCategories = d3.nest()
    .key(d => d.Category)
    .entries(objVal['Clickbait']);
  let retweetTotal = 0, retweetsAvg, likeTotal = 0,  likeAvg, truthretweetAvg, truthretweetTotal = 0, truthlikeAvg, truthlilkeTotal = 0, truthretweetTotalWoShah,truthlikesTotalWoShah;
  let NetflixretweetTotal = 0, NetflixretweetsAvg, NetflixlikeTotal = 0,  NetflixlikeAvg;
  falsehoodByCategories[5].values.forEach(d => {
    NetflixretweetTotal = NetflixretweetTotal + d.Retweet
    NetflixlikeTotal = NetflixlikeTotal + d.Likes
  })
  NetflixretweetsAvg = NetflixretweetTotal / falsehoodByCategories[5].values.length
  NetflixlikeAvg = NetflixlikeTotal / falsehoodByCategories[5].values.length
  objVal['Clickbait'].forEach(d => {
    retweetTotal = retweetTotal + d.Retweet
    likeTotal = likeTotal + d.Likes
  })
  objVal['Misinformation opposite'].forEach(d => {
    retweetTotal = retweetTotal + d.Retweet
    likeTotal = likeTotal + d.Likes
  })
  objVal['Support CAA'].forEach(d => {
    truthretweetTotal = truthretweetTotal + d.Retweet
    truthlilkeTotal = truthlilkeTotal + d.Likes
  })

  let seq = ['Support CAA','Clickbait','Trolling opposite','Misinformation opposite','Unknown']
  let key = ['Truthful Tweets','Tweets Spreading Falsehoods','Trolling + Fact Checking','Unclassified / Neutral']
  let value = [obj[seq[0]],obj[seq[1]] + obj[seq[3]],obj[seq[2]],obj[seq[4]]]
  retweetsAvg = (retweetTotal / (obj[seq[1]] + obj[seq[3]])).toFixed(1)
  likeAvg = (likeTotal / (obj[seq[1]] + obj[seq[3]])).toFixed(1)
  truthretweetAvg = (truthretweetTotal / obj[seq[0]]).toFixed(1)
  truthretweetTotalWoShah = truthretweetTotal - 6562
  truthlikesTotalWoShah = truthlilkeTotal - 21796
  truthlikeAvg = (truthlilkeTotal / obj[seq[0]]).toFixed(1)
  let truthretweetAvgWoShah = (truthretweetTotalWoShah / obj[seq[0]]).toFixed(1)
  let truthlikeAvgWoShah = (truthlikesTotalWoShah / obj[seq[0]]).toFixed(1)
  return (
    <div className="App">
      <div className="header">
          <div className='header-wrap'>
            <div className='header-title'>
              <div className='header-span'>
                Curious case of 88662 88662:<br />Misinformation and campaign on twitter
              </div>
            </div>
          </div>
      </div>
      <div className='container'>
        <div className='section-title'>
          Abstract
        </div>
        <p>
          In the first week of January a toll-free number 88662 88662 was shared by the Indian government asking people to give a missed call on this number to show their support to controversial Citizenship Amendment Act 2019. [<a href='https://en.wikipedia.org/wiki/Citizenship_(Amendment)_Act,_2019' target='_blank'  rel="noopener noreferrer">wiki article</a>] <br /> <br /> In a few day the number was shared thousands of time by differnet users and soon reports started coming in how this number was shared by promising tantalising offers for people who called the number [<a href='https://scroll.in/article/948826/from-sex-to-netflix-subscriptions-heres-what-was-promised-for-dialling-bjps-caa-support-line' target='_blank'  rel="noopener noreferrer">News report here</a>].<br /><br />I was interested in the extend and spread of misinformation campaign on Twitter. Therefore I scraped around 3600 tweets (from 2nd Jan 2020 to 5th Jan 2020) that mentioned this number and analyzed the content of these tweets. I was mainly interested in:
        </p>
        <ol>
          <li>Extend of the misinformation i.e. tweets encouraging social-media users to call the toll-free number but concealed the exactly function of the line.</li>
          <li>Spread of the misinformation i.e. retweets and likes for tweets encouraging social-media users to call the toll-free number but concealed the exactly function of the line.</li>
          <li>Different types of misinformation campaigns</li>
        </ol>
        <p>  
          <span className="italics">Please note.: The intention here is not to make a statement about the Citizenship Amendment Act but to analyze how twitter is used to promote misinformation.</span>
        </p>
        <hr />
        <div className='section-title'>
          Challenges
        </div>
        <p>
          As mentioned above the idea is to classify the tweets in different categories (clusters) and sub categories. This task was callenging as there is no training set for these kind of classification. Many tweets were in latin script but the language was Hindi. Another big challenge was the presence of images and videos in the tweets which could not be analyzed textually. <br /><br />There were also many restrictions set by Twitter through API Limits. Rate limits are also divided into 15 minute intervals with a limit of 180 requests. <br /><br /> Because of the above challenges the data set is only 3589 tweets (to make it managable)
        </p>
        <hr />
        <div className='section-title'>
          Data Collection {`&`} Methodology
        </div>
        <p>
          The data was collected using Tweepy and Twitter API in Python. The data set has <span className="bold red">3589 tweets</span>, tweeted from <span className="italics">2nd Jan 2020 to 5th Jan 2020</span> mentioning '8866288662' or '88662-88662' in the content. The data and analysis only focus on the time window of 3 days mentioned and was last updated on 20th Jan 2020 (so its possible the retweet and likes amount are not updated and many users accounts might now be inactive or suspended). The whole data set can be downloaded here. <br /><br />First round of classification is done using keyword search. For ex. if a tweet had 'CAA' or 'CAB' and 'support' mentioned then it was classified to category of tweets which supported CAA but if it didn't mention those things and mentioned 'free netflix subscription' then it was classified to category of tweet which spread misinformation. After this prelimanary tagging a secondary manual tagging was done for the tweets which could not fall under these categories.
        </p>
        <ol>
          <li><span className="bold">Truthful Tweets</span>: Tweets encouraging twitter user to give give a missed call on the number to support the Citizenship Amendment Act (the original intention of the number)</li>
          <li><span className="bold">Tweets Spreading Falsehoods</span>: Tweet encouraging user to call on number based on tantalising offer and tweets discourging user to call on the number based on fake news.</li>
          <li><span className="bold">Trolling + Fact Checking</span>: Tweets which troll or fact checked the users that shared the tweets spreading misinformation and the tweets spreading misinformation</li>
          <li><span className="bold">Unclassified / Neutral</span>: Tweets which I was not able to classify in any of the above category either because of lack of context or the content of the tweet was neutral</li>
        </ol>
        <hr />
        <div className='section-title'>
          Key Findings
        </div>
        <p>
          Of <span className="bold">{data.length}</span> tweets analyzed, <span className="bold truthfull">{obj['Support CAA']}</span> tweets are truthful tweets, <span className="bold red">{obj['Clickbait'] + obj['Misinformation opposite']}</span> tweets spreads falsehoods, <span className="bold troll">{obj['Trolling opposite']}</span> tweets are tweets trolling other users and <span className="bold unknown">{obj['Unknown']}</span> tweets are either neutral or unclassified.
        </p>
        <div className='red quote'>Around <span className='bold'>1 in 3 ({((obj['Clickbait'] + obj['Misinformation opposite']) * 100 / data.length).toFixed(1)}%)</span> tweets that mentions 88662 88662 spreads <span className="bold">falsehood</span></div>
        <Donut 
           total={data.length}
           text={'total tweets'}
           width = {720}
           height = {400}
           color={['#c0ca33','#e03e3e','#ff9800','#aaa']}
           keyValue={key}
           keyPos={[425,250]}
           radius={200}
           value={value}
           dx={-22}
           dx1={20}
           dy={30}
           dy1={30}
        />
        <hr />
        <p>
          <span className="bold">Timeline of tweeting</span>
          <TimeHistoGram 
            data={data}
            graphHeight={150}
            width={720}
            height={425}
            color={['#c0ca33','#e03e3e','#ff9800']}
            overlap = {50}
          />
        </p>
        <hr />
        <span className="bold">Types of falsehoods</span>
        <p>
          Tweets spreads falsehoods can be further divided in 2 categories: tweets encouraging users to call using falsehoods and tweets discourging users to call using falsehood.
        </p>
        <div className='red quote'><span className='bold'>{( obj['Clickbait'] * 100 / (obj['Clickbait'] + obj['Misinformation opposite'])).toFixed(1)}%</span> of tweets spreading falsehoods ecourage users to call the number on the basis of tantalising offers. Therefore, it can be said that a vast majority of tweets spreading falsehood are in favour of the act</div>
        <Donut 
           total={obj['Clickbait'] + obj['Misinformation opposite']}
           text={'falsehood tweets'}
           width = {720}
           height = {400}
           color={['#e03e3e','#aaa']}
           keyValue={['Tweets encouraging to call', 'Tweets discouraging to call']}
           keyPos={[425,300]}
           radius={200}
           value={[obj['Clickbait'],obj['Misinformation opposite']]}
           dx={0}
           dx1={0}
           dy={-15}
           dy1={30}
        />
        <p>
          A lot of bizzare promises we made for dialing the number. 
        </p>
        <div className='red quote'>Around <span className='bold'>1 in 9 (10.5%)</span> all tweets promised sex or hot chat with hot girls or 72 virgins or porn site subscription by giving a call at this number</div>
        <br />
        <p>Some of the most shared or popular and bizzare categories of tweets are:</p>
        <ol>
        <li><span className="bold">Tweets promising free sex or hot chat with hot girls or 72 virgins or porn site subscription</span>: There are <span className="bold">377</span> tweet (around <span className="bold">1 in 9</span> tweets) promised either free sex, hot chats or promised this is phone number is of porn stars or film actresses. Tweets in this category are like<span className="italics">“Hey TweetHearts Save my number {`&`} Call me 8866288662”</span> or <span className='italics'>“Too bored today, so ready to share my number with all my followers”</span></li>
          <li><span className="bold">Tweets promising Free netflix subscription</span>: This is by far the most retweeted or popular false promise. On average this was retweeted about <span className="bold">{Math.round(NetflixretweetsAvg)}</span> times and liked about <span className="bold">{Math.round(NetflixlikeAvg)}</span> times. An example of tweet of such kind: <span className="italics">"@MuralikrishnaE1 Thanks, #NetFlix I got my 6 Months free subscription by calling 8866288662"</span></li>
          <li><span className="bold">Tweets promising Free offers like data plans, free pizzas, photoshop subscription, jobs and even Rs. 15 Lac in the account</span>: Tweets like <span className="italics">"#Jio Maha offer- Call on this no. And get 10 GB data. 8866288662"</span>, <span className="italics">"For free pizza call this number now. Offer valid only till 6 PM today  8866288662"</span> or <span className='italics'>"Breaking: Modi govt is finally giving 15 Lakhs to people. But you have to call 8866288662 today to register. Hurry up. Call NOW.  That number again 8866288662"</span></li>
          <li><span className="bold">Tweets promising Babri Masjid back</span>: This is small minority of tweet but with very communal content like <span className="italics" >"Want ur Masjid back? okay give a Simple Call on #8866288662 and get Rs 64.60 Talk time Voting Started now https://t.co/jXccqTNMJC"</span></li>
          <li><span className="bold">Tweets saying calling this number to register you protest against BJP or to support the protest against CAA:</span> This category of tweets was targeted specifically toward the people who are either opposing the act or are anti-BJP or Congrass or AAP supporters. The content in this category varied from supporting Rahul Gandhi to be next Congress president to supporting Arvind Kejriwal to be the next CM of Delhi.</li>
        </ol>
        <br />
        <hr />
        <p>
          <span className="bold">Spread of truthful tweets and falsehood</span>
        </p>
        <p>The most popular tweets was not surprisingly by <a href="https://twitter.com/AmitShah" target="_blank" rel="noopener noreferrer" className="bold">Mr Amit Shah</a> (home minister of India)</p>
        <div className='tweet-container'>
          <TweetEmbed className={'twt'} id={'1213075048535166977'} placeholder={'loading'} />
        </div>
        <br />
        <div className='red quote'>On average, truthful tweets are retweeted about <span className='bold'>{Math.round(truthretweetAvg)}</span> and liked about <span className='bold'>{Math.round(truthlikeAvg)}</span> times. But if you remove the no. of retweets and likes Mr. Amit Shah's (Home Minister of India) got the average no. of retweets and likes drops down to <span className='bold'>{Math.round(truthretweetAvgWoShah)}</span> and <span className='bold'>{Math.round(truthlikeAvgWoShah)}</span> respectively (number very close or same as that of tweets spreading falsehoods).</div>
        <br />
        <div className='red quote'>On average, tweets spreading falsehood are retweeted about <span className='bold'>{Math.round(retweetsAvg)}</span> and liked about <span className="bold">{Math.round(likeAvg)}</span> times</div>
        <br />
        <div className='red quote'>On average, tweet promising Netflix subscription by calling this number was retweeted <span className='bold'>{Math.round(NetflixretweetsAvg)}</span> and liked about <span className='bold'>{Math.round(NetflixlikeAvg)}</span> times. The averag user engagement with the tweet with this falsehood was even higher than the average user engagement with the truthful tweets.</div>
        <br />
        <hr />
      </div>
      <Graph
        width={window.innerWidth - 50}
        height={825}
        data={data}
      />
    </div>
  );
}

export default App;
