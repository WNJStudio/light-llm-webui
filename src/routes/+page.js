import { Chat, ChatConfig } from "$lib/domain/Chat";
import { Model } from "$lib/domain/Model";
import { OllamaApi, OpenAIApi } from "$lib/llm/ApiProvider";
import { PersistenceManager } from "$lib/persistence/PersistenceManager";

/** @type {import('./$types').PageLoad} */
export const load = async () => {
  await PersistenceManager.init();
  await Chat.loadChats();
  return { chats: Chat.CHATS };
};
