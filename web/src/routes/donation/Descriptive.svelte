<script lang="ts">
  // receive initial values and submit prop from the parent component
  export let initialValues: DescriptiveType
  export let onSubmit: (formData: DescriptiveType) => void
  export let onBack: null | ((formData: DescriptiveType) => void) = null

  import { DescriptiveSchema } from './DataStore'
  import type { DescriptiveType } from './DataStore'

  import { createForm } from 'felte'
  import { reporter } from '@felte/reporter-svelte'
  import { validator } from '@felte/validator-zod'

  const { form, data, errors } = createForm<DescriptiveType>({
    initialValues,
    extend: [validator({ schema: DescriptiveSchema }), reporter],
    onSubmit,
  })

  const descriptive_fields = [
    'purpose',
    'funding',
    'represent',
    'dataSplits',
    'sensitiveInfo',
    'preprocessingDescription',
    'used',
    'otherInfo',
    'datasetCitation',
  ] as const

  const descriptive_labels: { [key in typeof descriptive_fields[number]]: string } = {
    purpose: 'For what purpose was the dataset created?',
    funding: 'Who funded the creation of the dataset?',
    represent: 'What do the instances that comprise the dataset represent?',
    dataSplits: 'Are there recommended data splits?',
    sensitiveInfo:
      'Does the dataset contain data that might be considered sensitive in any way?',
    preprocessingDescription: 'Was there any data preprocessing performed?',
    used: 'Has the dataset been used for any tasks already?',
    otherInfo: 'Additional Information',
    datasetCitation: 'Citation Requests/Acknowledgements',
  }
</script>

<form use:form class="flex flex-col gap-4 max-w-4xl mx-auto">
  {#each descriptive_fields as field}
    <div class="flex flex-col gap-2">
      <label for="">
        {descriptive_labels[field]}
        <input
          type="text"
          name="descriptive.{field}"
          class="input input-bordered input-primary w-full"
        />
      </label>
    </div>
  {/each}
  <div class="flex gap-6">
    {#if onBack != null}
      <button
        class="btn btn-error w-40"
        on:click|preventDefault={() => onBack && onBack($data)}>Back</button
      >
    {/if}
    <button class="btn btn-primary w-40" type="submit">Done</button>
  </div>
</form>
