import { LightningElement, wire } from 'lwc';
import { MessageContext } from 'lightning/messageService';
import {publishMC, subscribeMC, unsubscribeMC} from 'c/lmsUtility';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class ComponentSaveForLMS extends LightningElement {
  isEdit = false
  formOneData={}
  formTwoData={}

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
    this.subscription = subscription
    if(message && message.formData){
      const actionType = message.formData.type
      console.log("actionType", actionType)
      if(actionType === 'LEAD_FORM_A'){
        this.formOneData={...message.formData.value}
        console.log("formOneData fetched", this.formOneData)
      }
      if(actionType === 'LEAD_FORM_B'){
        this.formTwoData={...message.formData.value}
        console.log("formOneData fetched", this.formOneData)
        this.updateLeads()
      }
    
    }
  }

  publishMessage(type, value){
    const formData={type, value}
    publishMC(this.messageContext, formData);
  } 

  saveForm(){
    this.publishMessage('FETCH')
  }

  editForm(){
    this.isEdit = true
    this.publishMessage('EDIT')

  }

  cancelForm(){
    this.isEdit = false
    this.publishMessage('CANCEL')
  }


  updateLeads() {
        // Create the recordInput object
        const fields = {"Id":"00Q8d000001BgdnEAC", ...this.formOneData, ...this.formTwoData};

        const recordInput = { fields };

        updateRecord(recordInput)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Lead updated Successfully!!',
                        variant: 'success'
                    })
                );
 this.isEdit = false
                this.publishMessage('CANCEL')
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error Updating Lead record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
        }
}
