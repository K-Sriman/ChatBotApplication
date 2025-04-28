import * as React from 'react';
import styles from './ChatBox.module.scss';
// import styles from './ChatBox.module.scss';

interface IChatBoxProps { 
  user: any;
}
 
interface State {
  IsChatActive:boolean;
  
}

class ChatBox extends React.Component<IChatBoxProps, State> {
  constructor(props: IChatBoxProps) {
    super(props);
    this.state = { 
      IsChatActive:false,
      };
    this.handleChatClick = this.handleChatClick.bind(this);
  }
  
  public handleChatClick(){
    console.log("clicked the chat buttom !!!"+this.props.user.displayName);
    this.setState({
      IsChatActive: !this.state.IsChatActive,
    })
  }
  render() { 
    return (
      <div>  
      <div className={styles.chatButton} onClick={this.handleChatClick}> Chat here 💬</div>
     {this.state.IsChatActive  && 
       <div className={styles.chatBox}>
        <div className={styles.ChatBoxheader}>
            <div className={styles.title}>Your sharepoint assistant</div>
            <div className={styles.close}>close</div>
        </div>

      </div>
      
    }
      </div>
    );
  }
}
 
export default ChatBox;

