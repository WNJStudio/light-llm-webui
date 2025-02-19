<script>
  import Drawer, { Content, Header } from "@smui/drawer";
  import List, { Graphic, Item, Separator, Text } from "@smui/list";
  import ChatList from "./ChatList.svelte";
  let {
    open = $bindable(false),
    settingsOpen = $bindable(false),
    createChatOpen = $bindable(false),
    chats,
  } = $props();
</script>

<Drawer variant="dismissible" bind:open>
  <Header></Header>
  <Content style="display: flex;flex-direction: column;padding-bottom:16px;">
    <ChatList {chats} />
    <List dense>
      <Separator />
      <Item
        onSMUIAction={() => {
          createChatOpen = true;
        }}
      >
        <Graphic class="material-icons">add</Graphic>
        <Text>New Chat</Text>
      </Item>
      <Item
        onSMUIAction={() => {
          settingsOpen = true;
        }}
      >
        <Graphic class="material-icons">settings</Graphic>
        <Text>Settings</Text>
      </Item>
    </List>
  </Content>
</Drawer>
