<script>
  import Button, { Label } from "@smui/button";
  import Dialog, { Actions, Content, Title } from "@smui/dialog";
  let { open = $bindable(false) } = $props();

  const handle = (/** @type {CustomEvent<{action:string}>} */ e) => {
    if (e.detail.action === "save") {
    }
  };
</script>

<Dialog bind:open onSMUIDialogClosed={handle}>
  <Title>Settings</Title>
  <Content></Content>
  <Actions>
    <Button action="save">
      <Label>Save</Label>
    </Button>
    <Button action="close">
      <Label>Close</Label>
    </Button>
  </Actions>
</Dialog>
