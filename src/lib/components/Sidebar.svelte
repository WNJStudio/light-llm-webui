<script>
  import Drawer, { Content, Header } from "@smui/drawer";
  import List, {
    Graphic,
    Item,
    Meta,
    PrimaryText,
    SecondaryText,
    Separator,
    Text,
  } from "@smui/list";
  let { open = $bindable(false), chats } = $props();
  let selectionIndex = $state(0);
</script>

<Drawer variant="dismissible" bind:open>
  <Header></Header>
  <Content style="display: flex;flex-direction: column;padding-bottom:16px;">
    <List
      style="flex:1;"
      twoLine
      singleSelection
      avatarList
      selectedIndex={selectionIndex}
    >
      {#each chats as chat, i}
        <Item
          onSMUIAction={() => {
            selectionIndex = i;
            console.log("clicker on row");
          }}
          selected={selectionIndex === i}
        >
          <Graphic class="material-icons">account_circle</Graphic>
          <Text>
            <PrimaryText>{chat.name}</PrimaryText>
            <SecondaryText>{chat.model.name}</SecondaryText>
          </Text>
          <Meta
            class="material-icons"
            onclick={(/** @type {Event} */ e) => {
              e.stopPropagation();
              console.log("clicked on edit");
            }}>edit_square</Meta
          >
        </Item>
      {/each}
    </List>
    <List dense>
      <Separator />
      <Item onSMUIAction={() => {}}>
        <Graphic class="material-icons">settings</Graphic>
        <Text>Settings</Text>
      </Item>
    </List>
  </Content>
</Drawer>
