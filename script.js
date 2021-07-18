const apiKey = 'c3peufaad3ifkq8grbs0';

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
    }
    console.log(formattedQuote)


   

}

fetchLatestQuote('GME')
fetchLatestQuote('AMC')
fetchLatestQuote('QQQ')
fetchLatestQuote('SPY')
fetchLatestQuote('BB')
fetchLatestQuote('SPCE')
fetchLatestQuote('TSLA')
console.log("Hi");



// console.log("Here is the object: " + myQuote)