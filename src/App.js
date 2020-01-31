import React from 'react';
import * as d3 from 'd3';
import TweetEmbed from 'react-tweet-embed';
import RetweetBoxWhisker from './RetweetBoxWhisker';
import Graph from './Graph';
import Donut from './Donut';
import graph from'./graph1.svg';
import graph2 from'./graph2.svg';
import graph3 from'./graph3.svg';
import graph4 from'./graph4.svg';
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
  dataByClassification.forEach(d => {
    obj[d.key] = d.values.length
  })

  let seq = ['Support CAA','Clickbait','Trolling opposite','Misinformation opposite','Unknown']
  let key = ['Truthful Tweets','Tweets Spreading Falsehoods','Trolling Tweets','Unclassified / Neutral']
  let value = [obj[seq[0]],obj[seq[1]] + obj[seq[3]],obj[seq[2]],obj[seq[4]]]
  return (
    <div className="App">
      <div className="header">
          <div className='header-wrap'>
            <div className='header-title'>
              <div className='header-span'>
                88662-88662: Misinformation and campaign on twitter
              </div>
            </div>
          </div>
      </div>
      <div className='container'>
        <div className='section-title'>
          Abstract
        </div>
        <p>
          In the first week of January a toll-free number 88662 88662 was shared by the Indian government asking people to give a missed call on this number to show their support to controversial Citizenship Amendment Act. <br /> <br /> In a few day the number was shared thousands of time by differnet users and soon reports started coming in how this number was shared by promising tantalising offers for people who called the number [<a href='https://scroll.in/article/948826/from-sex-to-netflix-subscriptions-heres-what-was-promised-for-dialling-bjps-caa-support-line' target='_blank'>News report here</a>].<br /><br />I was interested in the extend and spread of misinformation campaign on Twitter. Therefore I scraped around 3600 tweets (from 2nd Jan 2020 to 5th Jan 2020) that mentioned this number and analyzed the content of these tweets. I was mainly interested in:
          <ol>
            <li>Extend of the misinformation i.e. tweets encouraging social-media users to call the toll-free number but concealed the exactly function of the line.</li>
            <li>Spread of the misinformation i.e. retweets and likes for tweets encouraging social-media users to call the toll-free number but concealed the exactly function of the line.</li>
            <li>Different types of misinformation campaigns</li>
          </ol>
          <br />
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
          <ol>
            <li><span className="bold">Truthful Tweets</span>: Tweets encouraging twitter user to give give a missed call on the number to support the Citizenship Amendment Act (the original intention of the number)</li>
            <li><span className="bold">Trolling Tweets</span>: Tweets which troll the users that shared the tweets spreading misinformation and the tweets spreading misinformation</li>
            <li><span className="bold">Tweets Spreading Falsehoods</span>: Tweet encouraging user to call on number based on tantalising offer and tweets discourging user to call on the number based on fake news.</li>
            <li><span className="bold">Unclassified / Neutral</span>: Tweets which I was not able to classify in any of the above category either because of lack of context or the content of the tweet was neutral</li>
          </ol>
        </p>
        <hr />
        <div className='section-title'>
          Key Findings
        </div>
        <p>
          Of <span className="bold">{data.length}</span> tweets analyzed, <span className="bold red">{obj['Support CAA']}</span> tweets are truthful tweets, <span className="bold red">{obj['Clickbait'] + obj['Misinformation opposite']}</span> tweets spreads falsehoods, <span className="bold red">{obj['Trolling opposite']}</span> tweets are tweets trolling other users and <span className="red bold">{obj['Unknown']}</span> tweets are either neutral or unclassified.
        </p>
        <div className='red quote'>Around <span className='bold'>1 in 3 ({((obj['Clickbait'] + obj['Misinformation opposite']) * 100 / data.length).toFixed(1)}%)</span> tweets that mentions 88662 88662 spreads <span className="bold">falsehood</span></div>
        <Donut 
           total={data.length}
           text={'total tweets'}
           width = {720}
           height = {400}
           color={['#ff9800','#e03e3e','#c0ca33','#d7d7d7']}
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
          Tweets spreads falsehoods can be further divided in 2 categories: tweets encouraging users to call using falsehoods and tweets discourging users to call using falsehood.
        </p>
        <div className='red quote'><span className='bold'>{( obj['Clickbait'] * 100 / (obj['Clickbait'] + obj['Misinformation opposite'])).toFixed(1)}%</span> of tweets spreading falsehoods ecourage users to call the number on the basis of tantalising offers. Therefore, it can be said that a vast majority of tweets spreading falsehood are in favour of the act</div>
        <Donut 
           total={obj['Clickbait'] + obj['Misinformation opposite']}
           text={'falsehood tweets'}
           width = {720}
           height = {400}
           color={['#e03e3e','#c0ca33']}
           keyValue={['Tweets encouraging to call', 'Tweets discouraging to call']}
           keyPos={[425,300]}
           radius={200}
           value={[obj['Clickbait'],obj['Misinformation opposite']]}
           dx={0}
           dx1={0}
           dy={-15}
           dy1={30}
        />
      </div>
      <div className='body'>
        <div className='sideBar'>
          <span className='subHeadSideBar'>You  got to feel for the government IT Cell. It goes to all that trouble to create sophisticated, fake clickbait campaigns promoting the '8866288662' (the phone no one should call to support CAA) only to be fact checked afterwards.</span><br /><br /> A bit of a background about the data analysed: The dataset has <span className="bold">3589</span> unique tweets which were tweeted from 2nd to 5th of January and has "8866288662" or "88662-88662". Only the tweets which were in English was taken into account <br /><br />
          Ther tweets are divided in 5 different categories
          <RetweetBoxWhisker 
           data={data}
           width = {380}
           height = {450}
          />
          <ul>
            <li><span className="bold">Tweet supporting CAA</span>: The number was mentioned in this category of tweets ask people to give a missed call on the number to support CAA (the original intention)</li>
            <li><span className="bold">Clickbait Tweet</span>: The number was mentioned in this category of tweets says calling this number provide subscription to netflix, otehr free offers, jobs etc.</li>
            <li><span className="bold">Misinformation Opposite</span>: The number was mentioned in this category of tweets ask people people not to call at this number with some misinformation like calling this number will hack your phone etc.</li>
            <li><span className="bold">Trolling Opposite</span>: The number was mentioned in this category of tweets trolls the people who have shared this number. Some common example are calling this number let you listen to Sun (trolling the Kiran Bedi tweet).</li>
            <li><span className="bold">Unknown</span>: The number was mentioned in this category of tweets cannot be identified in above categories.</li>
          </ul>
          <div className="notes"><p>About <span className="bold blue-color">2 in 7</span> tweets was identified as <span className="bold">clickbait tweets</span></p><p>About <span className="bold blue-color">1 in 2</span> tweets cannot be conclusively identified as <span className="bold">tweets supporting CAA</span></p></div>
          
          <hr />
          <div className="bold">Clickbait Tweets</div>
          Clickbait tweets comes in all size and forms. For simplicity the clickbait tweets can be categorized in 4 categories:
          <ul>
            <li>Providing offers like free pizza, free data plan, netflix subscriptions etc.</li>
            <li>Catfishing tweets providing sexual pleasure like fee chat with "lonely girls" or porn stars or "virgin girls" or people tweeting "call me on this no.".</li>
            <li>Supporting the other side of the argument i.e. giving a call at this number register you support to the protest against CAA.</li>
            <li>Misc. content for ex. calling the number let you support a contestant in Bigg Boss; calling this number shows your support for building Babri Masjid again etc.</li>
          </ul>
          <div className="notes"><p>About <span className="bold blue-color">1 in 13</span> tweets was identified as <span className="bold">catfishing tweets</span></p><p>About <span className="bold blue-color">1 in 15</span> tweets are <span className="bold">tweets giving offer</span></p></div>
          <img className='imgContainer1' src={graph2} alt="Graphs"/>
          <hr />
          <div className="bold">Spread of CAA Related and Clickbait Tweets</div>
            The <span className="bold">2304</span> CAA related tweets are like <span className="bold">59286</span> times and retweeted <span className="bold">20306</span> times. On average around <span className="bold blue-color">{Math.round(59286/2304)}</span> likes and <span className="bold blue-color">{Math.round(20306/2304)}</span> retweets per tweet.<br /><br />
            The <span className="bold">581</span> clickbait tweets are like <span className="bold">9636</span> times and retweeted <span className="bold">2596</span> times. On average around <span className="bold blue-color">{Math.round(9636/581)}</span> likes and <span className="bold blue-color">{Math.round(2596/581)}</span> retweets per tweet.
            <div className="notes marginBottom">Of these the tweets saying that calling on this no. provides free Netflix subscription was liked on average around <span className="bold blue-color">34 times (8 times more than CAA related tweets)</span> and retweeted around <span className="bold blue-color">9 time (same as that for CAA related tweets)</span></div>
            The fake Netflix tweet was spread so fast and wide that Netflix India twitter account had to tweet that this is fake news.
            <TweetEmbed id="1213422409576927232" placeholder={'loading'} />
            <div className="notes">Tweets saying that calling on this no. will help build Barbi Masjid again was liked on average around <span className="bold blue-color">31 times (5 times more than CAA related tweets)</span> and retweeted around <span className="bold blue-color">16 time (7 times more than CAA related tweets)</span>. <span className="subNote">Please note the sample size for this category of tweets is very small.</span></div>
            <img className='imgContainer1' src={graph3} alt="Graphs"/>
            <img className='imgContainer1' src={graph4} alt="Graphs"/>
          <hr />
          Many of the tweets and account are now suspended as this data is from 5th January 2020. The dataset can be downloaded here.
        </div>
        <div>
          <Graph 
            data={data}
            width = {window.innerWidth - 480}
            height= {window.innerHeight - 125 }
          />
        </div>
      </div>
    </div>
  );
}

export default App;
