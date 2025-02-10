<script>
  import IconButton, { Icon } from "@smui/icon-button";

  let fromStorage = $state(localStorage.getItem("theme") === "light");

  let theme = $state(localStorage.getItem("theme") === "light");

  $effect(() => {
    if (theme) {
      localStorage.setItem("theme", "light");
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      localStorage.setItem("theme", "dark");
      document.documentElement.setAttribute("data-theme", "dark");
    }
  });
</script>

<IconButton
  onclick={() => {
    theme = !theme;
  }}
  toggle
  bind:pressed={fromStorage}
>
  <Icon class="material-icons" on>light_mode</Icon>
  <Icon class="material-icons">dark_mode</Icon>
</IconButton>
