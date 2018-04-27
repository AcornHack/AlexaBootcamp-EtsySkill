/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';
const Alexa = require('alexa-sdk');
const https = require('https');

//=========================================================================================================================================
//TODO: The items below this comment need your attention.
//=========================================================================================================================================

//Replace with your app ID (OPTIONAL).  You can find this value at the top of your skill's page on http://developer.amazon.com.
//Make sure to enclose your value in quotes, like this: const APP_ID = 'amzn1.ask.skill.bb4045e6-b3e8-4133-b650-72923c5980f1';
const APP_ID = 'amzn1.ask.skill.d14329be-5638-47e8-9695-bdd866733ca9';

const SKILL_NAME = 'Etsy';
const GET_FACT_MESSAGE = "Here's your fact: ";
const HELP_MESSAGE = 'You can say tell me listings for ..., or tell me the top listings for ...What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Enjoy Shopping!';


//=========================================================================================================================================
//Editing anything below this line might break your skill.
//=========================================================================================================================================

const handlers = {
    'LaunchRequest': function () {
        var speechOutput = "Welcome to Etsy, You can say tell me listings for ..., or tell me the top listings for ... ";
        this.emit(':tell', speechOutput);
    },
    'GetListingIntent': function () {
        var product = this.event.request.intent.slots.Products.value;
        httpsGet(product,  (myResult) => {
                console.log("sent     : " + product);
                console.log("received : " + myResult);

                var firstProduct = myResult[0];
                var secondProduct = myResult[1];
                var thirdProduct = myResult[2];
                
                var myArray = [firstProduct.currency_code, secondProduct.currency_code, thirdProduct.currency_code];
                
                for (var i=0;i<myArray.length;i++){
                    if(myArray[i]=="USD"){
                        myArray[i] = "Dollars";
                    }else if(myArray[i]=="GBP"){
                        myArray[i] = "Pounds";
                    }
                    
                }
                
                var speechOutput = "The top listing is a " + firstProduct.title + " that costs " + firstProduct.price + " " + firstProduct.currency_code +  ". I also sent the top 3 listings to your alexa app";
                var reprompt = "If you don't like that, I also found " + secondProduct.title + " and " + thirdProduct.title;
                var card = 'Listing #1 \n' +  firstProduct.name + '\n' + firstProduct.title + '\n' + firstProduct.description + '\n' + firstProduct.price + firstProduct.currency_code + '\n' + firstProduct.url ;
            'Listing #2 \n' +  secondProduct.name + '\n' + secondProduct.title + '\n' + secondProduct.description + '\n' + secondProduct.price + secondProduct.currency_code + '\n' + secondProduct.url ;
            'Listing #3 \n' +  thirdProduct.name + '\n' + thirdProduct.title + '\n' + thirdProduct.description + '\n' + thirdProduct.price + thirdProduct.currency_code + '\n' + thirdProduct.url ;
       
                this.emit(':tellWithCard', speechOutput, reprompt,card); 

            }
        );
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};


function httpsGet(myData, callback) {

   /* var options = {
        host: 'https://openapi.etsy.com',
        path: '/v2/listings/active?api_key=fo3s8x03nmhvntw583xd8ct6&keywords=' + encodeURIComponent(myData)

    };
*/
    https.get('https://openapi.etsy.com/v2/listings/active?api_key=fo3s8x03nmhvntw583xd8ct6&keywords=' + encodeURIComponent(myData), (resp) => {
        let data = '';

        resp.on('data', (chunk) => {
            data += chunk;
        });

        resp.on('end', () => {
            var result = JSON.parse(data).results;
            callback(result);
            
        });

    }).on("error", (err) => {
    console.log("Error: " + err.message);
    });
}
