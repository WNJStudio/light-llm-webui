<script>
  import { chatStore } from "$lib/store/chatStore";
  import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar";
  import CollapseToggle from "./CollapseToggle.svelte";
  import MenuToggle from "./MenuToggle.svelte";
  import ThemeToggle from "./ThemeToggle.svelte";

  let { sidebarOpen = $bindable(false), appBar = $bindable(null) } = $props();

  let title = $state("");
  let collapsed = $state(false);

  $effect(() => {
    let unsub = chatStore.subscribe((c) => {
      title = c.chatName === "" ? "Light LLM WebUI" : c.chatName;
    });

    return () => {
      unsub();
    };
  });
</script>

<TopAppBar style="z-index:10" bind:this={appBar} variant="short" {collapsed}>
  <Row>
    <Section>
      <MenuToggle bind:sidebarOpen />
      <Title>{title}</Title>
    </Section>
    <Section align="end" toolbar>
      {#if !collapsed}
        <ThemeToggle />
      {/if}
      <CollapseToggle bind:collapsed />
    </Section>
  </Row>
</TopAppBar>
