/*require('dotenv').config();
console.log('Your environment variable TWILIO_ACCOUNT_SID has the value: ', process.env.TWILIO_ACCOUNT_SID);
const client = require('twilio')();


client.messages.create({
  from: 'whatsapp:+14155238886',
  body: 'Ahoy world!',
  to: 'whatsapp:+919886540394'
}).then(message => console.log(message.sid));


*/

///////


/**
 * Copyright 2019 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

 const express = require('express');
const request = require('request');
const app = express();
const dialogflowSessionClient =
    require('./botlib/dialogflow_session_client.js');
const bodyParser = require('body-parser');

app.use(express.static('/')); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require('dotenv').config();
var port = process.env.PORT || 8080; 				// set the port
console.log('Your environment variable TWILIO_ACCOUNT_SID has the value: ', process.env.TWILIO_ACCOUNT_SID);
//const client = require('twilio')();

//For authenticating dialogflow_session_client.js, create a Service Account and
// download its key file. Set the environmental variable
// GOOGLE_APPLICATION_CREDENTIALS to the key file's location.
//See https://dialogflow.com/docs/reference/v2-auth-setup and
// https://cloud.google.com/dialogflow/docs/setup for details.

const projectId = 'covid-19-ujypee';
const phoneNumber = "+919886540394";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN

const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const sessionClient = new dialogflowSessionClient(projectId);

const listener = app.listen(process.env.PORT, function() {
  console.log('Your Twilio integration server is listening on port '
      + listener.address().port);
});
// routes ======================================================================



app.get('/', function (req, res) {
	console.log('app.get');
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)		  
});

app.post('/dialogflowResponse', async function(req, res) {
	console.log('....dialogflowResponse');
  const body = req.body;
  const text = body.Body;
  const id = body.From;
  const dialogflowResponse = (await sessionClient.detectIntent(
      text, id, body)).fulfillmentText;
  const twiml = new  MessagingResponse();
  const message = twiml.message(dialogflowResponse);
  res.send(twiml.toString());
});

process.on('SIGTERM', () => {
  listener.close(() => {
    console.log('Closing http server.');
    process.exit(0);
  });
});
//require('./app/routes.js')(app);
app.listen(port);
console.log("App listening on port " + port);