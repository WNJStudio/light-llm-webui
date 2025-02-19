<script>
  import IconButton, { Icon } from "@smui/icon-button";
  let { sidebarOpen = $bindable(false) } = $props();
</script>

<IconButton toggle bind:pressed={sidebarOpen}>
  <Icon class="material-icons">menu</Icon>
  <Icon class="material-icons" on>menu_open</Icon>
</IconButton>
