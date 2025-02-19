<script>
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";

  let { inputHost = $bindable("") } = $props();

  let validity = $state("valid");

  $effect(() => {
    if (inputHost.length === 0) {
      validity = "required";
    } else {
      try {
        new URL(inputHost);
        validity = "valid";
      } catch (error) {
        validity = "invalid";
      }
    }
  });
</script>

<Textfield
  aria-autocomplete="list"
  type="url"
  style="width: 100%;"
  helperLine$style="width: 100%;"
  bind:value={inputHost}
  invalid={validity !== "valid"}
  required
  label="API Base URL"
></Textfield>
