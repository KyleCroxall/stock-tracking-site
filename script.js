const apiKey = 'c3po752ad3ifkq8h223g';
const tdaKey = 'DFEAS8MOHAO1OXASBW82X1NAR3EB7U2R'
const etfs = ['SPY', 'QQQ', 'IWM', 'DIA']
const cryptoPairs = ['BTCUSDT', 'ETHUSDT', 'DOGEUSDT', 'ADAUSDT']
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

function updateCryptoTickers() {
    const socket = new WebSocket(`wss://ws.finnhub.io?token=${apiKey}`)

    // Once connection established, subscribe to each WebSocket
    socket.addEventListener('open', function(event) {
        socket.send(JSON.stringify({'type': 'subscribe', 'symbol': `BINANCE:${cryptoPairs[0]}`}));
        socket.send(JSON.stringify({'type': 'subscribe', 'symbol': `BINANCE:${cryptoPairs[1]}`}));
        socket.send(JSON.stringify({'type': 'subscribe', 'symbol': `BINANCE:${cryptoPairs[2]}`}));
        socket.send(JSON.stringify({'type': 'subscribe', 'symbol': `BINANCE:${cryptoPairs[3]}`}));
    })

    socket.addEventListener('message', function(event) {
        const parsedEvent = JSON.parse(event.data)
        const btcTicker = document.getElementById(cryptoPairs[0])
        const ethTicker = document.getElementById(cryptoPairs[1])
        const dogeTicker = document.getElementById(cryptoPairs[2])
        const adaTicker = document.getElementById(cryptoPairs[3])

        if(typeof parsedEvent.data !== undefined) {
            console.log(parsedEvent.data[0].s, parsedEvent.data[0].p)
            switch(parsedEvent.data[0].s) {
                case 'BINANCE:BTCUSDT':
                    btcTicker.innerText = parsedEvent.data[0].p
                    break;
                case 'BINANCE:ETHUSDT':
                    ethTicker.innerText = parsedEvent.data[0].p
                    break;
                case 'BINANCE:DOGEUSDT':
                    dogeTicker.innerText = parsedEvent.data[0].p
                    break
                case 'BINANCE:ADAUSDT':
                    adaTicker.innerText = parsedEvent.data[0].p
                    break;
                default:
                    console.log('Received unrecognised data.')
                    break;
            }
        }
        // switch(parsedEvent.data)
        
        // console.log(parsedEvent.data[0].p)
        // btcTicker.innerText = parsedEvent.data[0].p
        // const json = JSON.parse(event.data)
        // console.log('Message from server is: ', event.data)
        // console.log(json)
    })

    
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

updateCryptoTickers();


// (async () => {
//     result = await fetchLatestQuote('GME')
//     console.log("The result is: " + result.currentPrice)
// })();

