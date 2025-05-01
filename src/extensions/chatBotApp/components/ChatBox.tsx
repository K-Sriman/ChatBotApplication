import * as React from "react";
import styles from "./ChatBox.module.scss";
import * as strings from "ChatBotAppApplicationCustomizerStrings";
import key from '../../locked'; 
interface IChatBoxProps {
  user: {
    loginName: string;
    displayName: string;
  };
}

interface IMessage {
  sender: "user" | "bot";
  content: string;
  timestamp: string;
}

interface State {
  isChatActive: boolean;
  inputText: string;
  messages: IMessage[];
  NoInputWarning: boolean;
  isFullScreen: boolean; 

}

class ChatBox extends React.Component<IChatBoxProps, State> {
  private chatsEndRef: React.RefObject<HTMLDivElement>;
  userImage = `/_layouts/15/userphoto.aspx?size=S&accountname=${this.props.user.loginName}`;
  private inputRef: React.RefObject<HTMLInputElement>; 

  constructor(props: IChatBoxProps) {
    super(props);
    this.state = {
      isChatActive: false,
      inputText: "",
      messages: [],
      NoInputWarning: false,
      isFullScreen: false, 
    };
    this.chatsEndRef = React.createRef();
    this.inputRef = React.createRef(); 
  }


  
  componentDidUpdate(_: IChatBoxProps, prevState: State) : void {
    if (this.state.isChatActive && !prevState.isChatActive && this.inputRef.current) {
      this.inputRef.current.focus();
    }
    
    if (prevState.messages.length !== this.state.messages.length) {
      this.scrollToBottom();
    }
  }
  
  handleChatToggle = (): void => {
    this.setState(
      (prev) => ({ isChatActive: !prev.isChatActive }),
      () => {
        if (this.state.isChatActive && this.state.messages.length === 0) {
          this.addBotMessage(`Hello ${this.props.user.displayName}, how can I help you?`);
        }
      }
    );
  };

  scrollToBottom = () : void=> {
    if (this.chatsEndRef.current) {
      this.chatsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

 

  handleClose = (): void => {
    this.setState({ isChatActive: false, NoInputWarning: false });
  };

  handleMsgSend = async (): Promise<void> => {
    const text = this.state.inputText.trim();
    if (text) {
      this.addMessage("user", text);
      this.setState({ inputText: "" });
   
      await this.generateBotResponse(text);
    } else {
      this.setState({
        NoInputWarning: true,
      });
    }
  };
  

   
  handleMaximize = ():void => {
    this.setState((prevState) => ({
      isFullScreen: !prevState.isFullScreen,
    }));
  };

 
  async generateBotResponse(text: string): Promise<void> {
    const timestamp = new Date().toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  
    this.setState((prev) => ({
      messages: [...prev.messages, { sender: 'bot', content: 'Thinking...', timestamp }],
    }));
  
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${key.openrouter}`, 
          "Content-Type": "application/json",
          "HTTP-Referer": "https://x2k47.sharepoint.com", 
          "X-Title": "SPFx Chatbot", 
        },
        body: JSON.stringify({
          model: "qwen/qwen3-0.6b-04-28:free", 
          messages: [
            {
              role: "user",
              content: text,
            },
          ],
        }),
      });
  
      const data = await response.json();
      const finalText = data?.choices?.[0]?.message?.content || strings.msg.NotUnderstood;
  
      this.setState((prev) => {
        const updated = [...prev.messages];
        updated.pop(); 
        updated.push({ sender: "bot", content: finalText, timestamp });
        return { messages: updated };
      });
    } catch (error) {
      console.error("API error:", error);
      this.setState((prev) => {
        const updated = [...prev.messages];
        updated.pop();
        updated.push({ sender: "bot", content: strings.msg.WentWrong, timestamp });
        return { messages: updated };
      });
    }
  }
  

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ inputText: e.target.value, NoInputWarning: false });
  };

  private addMessage(sender: "user" | "bot", content: string): void {
    const timestamp = new Date().toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
    this.setState((prev) => ({
      messages: [...prev.messages, { sender, content, timestamp }],
    }));
  }

  private addBotMessage(msg: string): void {
    // const editedmsg = this.parseBold(msg);
    this.addMessage("bot", msg);
  }

  
  parseText = (text: string) :string => {
    // Convert markdown-style **bold** to <strong> and *italic* to <em>
    const formattedText = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Convert bold markdown to <strong>
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Convert italic markdown to <em>
      .replace(/\n/g, '<br />'); // Replace newlines with <br /> for line breaks
  
    return formattedText;
  };

 
  

  render(): JSX.Element {
    const { isFullScreen } = this.state;

    return (
      <>
        <div className={styles.chatButton} onClick={this.handleChatToggle}>
          {strings.buttons.chathere}
        </div>
        {this.state.isChatActive && (
          <div
            className={`${styles.chatBox} ${isFullScreen ? styles.fullScreen : styles.minimized}`}
          >
           <div className={styles.header}>
              <div className={styles.title}>{strings.Assistant}</div>
              <div>
                {isFullScreen ? (
                  <div> 
                    <img src="https://cdn-icons-png.flaticon.com/512/318/318141.png" alt=""  className={styles.maximizeBtn} onClick={this.handleMaximize}/>
                    <img src="https://cdn-icons-png.flaticon.com/512/2976/2976286.png" alt=""  className={styles.close} onClick={this.handleClose}/>
                  </div>
                ) : (
                  <div> 
                    <img src="https://cdn-icons-png.flaticon.com/512/3889/3889434.png" alt=""  className={styles.maximizeBtn} onClick={this.handleMaximize}/>
                    <img src="https://cdn-icons-png.flaticon.com/512/2976/2976286.png" alt=""  className={styles.close} onClick={this.handleClose}/>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.chatsContainer}>
              {this.state.messages.map((m, i) => (
                <div
                  key={i}
                  className={`${styles.chatMessage} ${
                    m.sender === "user" ? styles.userMessage : styles.botMessage
                  }`}
                >
                  <div className={styles.profilePic}>
                    <img
                      src={m.sender === "user" ? this.userImage : "https://cdn-icons-png.flaticon.com/512/18355/18355220.png"}
                      alt={m.sender}
                    />
                  </div>
                  <div className={styles.bubble}> 
                    <p
                    dangerouslySetInnerHTML={{
                      __html: this.parseText(m.content),  
                    }}
                  />
                    <span className={styles.timestamp}>{m.timestamp}</span>
                  </div>
                </div>
              ))}
              <div ref={this.chatsEndRef}></div>
              
            {this.state.NoInputWarning && (
              <p className={styles.NoInputWarn}>{strings.enterSomething}</p>
            )}
            </div>
            <div className={styles.inputRow}>
              <input
                type="text"
                value={this.state.inputText}
                ref={this.inputRef} 
                onChange={this.handleInputChange}
                onKeyPress={(e) => e.key === "Enter" && this.handleMsgSend()}
                onKeyDown={(e) => e.key === "Escape" && this.handleClose()}
                placeholder={strings.startTyping}
              />
              <button onClick={this.handleMsgSend}>{strings.buttons.send}</button>
            </div>
          </div>
        )}
      </>
    );
  }
}

export default ChatBox;
