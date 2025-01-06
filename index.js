const app = express()

var Client = require('coinbase').Client;
var client = new Client({'apiKey': mykey, 'apiSecret': mysecret});

app.listen(8000, () => {
console.log("server is running on PORT 8000")
})