export class PersistenceManager {
  static dbName = "llwudb";
  static dbVersion = 1;
  /**
   * @type {IDBDatabase|undefined}
   */
  static db = undefined;
  static initialized = false;

  static async init() {
    await new Promise((res, rej) => {
      if (window.indexedDB) {
        const request = window.indexedDB.open(
          PersistenceManager.dbName,
          PersistenceManager.dbVersion
        );
        request.onsuccess = (_) => {
          PersistenceManager.db = request.result;
          PersistenceManager.initialized = true;
          res(true);
        };

        request.onupgradeneeded = (e) => {
          const db = request.result;
          const chatStore = db.createObjectStore("chats", {
            autoIncrement: true,
          });

          chatStore.createIndex("name", "name", { unique: false });
        };

        request.onerror = (_) => {
          console.error("you need indexedDB to run this app");
          rej("permission to indexedDB not granted");
        };
      } else {
        console.error("you need a browser that supports indexedDB");
        rej("indexedDB not supported");
      }
    });
  }

  /**
   * @param {*} chat
   * @returns {Promise<string>}
   */
  static async createChat(chat) {
    return await new Promise((res, rej) => {
      const tsn = PersistenceManager.createTransaction(
        "readwrite",
        () => {},
        rej
      );

      const store = tsn.objectStore("chats");
      const req = store.add(chat);
      req.onsuccess = (e) => {
        // @ts-ignore
        res(e.target.result.toString());
      };
    });
  }

  /**
   * @param {*} id
   */
  static async removeChat(id) {
    await new Promise((res, rej) => {
      const tsn = PersistenceManager.createTransaction("readwrite", res, rej);

      const store = tsn.objectStore("chats");
      store.delete(id);
    });
  }

  /**
   * @param {*} chat
   * @param {*} id
   */
  static async updateChat(chat, id) {
    await new Promise((res, rej) => {
      const tsn = PersistenceManager.createTransaction("readwrite", res, rej);

      const store = tsn.objectStore("chats");
      store.put(chat, id);
    });
  }

  /**
   *
   * @returns {Promise<any[]>}
   */
  static async getAllChats() {
    return await new Promise((res, rej) => {
      const tsn = PersistenceManager.createTransaction(
        "readonly",
        () => {},
        rej
      );
      const store = tsn.objectStore("chats");
      const req = store.openCursor();
      /**
       * @type {any[]}
       */
      const chats = [];

      req.onsuccess = (e) => {
        /**
         * @type {IDBCursorWithValue}
         */
        // @ts-ignore
        const cursor = e.target.result;
        if (cursor) {
          const key = cursor.primaryKey;
          const value = cursor.value;
          chats.push({ id: key.toString(), ...value });
          cursor.continue();
        } else {
          res(chats);
        }
      };
    });
  }

  /**
   * @param {"readonly"|"readwrite"} mode
   * @param {*} res
   * @param {*} rej
   * @returns
   */
  static createTransaction(mode, res, rej) {
    // @ts-ignore
    const tsn = PersistenceManager.db.transaction(["chats"], mode);

    tsn.oncomplete = (_) => {
      res(true);
    };
    tsn.onerror = (e) => {
      console.error("something went wrong during the transaction");
      rej(e);
    };

    return tsn;
  }
}
