<script>
  import List, {
    Graphic,
    Item,
    Meta,
    PrimaryText,
    SecondaryText,
    Text,
  } from "@smui/list";

  let { chats } = $props();
  let selectionIndex = $state(0);
</script>

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
