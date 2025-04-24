// import * as React from 'react';
// import styles from './ChatBox.module.scss';

// interface ChatBoxProps {
//   userName: string;
//   onClose: () => void;
// }

// export default class ChatBox extends React.Component<ChatBoxProps> {
//   public render(): React.ReactNode {
//     return (
//       <div className={styles.chatBox}>
//         <div className={styles.header}>
//           <span>Chat Assistant</span>
//           <button onClick={this.props.onClose} className={styles.close}>×</button>
//         </div>
//         <div className={styles.body}>
//           <p>Hello, {this.props.userName} 👋</p>
//           <p>How can I assist you today?</p>
//         </div>
//       </div>
//     );
//   }
// }

import * as React from 'react';

export interface IChatBoxProps {
  userName: string;
  onClose: () => void;
}

export default function ChatBox(props: IChatBoxProps) {
  return (
    <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
      <p>Hello, {props.userName} 👋</p>
      <button onClick={props.onClose}>Close</button>
    </div>
  );
}
