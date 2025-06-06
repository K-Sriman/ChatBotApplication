import * as React from 'react';
import * as ReactDOM from 'react-dom'; 
import ChatBox from './components/ChatBox';
// import { Dialog } from '@microsoft/sp-dialog'; 
import { BaseApplicationCustomizer, PlaceholderContent, PlaceholderName } from '@microsoft/sp-application-base';
import { Log } from '@microsoft/sp-core-library';
// import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IChatBotAppApplicationCustomizerProperties {
  testMessage: string;
  Bottom: string;
}
export interface IChatBoxProps {
  user: {
    loginName: string;
    displayName: string;
  };
}

const LOG_SOURCE: string = 'SPFx.ChatBot';

export default class ChatBotAppApplicationCustomizer extends BaseApplicationCustomizer<IChatBotAppApplicationCustomizerProperties> {
 
  context: any;
  private _bottomPlaceholder: PlaceholderContent;

  public onInit(): Promise<void> {
    // Dialog.alert("oninit loaded 01 !!"); 
    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
    return Promise.resolve();

  }
  private _renderPlaceHolders() : void{ 
      Log.info(LOG_SOURCE, this.context.placeholderProvider.placeholderNames.join(", "));    
    if (!this._bottomPlaceholder) {
      this._bottomPlaceholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Bottom);
    }
  
    if (this._bottomPlaceholder && this._bottomPlaceholder.domElement) {
      const element: React.ReactElement<IChatBoxProps> = React.createElement(ChatBox, {
        user: this.context.pageContext.user,
      }); 
      ReactDOM.render(element, this._bottomPlaceholder.domElement);

    } else {
      console.error("Failed to create or access  Bottom placeholder.");
    }
  }
  public onDispose(): void {
    if(this._bottomPlaceholder){ 
      console.log("displosed the compoent !");
    }
 
  }  
}

