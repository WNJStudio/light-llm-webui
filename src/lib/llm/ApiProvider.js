import { Message } from "$lib/domain/Message";

const decoder = new TextDecoder();

export class ApiProvider {
  /**
   * Deserializes
   * @param {*} provider
   * @returns
   */
  static parse(provider) {
    return new ApiProvider(provider.host);
  }

  /**
   * @param {string} url
   * @returns {Promise<string[]>}
   */
  static async getModels(url) {
    return [];
  }

  /**
   * @param {string} apiHost
   */
  constructor(apiHost) {
    this.host = apiHost;
    this.name = 'generic';
  }

  /**
   * @param {string} model
   * @param {Message|undefined} system
   * @param {Message[]} history
   * @param {Message} prompt
   * @param {import('svelte/store').Writable<{streaming:boolean, content:string}>} currentMessage
   * @returns {Promise<Message>}
   */
  async chat(model, system, history, prompt, currentMessage) {
    throw new Error("implement provider");
  }
}

// Ollama
export class OllamaApi extends ApiProvider {
  /**
   * Deserializes
   * @param {*} provider
   * @returns
   */
  static parse(provider) {
    return new OllamaApi(provider.host);
  }

  /**
   * @param {string} url
   * @returns
   */
  static async getModels(url) {
    const res = await fetch(`${url}/api/tags`);
    const body = await res.json();
    return body.models.map((/** @type {{ name: string; }} */ d) => d.name);
  }

  /**
   * @param {string} apiHost
   */
  constructor(apiHost) {
    super(apiHost);
    this.name = "ollama";
  }

  /**
   * @param {string} model
   * @param {Message|undefined} system
   * @param {Message[]} history
   * @param {Message} prompt
   * @param {import('svelte/store').Writable<{streaming:boolean, content:string}>} currentMessage
   * @returns {Promise<Message>}
   */
  async chat(model, system, history, prompt, currentMessage) {
    const body = {
      model: model,
      messages: [
        system?.pojo(),
        ...history.map((h) => h.pojo()),
        prompt.pojo(),
      ],
      stream: true,
    };

    const req = new Request(`${this.host}/api/chat`, {
      method: "POST",
      body: JSON.stringify(body, null, 4),
      headers: { "Content-Type": "application/json" },
    });

    currentMessage.set({
      streaming: true,
      content: "",
    });

    const response = await fetch(req);
    const stream = response.body?.getReader();
    if (!stream) {
      throw new Error("Failed to read response body");
    }
    let reply = new Message("assistant", "");
    while (true) {
      const { done, value } = await stream.read();
      if (done) {
        currentMessage.set({
          streaming: false,
          content: reply.content,
        });
        break;
      }
      const res = JSON.parse(decoder.decode(value));
      if (!res.done) {
          reply.content += res.message?.content || "";
          currentMessage.set({
            streaming: true,
            content: reply.content,
          });
      }
    }
    return reply;
  }
}

// OpenAI-like
export class OpenAIApi extends ApiProvider {
  /**
   * Deserializes
   * @param {*} provider
   * @returns
   */
  static parse(provider) {
    return new OpenAIApi(provider.host);
  }

  /**
   * @param {string} url
   * @returns
   */
  static async getModels(url) {
    const res = await fetch(`${url}/v1/models`);
    const body = await res.json();
    return body.data.map((/** @type {{ id: string; }} */ d) => d.id);
  }

  /**
   * @param {string} apiHost
   */
  constructor(apiHost) {
    super(apiHost);
    this.name = "openai";
  }

  /**
   * @param {string} model
   * @param {Message|undefined} system
   * @param {Message[]} history
   * @param {Message} prompt
   * @param {import('svelte/store').Writable<{streaming:boolean, content:string}>} currentMessage
   * @returns {Promise<Message>}
   */
  async chat(model, system, history, prompt, currentMessage) {
    const body = {
      model: model,
      messages: [
        system?.pojo(),
        ...history.map((h) => h.pojo()),
        prompt.pojo(),
      ],
      stream: true,
    };
    const req = new Request(`${this.host}/v1/chat/completions`, {
      method: "POST",
      body: JSON.stringify(body, null, 4),
      headers: { "Content-Type": "application/json" },
    });

    currentMessage.set({
      streaming: true,
      content: "",
    });

    const response = await fetch(req);
    const stream = response.body?.getReader();
    if (!stream) {
      throw new Error("Failed to read response body");
    }
    let reply = new Message("assistant", "");
    while (true) {
      const { done, value } = await stream.read();
      if (done) {
        currentMessage.set({
          streaming: false,
          content: reply.content,
        });
        break;
      }
      const decoded = decoder.decode(value);
      if (!decoded.trimEnd().endsWith("data: [DONE]")) {
        const res = JSON.parse(decoded.substring(5));
        if (res.choices?.[0]?.finish_reason !== "stop") {
          reply.content += res.choices?.[0]?.delta?.content || "";
          currentMessage.set({
            streaming: true,
            content: reply.content,
          });
        }
      }
    }
    return reply;
  }
}

/**
 * @type {Object.<string,typeof ApiProvider>}
 */
export const AVAILABLE_PROVIDERS = {
  ollama: OllamaApi,
  openai: OpenAIApi,
};
