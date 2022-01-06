import { LightningElement, wire } from 'lwc';
import { MessageContext } from 'lightning/messageService';
import {publishMC, subscribeMC, unsubscribeMC} from 'c/lmsUtility';
export default class ComponentBforLMS extends LightningElement {
  objectApiName="Lead"
  recordId="00Q8d000001BgdnEAC"
  fields = ['Status', 'LeadSource']
  isViewMode=true
  leadFormDataTwo={}

  /***LMS Related properties ***/
  subscription
  @wire(MessageContext) 
  messageContext;
  /**On mount subscribing LMS */
  connectedCallback(){
    this.subscribeMessage()
  }
  /**On unmount un-subscribing LMS */
  disconnectedCallback(){
    unsubscribeMC(this.subscription)
      this.subscription = null
  }

  /****Subscribing LMS Handler */
  subscribeMessage(){
      subscribeMC(this.messageContext, (message,subscription)=>{this.handleSubMessage(message, subscription)})
      
  }
  /***This handler will get called when someone publish a data  */
  handleSubMessage(message, subscription){
    console.log("leadFormDataTwo called!!")
    this.subscription = subscription
    if(message && message.formData){
      const actionType = message.formData.type
      if(actionType === 'FETCH'){
        this.fetchData()
      }
      if(actionType === 'EDIT'){
        this.isViewMode = false
      }
      if(actionType === 'CANCEL'){
        this.isViewMode = true
        this.resetHandler()
      }
    }
  }

  /****Subscribing LMS Handler */
  fetchData(){
    console.log("fetched")
    this.template.querySelectorAll('lightning-input-field').forEach((field) => {
      this.leadFormDataTwo[field.fieldName] = field.value
    });
    console.log("this.leadFormDataTwo", this.leadFormDataTwo)
    this.publishMessage()
  }

  /****Publishing LMS Handler that get called when save handler publish action FETCH*/
  publishMessage(){
    const formData={
          type:'LEAD_FORM_B',
          value:this.leadFormDataTwo
      }
    publishMC(this.messageContext, formData);
  } 

  resetHandler(){
    const inputFields = this.template.querySelectorAll('lightning-input-field');
    if (inputFields) {
        inputFields.forEach( field => {
            field.reset();
        } );
    }
  }
}