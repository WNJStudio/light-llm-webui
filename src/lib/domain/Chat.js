import { PersistenceManager } from "$lib/persistence/PersistenceManager";
import { writable } from "svelte/store";
import { Message } from "./Message";
import { Model } from "./Model";

export class Chat {
  /**
   * @type {import('svelte/store').Writable<Object.<string,Chat>>}
   */
  static CHATS = writable({});

  /**
   * @param {string} name
   * @param {Model} model
   * @param {ChatConfig} config
   */
  static async create(name, model, config) {
    const key = await PersistenceManager.createChat({
      name: name,
      model: model.pojo(),
      messages: [],
      config: config.pojo(),
    });
    Chat.CHATS.update((v) => {
      v[key] = new Chat(key, name, model, [], config);
      return v;
    });
  }

  /**
   * Initial Load
   */
  static async loadChats() {
    const chats = await PersistenceManager.getAllChats();
    /** @type {Object.<string,Chat>} */
    const parsed = {};
    chats.forEach((c) => {
      parsed[c.id] = Chat.parse(c);
    });

    Chat.CHATS.set(parsed);
  }

  /**
   * Saves all
   * TODO: check if this works
   */
  static saveChats() {
    Object.values(Chat.CHATS).forEach((c) => {
      c.save();
    });
  }

  /**
   * Deserializes
   * @param {*} chat
   * @returns
   */
  static parse(chat) {
    return new Chat(
      chat.id,
      chat.name,
      Model.parse(chat.model),
      Message.parseList(chat.messages),
      ChatConfig.parse(chat.config)
    );
  }

  /**
   * @param {string} id
   * @param {string} name
   * @param {Model} model
   * @param {Message[]} messages
   * @param {ChatConfig} config
   */
  constructor(id, name, model, messages, config) {
    this.id = id;
    this.name = name;
    this.model = model;
    this.messages = messages;
    this.config = config;
    this.currentMessage = writable({ streaming: false, content: "" });
  }

  /**
   * Deletes this chat
   * @param {string} id
   */
  static async remove(id) {
    await PersistenceManager.removeChat(id);
    Chat.CHATS.update((v) => {
      delete v[id];
      return v;
    });
  }

  /**
   * Saves this chat
   */
  async save() {
    await PersistenceManager.updateChat(this.pojo(), parseInt(this.id));
  }

  /**
   * @param {string} prompt
   */
  chat(prompt) {
    const usermessage = new Message("user", prompt);
    this.model.provider
      .chat(
        this.model.name,
        this.config.system,
        this.messages,
        usermessage,
        this.currentMessage
      )
      .then((m) => {
        this.addMessage(m);
      });
    this.addMessage(usermessage);
  }

  /**
   * @param {Message} message
   */
  addMessage(message) {
    this.messages.push(message);
    this.save();
  }

  /**
   * @param {string} name
   */
  changeName(name) {
    this.name = name;
    this.save();
  }

  /**
   * @param {ChatConfig} config
   */
  changeConfig(config) {
    this.config = config;
    this.save();
  }

  /**
   * @param {Model} model
   */
  changeModel(model) {
    this.model = model;
    this.save();
  }

  /**
   * Converts the instance to a POJO
   * @returns
   */
  pojo() {
    return {
      name: this.name,
      model: this.model.pojo(),
      messages: this.messages.map((m) => m.pojo()),
      config: this.config.pojo(),
    };
  }
}

export class ChatConfig {
  /**
   * Deserializes
   * @param {*} config
   */
  static parse(config) {
    return new ChatConfig(config.system);
  }

  /**
   *
   * @param {string|undefined} system
   */
  constructor(system = undefined) {
    /** @type {Message|undefined} */
    this.system = system ? new Message("system", system) : undefined;
  }

  /**
   * Converts the instance to a POJO
   * @returns
   */
  pojo() {
    return { system: this.system?.content };
  }
}
