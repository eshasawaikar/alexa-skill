/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to rate reshop! Would you like me to search for better rates for your booking?';
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const initialconvoIntentHandler = {
    canHandle(handlerInput) {
      return (handlerInput.requestEnvelope.request.type === 'IntentRequest'
        &&    handlerInput.requestEnvelope.request.intent.name === 'initialconvo');
  },
  
  async handle(handlerInput) {
    let outputSpeech = 'This is the default message.';

    await getRemoteData('https://alexahhapp.azurewebsites.net/api/RateReshop')
      .then((response) => {
        const data = JSON.parse(response);
        outputSpeech = `We are delighted to inform you that our Rate Optimizer has spotted a better deal for the same booking!`;
        let min = data[0].bookingCost, max = data[0].bookingCost;
        for (let i = 0; i < data.length; i += 1) {
           let v = data[i].bookingCost;
            min = (v < min) ? v : min;
            max = (v > max) ? v : max;
           
        }
        outputSpeech = `${outputSpeech} The new  cheaper rate available for your hotel is ${min}.  Would you like to make a new booking for this rate? `;
          
      })
      .catch((err) => {
        console.log(`ERROR: ${err.message}`);
      });
      

/*await getRemoteData('https://alexahhapp.azurewebsites.net/api/RateReshop')
      .then((response) => {
        const data = JSON.parse(response);
        outputSpeech = `We are delighted to inform you that our Rate Optimizer has spotted a better deal for the same booking! `;
        for (let i = 0; i < data.length; i += 1) {
          if (i === 0) {
            // first record
            outputSpeech = `${outputSpeech} The new cheaper rate available for hotel, ${data[i].hotelName} is ${data[i].bookingCost} `;
          } else if (i === data.length - 1) {
            // last record
            outputSpeech = `${outputSpeech} and ${data[i].bookingCost}. Would you like to make a new booking for any of these rates?`;
          } else {
            // middle record(s)
            outputSpeech = `${outputSpeech} and ${data[i].bookingCost}`;
          
        }
      })
      .catch((err) => {
        console.log(`ERROR: ${err.message}`);
        // set an optional error message here
        // outputSpeech = err.message;
      });*/

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .getResponse();
  },
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
   //   .withShouldEndSession(true);
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
/*const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};*/
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
const getRemoteData = (url) => new Promise((resolve, reject) => {
  const client = url.startsWith('https') ? require('https') : require('http');
  const request = client.get(url, (response) => {
    if (response.statusCode < 200 || response.statusCode > 299) {
      reject(new Error(`Failed with status code: ${response.statusCode}`));
    }
    const body = [];
    response.on('data', (chunk) => body.push(chunk));
    response.on('end', () => resolve(body.join('')));
  });
  request.on('error', (err) => reject(err));
});

function slotValue(slot, useId){
  if(slot.value === undefined){
      return "undefined";
  }
  let value = slot.value;
  let resolution = (slot.resolutions && slot.resolutions.resolutionsPerAuthority && slot.resolutions.resolutionsPerAuthority.length > 0) ? slot.resolutions.resolutionsPerAuthority[0] : null;
  if(resolution && resolution.status.code === 'ER_SUCCESS_MATCH'){
      let resolutionValue = resolution.values[0].value;
      value = resolutionValue.id && useId ? resolutionValue.id : resolutionValue.name;
  }
  return value;
}


/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        initialconvoIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        )
        //IntentReflectorHandler
     .addErrorHandlers(
        ErrorHandler,
    )
    .lambda();
    