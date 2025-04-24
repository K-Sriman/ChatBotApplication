import { Dialog } from '@microsoft/sp-dialog';
import styles from './ChatBot.module.scss';
import { BaseApplicationCustomizer } from '@microsoft/sp-application-base';

export interface IChatBotAppApplicationCustomizerProperties {
  testMessage: string;
  Bottom: string;
}

export default class ChatBotAppApplicationCustomizer extends BaseApplicationCustomizer<IChatBotAppApplicationCustomizerProperties> {
  
  private _chatBoxVisible: boolean = false; 
  context: any;

  public onInit(): Promise<void> {
    Dialog.alert("oninit loaded !!");
    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
    return Promise.resolve();
  }
  
  private _renderPlaceHolders(): void {
    if (document.getElementById('floating-chatbot-container')) {
      return;
    }
 
    const chatContainer = document.createElement('div');
    chatContainer.id = 'floating-chatbot-container';
 
    chatContainer.innerHTML = `
      <div class="${styles.floatingButton}">
        💬 Chat
      </div>
    `;
 
    document.body.appendChild(chatContainer);
 
    const chatButton = chatContainer.querySelector(`.${styles.floatingButton}`);
    if (chatButton) {
      chatButton.addEventListener('click', () => {
        this.toggleChatBox();
      });
    }
  }
 
  private toggleChatBox(): void {
    if (this._chatBoxVisible) {
      this.closeChatBox();
    } else {
      this.openChatBox();
    }
    this._chatBoxVisible = !this._chatBoxVisible;
  }
 
  private openChatBox(): void {
    const chatBox = document.createElement('div');
    chatBox.id = 'chat-box';
    chatBox.innerHTML = `
      <div class="${styles.chatBox}">
        <div class="${styles.chatHeader}">ChatBot</div>
        <div class="${styles.chatBody}" id="chat-body">
          <p>Hello ${this.context.pageContext.user.displayName}! How can I help you?</p>
        </div>
        <div class="${styles.inputContainer}">
          <input class="${styles.inputField}" id="chat-input" placeholder="Start typing here!" />
          <button class="${styles.sendButton}" id="send-button">Send</button>
        </div>
      </div>
    `;
    document.body.appendChild(chatBox);
    this.addCloseButton(chatBox);
  
    const sendButton = chatBox.querySelector('#send-button') as HTMLButtonElement;
    const inputField = chatBox.querySelector('#chat-input') as HTMLInputElement;
  
    if (sendButton && inputField) {
      sendButton.addEventListener('click', () => {
        this.sendMessage(inputField.value);
        inputField.value = '';
      });
   
      inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendMessage(inputField.value);
          inputField.value = '';
        }
      });
    }
  }
  
  private sendMessage(message: string): void {
    if (!message.trim()) return;
  
    const chatBody = document.getElementById('chat-body');
    if (chatBody) {
      const msgElement = document.createElement('div');
      msgElement.className = styles.userMessage;
      msgElement.textContent = message;
      chatBody.appendChild(msgElement);
   
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }
  
  
  private closeChatBox(): void {
    const chatBox = document.getElementById('chat-box');
    if (chatBox) {
      chatBox.remove();
    }
  }
 
  private addCloseButton(chatBox: HTMLElement): void {
    const closeButton = document.createElement('button');
    closeButton.innerText = 'X';
    closeButton.addEventListener('click', () => {
      this.closeChatBox();
    });

    const chatHeader = chatBox.querySelector(`.${styles.chatHeader}`);
    if (chatHeader) {
      chatHeader.appendChild(closeButton);
    }
  }
}
