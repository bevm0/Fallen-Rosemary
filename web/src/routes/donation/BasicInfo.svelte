<script lang="ts">
  // initial values for form data
  export let initialValues: BasicInfoType

  // what to do on submit, e.g. save to store
  export let onSubmit: (formData: BasicInfoType) => void

  // what to do if going back; null function means not able to go back
  export let onBack: null | ((formData: BasicInfoType) => void) = null

  // if last step, display "Finish", else display "Next"
  export let isLastStep = false

  import type { BasicInfoType } from './DataStore'
  import { BasicInfoSchema } from './DataStore'

  import { createForm } from 'felte'
  import { reporter } from '@felte/reporter-svelte'
  import { validator } from '@felte/validator-zod'

  import { defaultCreator } from '$lib/schemas/Creator'

  import trpc from '$lib/trpc'
  import { useQuery } from '@sveltestack/svelte-query'

  import CreatorField from '$components/Forms/CreatorField.svelte'
  import CreatorFieldArray from '$components/Forms/CreatorFieldArray.svelte'
  import Keyword from '$components/Keyword.svelte'

  // initialize form
  const currentUser = {
    firstName: 'Elysia',
    lastName: 'Ego',
    email: null,
    address: 'Elysian Realm',
    institution: 'Flamechasers',
  }

  const { form, data, setData, addField, unsetField } = createForm<BasicInfoType>({
    initialValues,
    extend: [validator({ schema: BasicInfoSchema }), reporter],
    onSubmit,
  })

  // form controls not part of the form data
  let creatorIsDonor = 'Yes'
  let hasDOI = $data.metadata.DOI == null ? 'No' : 'Yes'

  // enumerated form fields
  //////////////////////////////////////////
  const Areas = [
    'Business',
    'Computer Science',
    'Engineering',
    'Game',
    'Law',
    'Life Science',
    'Physical Science',
    'Social Science',
    'Other',
  ]

  const Types = [
    'Tabular',
    'Sequential',
    'Multivariate',
    'Time-Series',
    'Text',
    'Image',
    'Other',
  ]

  const Tasks = ['Classification', 'Regression', 'Clustering', 'Other']

  // field arrays; e.g. fields with a dynamic number of inputs to display
  //////////////////////////////////////////

  // get all keywords from database for autocomplete
  const keywordResult = useQuery(
    'getKeywords',
    async () => await trpc(fetch).query('getKeywords')
  )

  $: allKeywords = $keywordResult.data || []

  $: creators = $data.creators || []
  $: keywords = $data.keywords || []

  // field array controls
  // they respond based on events dispatched from the child component
  // a child component binds its data to an object at e.g. $data.creators[index]
  // and dispatches an event with its index whenver an interaction is made with it
  //////////////////////////////////////////
  function removeCreator(e: CustomEvent<{ index: number }>) {
    return unsetField(`creators.${e.detail.index}`)
  }

  function addCreator(e: CustomEvent<{ index: number }>) {
    return addField(`creators`, defaultCreator, e.detail.index + 1)
  }

  function removeKeyword(e: CustomEvent<{ index: number }>) {
    return unsetField(`keywords.${e.detail.index}`)
  }

  function addKeyword(e: CustomEvent<{ index: number }>) {
    return addField(`keywords`, '', e.detail.index + 1)
  }
</script>

<div class="overflow-y-scroll p-4">
  <form use:form class="flex flex-col gap-4 mx-auto my-4 max-w-4xl">
    <div class="flex items-center gap-2px-0">
      <h1 class="text-primary text-3xl">Metadata*</h1>
    </div>

    <div class="flex flex-col gap-6">
      <div class="flex flex-col">
        <div class="flex items-center gap-3">
          <label for="dataset-name" class="text-xl">Dataset Name*</label>
        </div>
        <input
          id="dataset-name"
          name="metadata.Name"
          type="text"
          class="input input-bordered mt-2 w-full"
          placeholder="Dataset Name"
          required
        />
      </div>

      <div class="divider" />

      <div class="flex flex-col gap-2">
        <label for="metadata.Abstract" class="text-xl">Abstract*</label>
        <input
          id="metadata.Abstract"
          name="metadata.Abstract"
          type="text"
          class="input input-bordered"
          placeholder="Abstract"
          required
        />
      </div>

      <div class="divider" />

      <div class="flex flex-col gap-2">
        <label for="area-radio" class="text-xl">Areas*</label>
        <div id="area-radio" class="form-control flex gap-4 max-w-sm">
          {#each Areas as Area}
            <label class="label cursor-pointer flex gap-3">
              <span class="label-text text-md">{Area}</span>
              <input
                type="radio"
                name="metadata.Area"
                value={Area}
                class="radio radio-primary"
              />
            </label>
          {/each}
        </div>
      </div>

      <div class="divider" />

      <div class="flex flex-col gap-2">
        <label for="types-checkbox" class="text-xl">Types*</label>
        <div id="types-checkbox" class="flex gap-2 form-control max-w-sm">
          {#each Types as Type}
            <label class="label cursor-pointer">
              <span class="label-text text-md">{Type}</span>
              <input
                type="checkbox"
                name="metadata.Types"
                value={Type}
                class="checkbox checkbox-primary"
              />
            </label>
          {/each}
        </div>
      </div>

      <div class="divider" />

      <div class="flex flex-col gap-2">
        <label for="metadata.DOI" class="text-xl">DOI*</label>
        <div id="DOI-radio" class="flex gap-2 form-control max-w-sm">
          <label class="label cursor-pointer">
            <span class="label-text text-md">Yes</span>
            <input
              type="radio"
              class="radio radio-primary"
              on:change={() => setData('metadata.DOI', '')}
              bind:group={hasDOI}
              value="Yes"
            />
          </label>
          <label class="label cursor-pointer">
            <span class="label-text text-md">No</span>
            <input
              type="radio"
              class="radio radio-primary"
              on:change={() => setData('metadata.DOI', null)}
              bind:group={hasDOI}
              value="No"
            />
          </label>
        </div>
        <input
          id="metadata.DOI"
          name="metadata.DOI"
          type="text"
          class="input input-bordered"
          class:hidden={hasDOI === 'No'}
        />
      </div>

      <div class="divider" />
      <div class="flex flex-col gap-2">
        <label for="task-checkbox" class="text-xl">Task*</label>
        <div id="task-checkbox" class="flex gap-2 form-control max-w-sm">
          {#each Tasks as Task}
            <label class="label cursor-pointer">
              <span class="label-text text-md">{Task}</span>
              <input
                type="checkbox"
                name="metadata.Task"
                value={Task}
                class="checkbox checkbox-primary"
              />
            </label>
          {/each}
        </div>
      </div>
    </div>

    <div class="divider" />

    <h1 class="px-0 text-primary text-3xl">Creator*</h1>
    <div class="flex flex-col gap-6">
      <label for="creator-radio" class="text-xl"
        >Is the Data Creator the same as the Donor?*</label
      >

      <div id="creator-radio" class="flex gap-2 form-control max-w-sm">
        <label class="label cursor-pointer">
          <span class="label-text text-md">Yes</span>
          <input
            type="radio"
            class="radio radio-primary"
            on:change={() => setData('creator', currentUser)}
            bind:group={creatorIsDonor}
            value="Yes"
          />
        </label>
        <label class="label cursor-pointer">
          <span class="label-text text-md">No</span>
          <input
            type="radio"
            class="radio radio-primary"
            on:change={() => setData('creator', defaultCreator)}
            bind:group={creatorIsDonor}
            value="No"
          />
        </label>
      </div>
      <CreatorField name="creator" bind:creator={$data.creator} />
    </div>

    <div class="divider" />

    <h1 class="text-primary text-3xl px-0">Creators</h1>
    <div class="flex flex-col gap-6 px-0">
      <div class="divider" />
      <div class="flex flex-col gap-2">
        {#each creators as creator, index}
          <CreatorFieldArray
            {index}
            bind:creator
            on:remove_creator={removeCreator}
            on:add_creator={addCreator}
          />
        {/each}
        <button
          class="btn btn-secondary w-50 mx-auto"
          on:click|preventDefault={() =>
            addField('creators', defaultCreator, $data?.creators?.length || 0)}
          >Begin Adding Creators</button
        >
      </div>
    </div>

    <div class="divider" />

    <h1 class="px-0 text-primary text-3xl">Keywords</h1>
    <div class="flex flex-col gap-6 px-0">
      <div class="flex flex-col gap-2">
        {#each keywords as _keyword, index}
          <!-- this component doesn't use the "name" property, and instead binds itself
            directly to the property it's responsible for -->
          <Keyword
            {index}
            keywords={allKeywords}
            bind:value={$data.keywords[index]}
            on:remove_keyword={removeKeyword}
            on:add_keyword={addKeyword}
          />
        {/each}
        {#if !keywords.length}
          <button
            class="btn btn-secondary w-50 mx-auto"
            on:click|preventDefault={() => addField('keywords', '', 0)}
            >Begin Adding Keywords</button
          >
        {/if}
      </div>
    </div>
    <div class="flex gap-3">
      {#if onBack != null}
        <button
          class="btn btn-error w-32 mx-auto"
          on:click|preventDefault={() => onBack && onBack($data)}>Back</button
        >
      {/if}
      <button class="btn btn-primary w-32" type="submit"
        >{isLastStep ? 'Finish' : 'Next'}</button
      >
    </div>
  </form>
</div>
