declare interface IChatBotAppApplicationCustomizerStrings {
  Title: string;
  Assistant:string,
  enterSomething:string,
  startTyping:string,
  send:string,
  buttons:{
    send:string,
    chathere:string,

  },
  msg:{
    NotUnderstood:string,
    WentWrong:string
  }

}

declare module 'ChatBotAppApplicationCustomizerStrings' {
  const strings: IChatBotAppApplicationCustomizerStrings;
  export = strings;
}
