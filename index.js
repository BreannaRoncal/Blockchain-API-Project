import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://api.blockchain.com/v3/exchange";
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Sort prices from highest to lowest
function sortPrices(a, b) {
  return b.price_24h - a.price_24h;
}

app.get("/", async (req, res) => {
  const response = await axios.get(
    "https://api.blockchain.com/v3/exchange/tickers"
  );
  // Only get cryptocurrency in USD
  var responseUSDT = response.data.filter((element) =>
    element.symbol.includes("-USDT")
  );

  // Get top five prices
  var topFiveResponseUSDT = responseUSDT.sort(sortPrices).slice(0, 5);
  console.log(topFiveResponseUSDT);
  res.render("index.ejs", { topFive: topFiveResponseUSDT });
});

app.post("/tickers", async (req, res) => {
  const tickerSymbol = req.body.cryptoSymbol;
  //console.log(tickerSymbol);
  try {
    const result = await axios.get(API_URL + `/tickers/${tickerSymbol}-USDT`);
    //console.log(result.data);
    res.render("index.ejs", {
      symbol: JSON.stringify(result.data.symbol),
      price: JSON.stringify(result.data.price_24h),
    });
  } catch (error) {
    console.log(error.response.data);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
