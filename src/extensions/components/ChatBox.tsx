
import * as React from 'react';
import styles from './ChatBox.module.scss'; 

interface IChatBoxProps {
  user: {
    loginName: any; displayName: string;  
};
}

interface IMessage {
  sender: 'user' | 'bot';
  content: string;
  timestamp: string;
}

interface State {
  isChatActive: boolean;
  inputText: string;
  messages: IMessage[];
  NoInputWarning: boolean;
}

class ChatBox extends React.Component<IChatBoxProps, State> { 
 userImage = `/_layouts/15/userphoto.aspx?size=S&accountname=${this.props.user.loginName}`;
  constructor(props: IChatBoxProps) {
    super(props);
    this.state = {
      isChatActive: false,
      inputText: '',
      messages: [],
      NoInputWarning:false
    };
  }

  handleChatToggle = () => {
    this.setState(
      prev => ({ isChatActive: !prev.isChatActive }),
      () => {
        if (this.state.isChatActive && this.state.messages.length === 0) {
          this.addBotMessage(`Hello ${this.props.user.displayName}, how can I help you?`);
        }
      }
    );
  };

  handleClose = () => {
    this.setState({ isChatActive: false, NoInputWarning:false });
  };

  handleMsgSend = () => {
    const text = this.state.inputText.trim();
    if (text) {
      this.addMessage('user', text);
      this.setState({ inputText: '' });
      setTimeout(() => this.addBotMessage('I am here to assist you.'), 500);
    }
    else{
       this.setState({
        NoInputWarning:true
        })
      }
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputText: e.target.value, NoInputWarning:false });
  };

  private addMessage(sender: 'user' | 'bot', content: string) {
    const timestamp = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
    this.setState(prev => ({ messages: [...prev.messages, { sender, content, timestamp }] }));
  }

  private addBotMessage(msg: string) {
    this.addMessage('bot', msg);
  }

  render() { 
    return (
      <>
        <div className={styles.chatButton} onClick={this.handleChatToggle}>
          Chat here 💬
        </div>
        {this.state.isChatActive && (
          <div className={styles.chatBox}>
            <div className={styles.header}>
              <div className={styles.title}>Your SharePoint Assistant</div>
              <button className={styles.close} onClick={this.handleClose}>×</button>
            </div>

            <div className={styles.chatsContainer}>
              {this.state.messages.map((m, i) => (
                <div
                  key={i}
                  className={`${styles.chatMessage} ${
                    m.sender === 'user' ? styles.userMessage : styles.botMessage
                  }`}
                >
                  <div className={styles.profilePic}>
                    <img
                      src={
                        m.sender === 'user' ? this.userImage : "https://cdn-icons-png.flaticon.com/512/18355/18355220.png"
                      }
                      alt={m.sender}
                    />
                  </div>
                  <div className={styles.bubble}>
                    <p>{m.content}</p>
                    <span className={styles.timestamp}>{m.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
                {this.state.NoInputWarning && <p className={styles.NoInputWarn}>please enter something !</p>}
            <div className={styles.inputRow}>
              <input
                type="text"
                value={this.state.inputText}
                onChange={this.handleInputChange}
                onKeyPress={e => e.key === 'Enter' && this.handleMsgSend()}
                placeholder="Start typing..."
              />
              <button onClick={this.handleMsgSend}>Send</button>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default ChatBox;
