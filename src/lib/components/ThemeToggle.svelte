<script>
  import IconButton, { Icon } from "@smui/icon-button";

  let fromStorage = $state(localStorage.getItem("theme") === "light");

  let theme = $state(localStorage.getItem("theme") === "light");

  let timeTransition = $state(false);

  $effect.pre(() => {
    timeTransition = theme || true;
    setTimeout(() => {
      timeTransition = false;
    }, 500);
  });

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

<svelte:head>
  {#if timeTransition}
    <style>
      * {
        transition:
          background-color 0.5s ease,
          color 0.5s ease !important;
      }
    </style>
  {/if}
  {#if !theme}
    <link rel="stylesheet" href="/smui-dark.css" />
  {/if}
</svelte:head>

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
