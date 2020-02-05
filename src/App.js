import React from 'react';
import * as d3 from 'd3';
import TweetEmbed from 'react-tweet-embed';
import {
  FacebookShareButton,
  TwitterShareButton
} from 'react-share';
import {
  FacebookIcon,
  TwitterIcon,
} from 'react-share';
import ReactGA from 'react-ga';
import Graph from './Graph';
import Donut from './Donut';
import BubblechartCanvas from './BubblechartCanvas';
import TimeHistoGram from './TimeHistoGram';
import data from './data.json';
import supportWordCount  from './supportWordCount.json';
import misinfoWordCount  from './misinfoWordCount.json';
import trollWordCount  from './trollWordCount.json';
import './App.css';

ReactGA.initialize('UA-157554344-1');
ReactGA.set({ anonymizeIp: true });
ReactGA.pageview('/');

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
    .entries(objVal['Misinformation by Pro-CAA Users']);
  let retweetTotal = 0, retweetsAvg, likeTotal = 0,  likeAvg, truthretweetAvg, truthretweetTotal = 0, truthlikeAvg, truthlilkeTotal = 0, truthretweetTotalWoShah,truthlikesTotalWoShah;
  let NetflixretweetTotal = 0, NetflixretweetsAvg, NetflixlikeTotal = 0,  NetflixlikeAvg;
  falsehoodByCategories[4].values.forEach(d => {
    NetflixretweetTotal = NetflixretweetTotal + d.Retweet
    NetflixlikeTotal = NetflixlikeTotal + d.Likes
  })
  NetflixretweetsAvg = NetflixretweetTotal / falsehoodByCategories[4].values.length
  NetflixlikeAvg = NetflixlikeTotal / falsehoodByCategories[4].values.length
  objVal['Misinformation by Pro-CAA Users'].forEach(d => {
    retweetTotal = retweetTotal + d.Retweet
    likeTotal = likeTotal + d.Likes
  })
  objVal['Misinformation by Anti-CAA Users'].forEach(d => {
    retweetTotal = retweetTotal + d.Retweet
    likeTotal = likeTotal + d.Likes
  })
  objVal['Support CAA'].forEach(d => {
    truthretweetTotal = truthretweetTotal + d.Retweet
    truthlilkeTotal = truthlilkeTotal + d.Likes
  })

  let seq = ['Support CAA','Misinformation by Pro-CAA Users','Fact check + Trolling','Misinformation by Anti-CAA Users','Unknown']
  let key = ['Truthful Tweets','Tweets Spreading Falsehoods','Fact Checking + Trolling','Unclassified / Neutral']
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
                Curious Case of 88662 88662:<br />Influence Campaign {`&`} Misinformation on Twitter
              </div>
            </div>
          </div>
      </div>
      <div className="share-header">
        <div className='share share-top'>
          <span className='footer-start'>Share the <span aria-label="love-emoji" role="img">💖</span></span>
          <div className='icons'>
            <FacebookShareButton url='https://influence-campaign-on-twitter-visualized.netlify.com/' quote="Curious case of 88662 88662: Misinformation and campaign on Twitter: ">
              <FacebookIcon size={32} round={true} />
            </FacebookShareButton>
            <TwitterShareButton url='https://influence-campaign-on-twitter-visualized.netlify.com/' title="Curious case of 88662 88662: Misinformation and campaign on Twitter: ">
              <TwitterIcon size={32} round={true} />
            </TwitterShareButton>
          </div>
        </div>
        <div className='reading-time'>Reading time: 7 - 10 mins</div>
      </div>
      
      <div className='container'>
        <div className='content-table'>
          <div className='section-title'>
            Content
          </div>
          <div className='content-list-div'>
            <ol>
              <li className='content-list'><a href="#abstract">Abstract</a></li>
              <li className='content-list'><a href="#challenges">Challenges</a></li>
              <li className='content-list'><a href="#data-collection">Data collection {`&`} methodology</a></li>
              <li className='content-list'><a href="#findings">Key findings</a></li>
              <li className='content-list'><a href="#lexicon-viz">Lexicon of different categories</a></li>
              <li className='content-list'><a href="#viz">All tweets visualization</a></li>
              <li className='content-list'><a href="#conclusion">Conclusion</a></li>
            </ol>
          </div>
        </div>
        <hr />
        <div className='section-title' id='abstract'>
          Abstract
        </div>
        <p>
          In the first week of January a toll-free number 88662 88662 was shared by the Indian government asking people to give a missed call on this number to show their support for the Citizenship Amendment Act 2019. [<a href='https://en.wikipedia.org/wiki/Citizenship_(Amendment)_Act,_2019' target='_blank'  rel="noopener noreferrer">wiki article</a>] <br /> <br /> In a few day the number was shared thousands of times by differnet users and soon reports started coming in how this number was shared by promising tantalising offers for people who called the number. [<a href='https://scroll.in/article/948826/from-sex-to-netflix-subscriptions-heres-what-was-promised-for-dialling-bjps-caa-support-line' target='_blank'  rel="noopener noreferrer">News report here</a>]<br /><br />I was interested in the extend and spread of misinformation campaign on Twitter. Therefore I scraped 3589 tweets <span className="italics">(tweeted from 10:00 AM of 2nd Jan 2020 to 10:00 PM of 5th Jan 2020)</span> that mentioned this number and then I analyzed the content of these tweets. I was mainly interested in:
        </p>
        <ol>
          <li>Extend of the misinformation i.e. tweets encouraging social-media users to call the toll-free number but concealed the exactly function of the number.</li>
          <li>Spread of the misinformation i.e. retweets and likes for tweets encouraging social-media users to call the toll-free number but concealed the exactly function of the number.</li>
          <li>Different types of misinformation campaigns</li>
        </ol>
        <p>  
          <span className="italics">Please note.: The intention here is not to make a statement about the Citizenship Amendment Act but to analyze how twitter is used to promote misinformation. I used this because of this being topical and to see if the reports suggesting about misinformation about the number on twitter were anecdotal or does the data suggest that the tweets promoting falsehoods were a substantial percentage of all the tweets.</span>
        </p>
        <hr />
        <div className='section-title' id="challenges">
          Challenges
        </div>
        <p>
          As mentioned above the idea is to classify the tweets in different categories (clusters) and sub categories. This task was callenging as there is no training set for these kind of classification. Many tweets were in latin script but the language was Hindi. Another big challenge was the presence of images and videos in the tweets which could not be analyzed textually. <br /><br />There were also many restrictions set by Twitter through API Limits. Rate limits are also divided into 15 minute intervals with a limit of 180 requests. <br /><br /> Because of the above challenges the data set is only 3589 tweets (to make it managable)
        </p>
        <hr />
        <div className='section-title' id='data-collection'>
          Data Collection {`&`} Methodology
        </div>
        <p>
          The data was collected using Tweepy and Twitter API in Python. The data set has <span className="bold red">3589 tweets</span>, tweeted from <span className="italics">10:00 AM of 2nd Jan 2020 to 10:00 PM of 5th Jan 2020</span> mentioning '8866288662' or '88662-88662' in the content. The data and analysis only focus on the time window of 3 days mentioned and was last updated on 20th Jan 2020 (so its possible the retweet and likes amount are not updated and many users accounts might now be inactive or suspended). The whole data set can be downloaded <a href="./data.json" target="_blank" rel="noopener noreferrer">here</a>. <br /><br />First round of classification is done using keyword search. For ex. if a tweet had 'CAA' or 'CAB' and 'support' mentioned and words like 'Netflix' or 'free offer' are <span className='bold'>not</span> mentioned then it was classified to category of tweets which supported CAA (truthful tweets) but if it didn't mention those things and mentioned 'free netflix subscription' then it was classified to category of tweet which spread misinformation. After this prelimanary tagging a secondary manual tagging was done for the tweets which could not fall under these categories.
        </p>
        <ol>
          <li><span className="bold">Truthful Tweets</span>: Tweets encouraging twitter user to give give a missed call on the number to support the Citizenship Amendment Act (the original intention of the number)</li>
          <li><span className="bold">Tweets Spreading Falsehoods</span>: Tweets encouraging user to call on number based on tantalising offer and tweets discourging user to call on the number based on fake news.</li>
          <li><span className="bold">Fact Checking + Trolling</span>: Tweets which fact check or troll the users that shared the tweets spreading misinformation and the tweets spreading misinformation</li>
          <li><span className="bold">Unclassified / Neutral</span>: Tweets which I was not able to classify in any of the above category mainly because of lack of context or because the content of the tweet seemed neutral to me</li>
        </ol>
        <hr />
        <div className='section-title' id='findings'>
          Key Findings
        </div>
        <p>
          Of <span className="bold">{data.length}</span> tweets analyzed, <span className="bold truthfull">{obj['Support CAA']}</span> tweets are truthful tweets, <span className="bold red">{obj['Misinformation by Pro-CAA Users'] + obj['Misinformation by Anti-CAA Users']}</span> tweets spreads falsehoods, <span className="bold troll">{obj['Fact check + Trolling']}</span> tweets are tweets trolling other users and <span className="bold unknown">{obj['Unknown']}</span> tweets are either neutral or unclassified.
        </p>
        <br />
        <div className='red quote'>Around <span className='bold'>1 in 3 ({((obj['Misinformation by Pro-CAA Users'] + obj['Misinformation by Anti-CAA Users']) * 100 / data.length).toFixed(1)}%)</span> tweets that mentions 88662 88662 spreads <span className="bold">falsehood</span></div>
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
        </p>
        <TimeHistoGram 
          data={data}
          graphHeight={150}
          width={720}
          height={425}
          color={['#c0ca33','#e03e3e','#ff9800']}
          overlap = {50}
        />
        <hr />
        <span className="bold">Types of falsehoods</span>
        <p>
          Tweets spreading falsehoods can be further divided in 2 categories:
        </p>
        <ol>
          <li>Tweets <span className="bold">encouraging</span> users to call using falsehoods</li>
          <li>Tweets <span className="bold">discourging</span> users to call using falsehood</li>
        </ol>
        <br />
        <div className='red quote'><span className='bold'>{( obj['Misinformation by Pro-CAA Users'] * 100 / (obj['Misinformation by Pro-CAA Users'] + obj['Misinformation by Anti-CAA Users'])).toFixed(1)}%</span> of tweets spreading falsehoods <span className="bold">encouraged</span> users to call the number on the basis of tantalising offers. Therefore, it can be said that a vast majority of tweets spreading falsehood are from the side that is in support of the act</div>
        <Donut 
           total={obj['Misinformation by Pro-CAA Users'] + obj['Misinformation by Anti-CAA Users']}
           text={'falsehood tweets'}
           width = {720}
           height = {400}
           color={['#e03e3e','#aaa']}
           keyValue={['Tweets encouraging to call', 'Tweets discouraging to call']}
           keyPos={[425,300]}
           radius={200}
           value={[obj['Misinformation by Pro-CAA Users'],obj['Misinformation by Anti-CAA Users']]}
           dx={0}
           dx1={0}
           dy={-15}
           dy1={30}
        />
        <p>
          A lot of bizzare promises we made for dialing the number. 
        </p>
        <br />
        <div className='red quote'>Around <span className='bold'>1 in 9 ({((falsehoodByCategories[0].values.length + falsehoodByCategories[5].values.length) * 100 / data.length).toFixed(1)}%)</span> tweets that mentioned the number promised sex or hot chat with hot girls or 72 virgins or porn site subscription by giving a call on the number</div>
        <br />
        <p>Some of the most shared or popular and bizzare categories of tweets are:</p>
        <ol>
        <li><span className="bold">Tweets promising free sex or hot chat with hot girls or 72 virgins or porn site subscription</span>: There are <span className="bold">{falsehoodByCategories[0].values.length + falsehoodByCategories[5].values.length}</span> tweet (around <span className="bold">1 in 9</span> tweets) promised either free sex, hot chats or promised this is phone number is of porn stars or film actresses. Tweets in this category are like<span className="italics">“Hey TweetHearts Save my number {`&`} Call me 8866288662”</span> or <span className='italics'>“Too bored today, so ready to share my number with all my followers”</span></li>
          <li><span className="bold">Tweets promising free Netflix subscription</span>: This is by far the most retweeted or shared false promise. On average this was retweeted about <span className="bold">{Math.round(NetflixretweetsAvg)}</span> times and liked about <span className="bold">{Math.round(NetflixlikeAvg)}</span> times. An example of tweet of such kind: <span className="italics">"@MuralikrishnaE1 Thanks, #NetFlix I got my 6 Months free subscription by calling 8866288662"</span></li>
          <li><span className="bold">Tweets promising free offers like data plans, free pizzas, photoshop subscription, jobs and even Rs. 15 Lac in the account</span>: Tweets like <span className="italics">"#Jio Maha offer- Call on this no. And get 10 GB data. 8866288662"</span>, <span className="italics">"For free pizza call this number now. Offer valid only till 6 PM today  8866288662"</span> or <span className='italics'>"Breaking: Modi govt is finally giving 15 Lakhs to people. But you have to call 8866288662 today to register. Hurry up. Call NOW.  That number again 8866288662"</span></li>
          <li><span className="bold">Tweets promising "Babri Masjid back"</span>: This is small minority of tweet but with very communal content like <span className="italics" >"Want ur Masjid back? okay give a Simple Call on #8866288662 and get Rs 64.60 Talk time Voting Started now https://t.co/jXccqTNMJC"</span></li>
          <li><span className="bold">Tweets saying calling this number to register you protest against BJP or to support the protest against CAA:</span> This category of tweets was targeted specifically toward the people who are either opposing the act or are anti-BJP(the ruling party) or Indian National Congress or Aam Aadmi Party supporters. The content in this category varied from supporting Rahul Gandhi to be next Congress president to supporting Arvind Kejriwal to be the next CM of Delhi to supporting the protest against the act.</li>
        </ol>
        <br />
        <hr />
        <p>
          <span className="bold">Spread of truthful tweets and falsehoods</span>
        </p>
        <p>The most popular tweets, not surprisingly, was by <a href="https://twitter.com/AmitShah" target="_blank" rel="noopener noreferrer" className="bold">Mr Amit Shah</a> (home minister of India)</p>
        <div className='tweet-container'>
          <TweetEmbed className={'twt'} id={'1213075048535166977'} placeholder={'loading'} />
        </div>
        <br />
        <div className='red quote'>On average, truthful tweets are retweeted about <span className='bold'>{Math.round(truthretweetAvg)}</span> and liked about <span className='bold'>{Math.round(truthlikeAvg)}</span> times. But if you remove the no. of retweets and likes Mr. Amit Shah's (Home Minister of India) got the average no. of retweets and likes drops down to <span className='bold'>{Math.round(truthretweetAvgWoShah)}</span> and <span className='bold'>{Math.round(truthlikeAvgWoShah)}</span> respectively (number very close or same as that of tweets spreading falsehoods).</div>
        <br />
        <div className='red quote'>On average, tweets spreading falsehood are retweeted about <span className='bold'>{Math.round(retweetsAvg)}</span> and liked about <span className="bold">{Math.round(likeAvg)}</span> times</div>
        <br />
        <div className='red quote'>On average, tweet promising <span className="bold">Netflix subscription</span> by calling this number was retweeted <span className='bold'>{Math.round(NetflixretweetsAvg)}</span> and liked about <span className='bold'>{Math.round(NetflixlikeAvg)}</span> times. The average user engagement with the tweet with this falsehood was even higher than the average user engagement with the truthful tweets.</div>
        <br />
        <hr />
        <div className='section-title' id='lexicon-viz'>
          Lexicon of different categories
        </div>
        <p>
          The visualization below visualizes the 50 most commont words and emojis (after removing stop words and stemming) used in the tweets of different categories
        </p>
      </div>
      <br />
      <div className='lexicon-visual'>
        <BubblechartCanvas
          data={supportWordCount}
          width={500}
          height={500}
          color={'#c0ca33'}
          maxRadius={75}
          maxValue={10}
          text={'Truthful Tweets'}
        />
        <BubblechartCanvas
          data={misinfoWordCount}
          width={500}
          height={500}
          color={'#e03e3e'}
          maxRadius={75}
          maxValue={10}
          text={'Tweets Spreading Falsehoods'}
        />
        <BubblechartCanvas
          data={trollWordCount}
          width={500}
          height={500}
          color={'#ff9800'}
          maxRadius={75}
          maxValue={10}
          text={'Fact Checking + Trolling'}
        />
      </div>
      <br />
      <div className='container'>
        <hr />
      </div>
      <br />
      <br />
      <div id='viz'>
        <Graph
          width={window.innerWidth - 50}
          height={650}
          data={data}
        />
      </div>
      <div className="container1">
        <hr />
        <div className='section-title' id="conclusion">
          Conclusion
        </div>
        <p>
          Although this is very small subset of all the available tweets, this helps us to see a pattern. It highlights the big problem with getting infomation from Twitter. <br /><br /> <span className="italics">"Fake news is perfect for spreadability: It’s going to be shocking, it’s going to be surprising, and it’s going to be playing on people’s emotions, and that’s a recipe for how to spread misinformation"</span>, Miriam Metzger, a UC Santa Barbara communications researcher explained to a <a href="https://www.vox.com/" target="_blank" rel="noopener noreferrer">Vox</a> reporter [<a href="https://www.vox.com/science-and-health/2018/3/8/17085928/fake-news-study-mit-science" target="_blank" rel="noopener noreferrer">article here</a>]. It seems that the same strategy was used here to promote the number.<br /><br />Many times trolling help to achieve the goal it aims to defeat, as it promotes the same thing it aims to impede.<span className='italics bold'> As there is no such thing as bad PR, if no one has heard of you.</span> For example in this case some of the trolling tweets were shared hundreds of time (as trolling tweets are generally shared more time than fact checking tweets), which although make fun of the tweets spreading falsehood, also helped spreading the number and therefore helping to promote it.<br /><br />These visualizations can also be used to identify bots or paid accounts by looking at the users who have  
        </p>
        <ol>
            <li>Tweeted same tweets multiple times</li>
            <li>Tweeted multiple tweets in burst in a small period of time</li>
            <li>Promoted multiple falsehoods</li>
          </ol> 
      </div>
        <div className="footer">
          <div className='email'>Please email me at <a href="mailto:ddj2020@protonmail.com" target="_blank" rel="noopener noreferrer">ddj2020@protonmail.com</a> for suggestions or queries</div>
          <div className='share'>
            <span className='footer-start'>You got all the way down here, consider sharing the <span aria-label="love-emoji" role="img">💖</span></span>
            <div className='icons'>
              <FacebookShareButton url='https://influence-campaign-on-twitter-visualized.netlify.com/' quote="Curious case of 88662 88662: Misinformation and campaign on Twitter: ">
                <FacebookIcon size={32} round={true} />
              </FacebookShareButton>
              <TwitterShareButton url='https://influence-campaign-on-twitter-visualized.netlify.com/' title="Curious case of 88662 88662: Misinformation and campaign on Twitter: ">
                <TwitterIcon size={32} round={true} />
              </TwitterShareButton>
            </div>
          </div>
          <div className="footer-content">
            Datasheet for the visualization can be found <a href="./data.json" target="_blank" rel="noopener noreferrer">here</a>. <br /> <br />
            <span className="bold">PRIVACY POLICY</span> <br />This website does not save any information about you. We do not directly use cookies or other tracking technologies. We do, however, use Google Analytics for mere statistical reasons. It is possible that Google Analytics sets cookies or uses other tracking technologies, but this data is not directly accessible by us.
            <br /><br />
            This page is hosted on <a href="https://www.netlify.com/" target="_blank" rel="noopener noreferrer">Netlify</a>
          </div>
        </div>
    </div>
  );
}

export default App;
