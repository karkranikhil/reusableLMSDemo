import { APPLICATION_SCOPE, subscribe, unsubscribe, publish } from 'lightning/messageService';
import FORMMC from '@salesforce/messageChannel/FormMessageChannel__c'
//this function will receive the message context as argument
//and we will use the cb function to send the subscription
//and message back to the calling component
const subscribeMC = (messageContext, cb) => {
    const subscription = subscribe(
        messageContext, FORMMC, (message) => {
          console.log("subscribed successfully!!")
          cb(message, subscription)
        }, {scope: APPLICATION_SCOPE});
}

//unsubscribe using the subscription passed
const unsubscribeMC = (subscription) => {
    unsubscribe(subscription);
}

//publish using the message context, the message and channel type
//passed from calling component
const publishMC = (messageContext, formData) => {
    const message = {
        formData
    };
    publish(messageContext, FORMMC, message);
}

//export the functions so that they are
//accessible in other modules
export {publishMC, subscribeMC, unsubscribeMC};