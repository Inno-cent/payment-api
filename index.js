const app = express()

var Client = require('coinbase').Client;
var client = new Client({'apiKey': process.env.COINBASE_API_KEY, 'apiSecret':  process.env.COINBASE_API_SECRET});

app.listen(8000, () => {
console.log("server is running on PORT 8000")
})