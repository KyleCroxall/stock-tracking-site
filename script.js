const apiKey = '';
const tdaKey = '';
const etfs = ['SPY', 'QQQ', 'IWM', 'DIA']
const cryptoPairs = ['BTCUSDT', 'ETHUSDT', 'DOGEUSDT', 'ADAUSDT']
const numOfArticles = 15;

var prevCryptoQuote = [0, 0, 0, 0];

function returnToTop() {
    // const htmlElement = document.documentElement;
    // htmlElement.scrollTo({
    //     top: 0,
    //     left: 0,
    //     behavior: 'smooth'
    // })
    window.scrollTo(0 ,0)

}

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
            const currentQuote = parsedEvent.data[0].p
            switch(parsedEvent.data[0].s) {
                case 'BINANCE:BTCUSDT':
                    if(currentQuote > prevCryptoQuote[0]) {
                        btcTicker.innerText = currentQuote + " ▲"
                        btcTicker.style = "color: green; font-weight: 800"
                    } else if(currentQuote < prevCryptoQuote[0]) {
                        btcTicker.innerText = currentQuote + " ▼";
                        btcTicker.style = "color: red; font-weight: 800"
                    }
                    prevCryptoQuote[0] = currentQuote
                    break;
                case 'BINANCE:ETHUSDT':
                    if(currentQuote > prevCryptoQuote[1]) {
                        ethTicker.innerText = currentQuote + " ▲"
                        ethTicker.style = "color: green; font-weight: 800"
                    } else if(currentQuote < prevCryptoQuote[1]) {
                        ethTicker.innerText = currentQuote + " ▼";
                        ethTicker.style = "color: red; font-weight: 800"
                    }
                    prevCryptoQuote[1] = currentQuote
                    break;
                case 'BINANCE:DOGEUSDT':
                    if(currentQuote > prevCryptoQuote[2]) {
                        dogeTicker.innerText = currentQuote + " ▲"
                        dogeTicker.style = "color: green; font-weight: 800"
                    } else if(currentQuote < prevCryptoQuote[2]) {
                        dogeTicker.innerText = currentQuote + " ▼";
                        dogeTicker.style = "color: red; font-weight: 800"
                    }
                    prevCryptoQuote[2] = currentQuote
                    break
                case 'BINANCE:ADAUSDT':
                    if(currentQuote > prevCryptoQuote[3]) {
                        adaTicker.innerText = currentQuote + " ▲"
                        adaTicker.style = "color: green; font-weight: 800"
                    } else if(currentQuote < prevCryptoQuote[3]) {
                        adaTicker.innerText = currentQuote + " ▼";
                        adaTicker.style = "color: red; font-weight: 800"
                    }
                    prevCryptoQuote[3] = currentQuote
                    break;
                default:
                    console.log('Received unrecognised data.')
                    break;
            }
        }

        
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
        let imgDiv = document.createElement('div')
        anchorDiv.className = 'news-card'
        anchorDiv.href = '#'
        anchorDiv.target = '_blank'
        anchorDiv.href = newsData[i].url
        titleDiv.className = 'card-title news-title'
        summaryDiv.className = 'card-desc news-desc'
        imgDiv.className = 'news-img'
        imgDiv.style.backgroundImage = `url(${newsData[i].image})`;
        anchorDiv.appendChild(titleDiv)
        anchorDiv.appendChild(imgDiv)
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

