<script lang="ts">
  import Spreadsheet from '$components/Spreadsheet.svelte'
  export let initialValues: any
  export let onSubmit: (formData: any) => void
  export let onBack: null | ((formData: any) => void) = null

  import { createForm } from 'felte'
  //import { reporter } from '@felte/reporter-svelte'
  //import { validator } from '@felte/validator-zod'

  interface Tabular {
    missingValues: null | string | number
  }

  interface TabularFormData {
    tabular: Tabular | null
  }

  interface AttributeFormData {
    attributes: string[][]
  }

  interface FormData extends TabularFormData, AttributeFormData {
    files: {
      csv: any
      testData: any
      supplemental: any
    }
  }

  const { form, data, setData } = createForm<FormData>({
    initialValues,
    onSubmit,
  })

  // prop for the spreadsheet parser
  let hasHeaderRow = 'No'
  let hasMissing = 'No'

  // state for this component
  let format = 'tabular'

  // whenever format changes to other, reset the tabular data
  $: if (format !== 'tabular') {
    setData('tabular', null)
    setData('files.csv', null)
    setData('files.testData', null)
    setData('files.supplemental', null)
  }

  // whenever format changes to tabular, reset the supplemental file
  $: if (format !== 'other') {
    setData('files.supplemental', null)
  }
</script>

<form use:form class="my-16 mx-auto flex flex-col gap-6 px-8 min-w-[50vw]">
  <h1 class="text-xl">What format is the data file?*</h1>
  <div class="flex gap-2 form-control max-w-sm">
    <label class="label cursor-pointer">
      <span class="label-text text-md">Tabular (e.g. csv)</span>
      <input
        type="radio"
        class="radio radio-primary"
        value="tabular"
        bind:group={format}
      />
    </label>
    <label class="label cursor-pointer">
      <span class="label-text text-md">Other (e.g. zip)</span>
      <input type="radio" class="radio radio-primary" value="other" bind:group={format} />
    </label>
  </div>

  {#if format === 'tabular'}
    <h1 class="text-primary text-3xl">Tabular Information</h1>

    <h1 class="text-xl">Does your data contain a header row?*</h1>
    <div class="flex gap-2 form-control max-w-sm">
      <label class="label cursor-pointer">
        <span class="label-text text-md">Yes</span>
        <input
          type="radio"
          class="radio radio-primary"
          value="Yes"
          bind:group={hasHeaderRow}
        />
      </label>
      <label class="label cursor-pointer">
        <span class="label-text text-md">No</span>
        <input
          type="radio"
          class="radio radio-primary"
          value="No"
          bind:group={hasHeaderRow}
        />
      </label>
    </div>

    <h1 class="text-xl">Does your dataset contain missing values?*</h1>
    <div class="flex gap-2 form-control max-w-sm">
      <label class="label cursor-pointer">
        <span class="label-text text-md">Yes</span>
        <input
          type="radio"
          class="radio radio-primary"
          value="Yes"
          bind:group={hasMissing}
        />
      </label>
      <label class="label cursor-pointer">
        <span class="label-text text-md">No</span>
        <input
          type="radio"
          class="radio radio-primary"
          value="No"
          bind:group={hasMissing}
          on:change={() => setData('tabular.missingValues', null)}
        />
      </label>
      <label
        for="tabular.missingValues"
        class:hidden={hasMissing === 'No'}
        class="flex flex-col gap-4"
      >
        <span>Symbol for Missing Values</span>
        <input
          id="tabular.missingValues"
          name="tabular.missingValues"
          type="text"
          class="input input-bordered"
        />
      </label>
    </div>

    <div class="flex flex-col gap-6">
      <h1 class="text-xl">Upload CSV data here*</h1>
      <Spreadsheet
        bind:file={$data.files.csv}
        bind:value={$data.attributes}
        hasHeaderRow={hasHeaderRow === 'Yes'}
      />
    </div>

    <div class="flex flex-col gap-6">
      <h1 class="text-xl">Upload Test data here*</h1>
      <input type="file" name="files.testData" />
    </div>
  {/if}

  <div class="flex flex-col gap-6 w-full">
    <h1 class="text-xl">Upload supplemental data here*</h1>
    <input type="file" name="files.supplemental" />
  </div>

  <div class="flex gap-3">
    {#if onBack != null}
      <button
        class="btn btn-error w-32"
        on:click|preventDefault={() => onBack && onBack($data)}>Back</button
      >
    {/if}
    <button class="btn btn-primary w-32" type="submit">Next</button>
  </div>
</form>
