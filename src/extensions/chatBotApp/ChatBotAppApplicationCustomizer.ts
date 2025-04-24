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
        <div class="${styles.chatBody}" id="chat-body"></div>
        <div class="${styles.inputContainer}">
          <input class="${styles.inputField}" id="chat-input" placeholder="Start typing here!" />
          <button class="${styles.sendButton}" id="send-button">Send</button>
        </div>
      </div>
    `;
    document.body.appendChild(chatBox);
    this.addCloseButton(chatBox);
  
    const chatBody = document.getElementById('chat-body');
    if (chatBody) {
      this.sendBotReply(chatBody, `Hello ${this.context.pageContext.user.displayName}! How can I help you?`);
    }
  
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
      const msgWrapper = document.createElement('div');
      msgWrapper.className = `${styles.messageWrapper} ${styles.userWrapper}`;
  
      const msgText = document.createElement('div');
      msgText.className = styles.userMessage;
      msgText.textContent = message;
  
      const profileImg = document.createElement('img');
      profileImg.src = `/_layouts/15/userphoto.aspx?size=S&accountname=${this.context.pageContext.user.loginName}`;
      profileImg.className = styles.profileImage;
  
      msgWrapper.appendChild(msgText);     
      msgWrapper.appendChild(profileImg);  
      chatBody.appendChild(msgWrapper);
  
      this.sendBotReply(chatBody, "Thanks for your message! I'll get back to you shortly.");
  
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }
  

  
  private sendBotReply(chatBody: HTMLElement, msg: string): void {
    const msgWrapper = document.createElement('div');
    msgWrapper.className = `${styles.messageWrapper} ${styles.botWrapper}`;
  
    const profileImg = document.createElement('img'); 
    profileImg.src = 'https://media.istockphoto.com/id/1448313693/vector/robot-in-circle-vector-icon.jpg?s=1024x1024&w=is&k=20&c=yNGvIyhW_WOX4cDROqntNqwLdv_fYCtHc60VSbRWUx4='; 
    profileImg.className = styles.profileImage;
  
    const msgText = document.createElement('div');
    msgText.className = styles.botMessage; 
    msgText.textContent = msg;
  
    msgWrapper.appendChild(profileImg);
    msgWrapper.appendChild(msgText);
    chatBody.appendChild(msgWrapper);
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
