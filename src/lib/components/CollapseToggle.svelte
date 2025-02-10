<script>
  import IconButton, { Icon } from "@smui/icon-button";
  let { collapsed = $bindable(false) } = $props();
</script>

<IconButton toggle bind:pressed={collapsed}>
  <Icon class="material-icons">arrow_circle_left</Icon>
  <Icon class="material-icons" on>arrow_circle_right</Icon>
</IconButton>
