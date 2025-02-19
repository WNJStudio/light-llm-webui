<script>
  import AppBar from "$lib/components/AppBar.svelte";
  import CreateChatModal from "$lib/components/CreateChatModal.svelte";
  import SettingsModal from "$lib/components/SettingsModal.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import { AppContent } from "@smui/drawer";
  import { AutoAdjust } from "@smui/top-app-bar";

  let sidebarOpen = $state(true);
  let appBar = $state(null);
  let settingsOpen = $state(false);
  let createChatOpen = $state(false);

  /** @type {import('./$types').PageProps} */
  const { data } = $props();
  let chat = $state();
  let prompt = $state("");
  let response = $state("");
  let canChat = $state(true);

  /** @type {Object.<string,import('$lib/domain/Chat').Chat>}*/
  let availableChats = $state({});

  let searchType = $state("");
  let searchHost = $state("");

  let canSearchModels = $derived(searchType !== "" && searchHost !== "");

  /** @type {string[]} */
  let availableModels = $state([]);

  let selectedModel = $state("");

  let chatName = $state("");
  let systemPrompt = $state("");

  $effect(() => {
    const unsub = data.chats.subscribe((v) => {
      availableChats = v;
    });
    // @ts-ignore
    // chat = Object.values(data.chats)[0];
    // const unsubChat = chat.currentMessage.subscribe(
    //   (/** @type {{streaming:boolean, content:string}} */ v) => {
    //     response = v.content;
    //     canChat = !v.streaming;
    //   },
    // );

    return () => {
      unsub();
    };
  });
</script>

<!-- <ul>
  
</ul>

<select bind:value={searchType} required>
  {#each Object.keys(AVAILABLE_PROVIDERS) as provider}
    <option value={provider}>{provider}</option>
  {/each}
</select>

<input bind:value={searchHost} type="url" required />

<button
  aria-label="list available models"
  disabled={!canSearchModels}
  onclick={() =>
    AVAILABLE_PROVIDERS[searchType].getModels(searchHost).then((r) => {
      availableModels = r;
    })}>List available models</button
>
<label for="modelselect">Available Models</label>
<select name="modelselect" bind:value={selectedModel}>
  {#each availableModels as m}
    <option value={m}>m</option>
  {/each}
</select>

<input type="text" bind:value={chatName} required/>
<textarea bind:value={systemPrompt} required></textarea>

<button
  aria-label="create chat"
  onclick={() =>
    Chat.create(
      chatName,
      new Model(
        selectedModel,
        AVAILABLE_PROVIDERS[searchType].parse({ host: searchHost }),
      ),
      new ChatConfig(systemPrompt),
    )}
  disabled={selectedModel === "" || !canSearchModels}>Create chat</button
> -->

<!-- 
<textarea bind:value={prompt}></textarea>

<button aria-label="send" disabled={!canChat} onclick={() => chat.chat(prompt)}>send</button> -->

<!-- <pre>{response}</pre> -->

<div class="app-content">
  <AppBar bind:sidebarOpen bind:appBar />
  <Sidebar
    open={sidebarOpen}
    chats={Object.values(availableChats)}
    bind:settingsOpen
    bind:createChatOpen
  />
  <AppContent>
    <AutoAdjust topAppBar={appBar}></AutoAdjust>
  </AppContent>
  <CreateChatModal bind:open={createChatOpen}/>
  <SettingsModal bind:open={settingsOpen} />
</div>

<style>
  .app-content {
    position: relative;
    display: flex;
    overflow: hidden;
    z-index: 0;
    height: 100vh;
    width: 100%;
  }
</style>
