<script>
  import Button, { Label } from "@smui/button";
  import Dialog, { Actions, Content, Title } from "@smui/dialog";
  import CircularProgress from "@smui/circular-progress";
  import IconButton from "@smui/icon-button";
  import Snackbar from "@smui/snackbar";
  import LayoutGrid, { Cell } from "@smui/layout-grid";
  import Select, { Option } from "@smui/select";
  import BaseUrlInput from "./BaseUrlInput.svelte";
  import { AVAILABLE_PROVIDERS } from "$lib/llm/ApiProvider";

  let { open = $bindable(false) } = $props();

  let snackbarError = $state();
  let errorMessage = $state("");
  let fetching = $state(false);

  let inputHost = $state("");
  let provider = $state();
  let selectedModel = $state();
  /**
   * @type {string[]}
   */
  let availableModels = $state([]);

  const validateURL = (/** @type {string} */ url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  };

  const canFetchModels = $derived(
    validateURL(inputHost) && provider !== undefined && !fetching,
  );

  let valid = $derived(canFetchModels && selectedModel !== undefined);

  const handle = (/** @type {CustomEvent<{action:string}>} */ e) => {
    if (e.detail.action === "create") {
    }

    // Clean up before closing
    inputHost = "";
  };

  const fetchModels = async () => {
    if (canFetchModels) {
      fetching = true;
      try {
        const response =
          await AVAILABLE_PROVIDERS[provider].getModels(inputHost);
        availableModels = response;
      } catch (error) {
        errorMessage =
          "Failed to fetch models. Please check your URL and try again.";
        snackbarError.open();
      } finally {
        fetching = false;
      }
    }
  };

  const closeSnackbar = () => {
    snackbarError.close();
    errorMessage = "";
  };

  $effect(() => {
    if (inputHost !== "" || provider !== undefined) {
      // this is not working, why??
      availableModels = [];
      selectedModel = undefined;
    }
  });
</script>

<Dialog bind:open onSMUIDialogClosed={handle} surface$style="overflow:visible;">
  <Title>Create new chat</Title>
  <Content style="overflow:visible;">
    <LayoutGrid style="padding:0;">
      <Cell span={12}>
        <BaseUrlInput bind:inputHost />
      </Cell>
      <Cell span={12}>
        <Select
          style="width:100%;"
          required
          bind:value={provider}
          label="Select API Provider"
        >
          {#each Object.keys(AVAILABLE_PROVIDERS) as provider}
            <Option value={provider}>{provider}</Option>
          {/each}
        </Select>
      </Cell>
      <Cell span={4} style="display:flex;align-items:center;">
        <Button
          variant="raised"
          disabled={!canFetchModels}
          onclick={fetchModels}
          style="width:100%;"
        >
          {#if fetching}
            <div
              style="display:flex;justify-content:center;align-items:center;"
            >
              <CircularProgress
                style="height: 24px; width: 24px;"
                indeterminate
              />
            </div>
          {:else}
            <Label>Fetch Models</Label>
          {/if}
        </Button>
      </Cell>
      <Cell span={8}>
        <Select
          style="width:100%;"
          required
          bind:value={selectedModel}
          label="Select model"
        >
          {#each availableModels as model}
            <Option value={model}>{model}</Option>
          {/each}
        </Select>
      </Cell>
    </LayoutGrid>
  </Content>
  <Actions>
    <Button disabled={!valid} action="create">
      <Label>Create</Label>
    </Button>
    <Button action="close">
      <Label>Dismiss</Label>
    </Button>
  </Actions>
</Dialog>
<Snackbar bind:this={snackbarError} class="snackbar-error">
  <Label>{errorMessage}</Label>
  <Actions>
    <IconButton class="material-icons" title="Dismiss" onclick={closeSnackbar}
      >close</IconButton
    >
  </Actions>
</Snackbar>
