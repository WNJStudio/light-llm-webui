export class Message {
  /**
   * Deserializes
   * @param {*} message
   * @returns
   */
  static parse(message) {
    return new Message(message.role, message.content);
  }

  /**
   * Deserializes list
   * @param {Object[]} messages
   */
  static parseList(messages) {
    return messages.map(Message.parse);
  }

  /**
   *
   * @param {"assistant"|"user"|"system"} role
   * @param {string} content
   */
  constructor(role, content) {
    this.role = role;
    this.content = content;
  }

  /**
   * Converts the instance to a POJO
   * @returns {{role:string,content:string}}
   */
  pojo() {
    return { role: this.role, content: this.content };
  }
}
