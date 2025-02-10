import { ApiProvider, AVAILABLE_PROVIDERS } from "$lib/llm/ApiProvider";

export class Model {
  /**
   * Deserializes
   * @param {*} model 
   * @returns 
   */
  static parse(model) {
    return new Model(
      model.name,
      AVAILABLE_PROVIDERS[model.provider.name].parse(model.provider)
    );
  }

  /**
   * @param {string} name
   * @param {ApiProvider} apiProvider
   */
  constructor(name, apiProvider) {
    this.name = name;
    this.provider = apiProvider;
  }

  /**
   * Converts the instance to a POJO
   * @returns 
   */
  pojo() {
    return JSON.parse(JSON.stringify(this));
  }
}
