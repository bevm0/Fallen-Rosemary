<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import Fa from 'svelte-fa'
  import { faPlus, faX } from '@fortawesome/free-solid-svg-icons'

  import type { CreatorType } from '$lib/schemas/Creator'
  import CreatorField from './CreatorField.svelte'

  export let index: number

  // a creator object that will be forwarded and bound to the underlying creator field
  export let creator: CreatorType

  // when an action occurs on this field, forward it to the parent field array
  const dispatch = createEventDispatcher()

  // remove a keyword from the field array
  function dispatchRemove() {
    dispatch('remove_creator', {
      index,
    })
  }

  // add a keyword to the field array
  function dispatchAdd() {
    dispatch('add_creator', {
      index,
    })
  }
</script>

<div class="flex justify-between">
  <h1 class="text-2xl">Creator {index + 1}</h1>
  <button class="btn btn-error rounded-full" on:click|preventDefault={dispatchRemove}
    ><Fa icon={faX} /></button
  >
</div>
<CreatorField name="creators.{index}" bind:creator />
<button class="btn btn-primary w-40 my-4 flex gap-3" on:click|preventDefault={dispatchAdd}
  ><Fa icon={faPlus} />
  <span> Add Creator </span>
</button>
