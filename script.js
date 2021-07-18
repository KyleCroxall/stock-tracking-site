const apiKey = '';
const etfs = ['SPY', 'QQQ', 'IWM', 'DIA']

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
        if(data.currentPrice > data.previousClose) {
            cardData.innerText = data.currentPrice.toFixed(2);
            cardData.innerText += ' +' + (data.currentPrice - data.previousClose).toFixed(2);
        } else if(data.currentPrice < data.previousClose) {
            cardData.innerText = data.currentPrice;
            cardData.innerText += ' -' + (data.previousClose - data.currentPrice).toFixed(2);
        }


    })
    

}

updateEtfTickers();

// (async () => {
//     result = await fetchLatestQuote('GME')
//     console.log("The result is: " + result.currentPrice)
// })();

