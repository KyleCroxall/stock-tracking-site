const apiKey = '';
const etfs = ['SPY', 'QQQ', 'IWM', 'DIA']
const numOfArticles = 25;

async function fetchLatestQuote (ticker) {
    const url = `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`
    const response = await fetch(url);
    const tickerData = await response.json();
    const formattedQuote = {
        tickerSymbol: ticker,
        openPrice: tickerData.o,
        highPrice: tickerData.h,
        lowPrice: tickerData.l,
        currentPrice: tickerData.c,
        previousClose: tickerData.pc,
    };
    console.log(formattedQuote);
    return formattedQuote;
}

async function updateEtfTickers() {
    etfs.forEach(async etf => {
        const cardData = document.getElementById(etf)
        let data = await fetchLatestQuote(etf)
        getPercentageChange(data.previousClose, data.currentPrice);
        if(data.currentPrice > data.previousClose) {
            cardData.style = "color: green; font-weight: 800"
            cardData.innerText = data.currentPrice.toFixed(2);
            cardData.innerText += ' +' + (data.currentPrice - data.previousClose).toFixed(2);
            cardData.innerText += getPercentageChange(data.previousClose, data.currentPrice);
        } else if(data.currentPrice < data.previousClose) {
            cardData.style = "color: red; font-weight: 800"
            cardData.innerText = data.currentPrice;
            cardData.innerText += ' -' + (data.previousClose - data.currentPrice).toFixed(2);
            cardData.innerText += getPercentageChange(data.previousClose, data.currentPrice);
        }
    })
}

function getPercentageChange(oldPrice, newPrice) {
    let formattedPercentage;
    if(newPrice > oldPrice) {
        const percentage = (((newPrice - oldPrice) / oldPrice) * 100).toFixed(2)
        formattedPercentage = " (+" + percentage+ "%)"
        return formattedPercentage;
    } else if(newPrice < oldPrice) {
        const percentage = (((oldPrice - newPrice) / oldPrice) * 100).toFixed(2)
        formattedPercentage = " (-" + percentage+ "%)"
        return formattedPercentage;
    }
}

async function fetchLatestNews() {
    const url = `https://finnhub.io/api/v1/news?category=general&token=${apiKey}`
    const response = await fetch(url);
    const newsData = await response.json();
    console.log(newsData[0]);
    return newsData;
}

async function populateNewsDivs() {
    let newsData = await fetchLatestNews()
    let target = document.querySelector('.news-container')
    for(let i = 0; i < numOfArticles; i++) {
        let anchorDiv = document.createElement('a');
        let titleDiv = document.createElement('div');
        let summaryDiv = document.createElement('div')
        anchorDiv.className = 'news-card'
        anchorDiv.href = '#'
        anchorDiv.target = '_blank'
        anchorDiv.href = newsData[i].url
        titleDiv.className = 'card-title'
        summaryDiv.className = 'card-desc'
        anchorDiv.appendChild(titleDiv)
        anchorDiv.appendChild(summaryDiv)
        target.appendChild(anchorDiv)
        titleDiv.innerText = newsData[i].headline;
        summaryDiv.innerText = newsData[i].summary;
    }
}

populateNewsDivs()

updateEtfTickers();

fetchLatestNews();



// (async () => {
//     result = await fetchLatestQuote('GME')
//     console.log("The result is: " + result.currentPrice)
// })();

