var express = require('express');
var axios = require('axios');

var app = express();
var orakelUrl='https://www.atb.no/xmlhttprequest.php?service=routeplannerOracle.getOracleAnswer&question='

// Serve our web site (React.js application)
app.use(express.static('public/'));

// Proxy requests to atb, to avoid CORS issues. We also parse/map the response to a JSON array with the expected format.
app.get('/rest/travel/:question', function (req, res) {

  axios.get(orakelUrl + encodeURI(req.params.question))
    .then((response) => {
      var responseNoNewLine = response.data.replace(/(?:\r\n|\r|\n)/g, '');
      var proposals = responseNoNewLine.match(/(Buss|Holdeplassen)(.*?)(minutter senere\.|og buss(.*?)kl\. \d{4}\.)/g);
      if (proposals === null) {
        res.send([{'key': 0, 'proposal': response.data}]); // Default to returing all of it if we can't split it with our regex
      } else {
        var proposalObjectArray = proposals.map(function(match, index){ return { 'key': index, 'proposal': match }});
        res.send(proposalObjectArray)  
      }
    })
    .catch((err) => {
      res.status(err.status).send('Proxy error, server says: ' + err.statusText);
    })
});

// Demo purpses - respond with host where the app is served from
app.get('/rest/hostname', function (req, res) {
  res.send('Brought to you by: ' + process.env.HOSTNAME);
});

// Initialize the app.
var server = app.listen(process.env.PORT || 3000, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});