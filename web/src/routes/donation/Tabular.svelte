<script lang="ts">
  import Spreadsheet from '$components/Spreadsheet.svelte'
  export let initialValues: any
  export let onSubmit: (formData: any) => void
  export let onBack: null | ((formData: any) => void) = null

  import { createForm } from 'felte'
  //import { reporter } from '@felte/reporter-svelte'
  //import { validator } from '@felte/validator-zod'

  interface TabularFormData {
    tabular: {
      missingValues: null | string | number
    }
  }

  interface AttributeFormData {
    attributes: string[][]
  }

  interface FormData extends TabularFormData, AttributeFormData {}

  const { form, data } = createForm<FormData>({
    initialValues,
    onSubmit,
  })

  let hasHeaderRow = 'No'
</script>

<form use:form>
  <label for="tabular.missingValues">
    Yes
    <input type="radio" name="tabular.missingValues" value="Yes" />
  </label>
  <label for="tabular.missingValues">
    No
    <input type="radio" name="tabular.missingValues" value="No" />
  </label>

  <label for="hasHeaderRow">
    Yes
    <input type="radio" bind:group={hasHeaderRow} value="Yes" />
  </label>

  <label for="hasHeaderRow">
    No
    <input type="radio" bind:group={hasHeaderRow} value="No" />
  </label>

  <Spreadsheet bind:value={$data.attributes} />
  <div class="flex gap-3">
    {#if onBack != null}
      <button
        class="btn btn-error w-40 mx-auto"
        on:click|preventDefault={() => onBack && onBack($data)}>Back</button
      >
    {/if}
    <button class="btn btn-primary w-40" type="submit">Done</button>
  </div>
</form>
