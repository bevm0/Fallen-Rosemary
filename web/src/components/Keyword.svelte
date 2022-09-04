<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { clickOutside } from '$lib/actions'

  import Autocomplete from './Autocomplete.svelte'
  import Fa from 'svelte-fa'
  import { faX, faPlus } from '@fortawesome/free-solid-svg-icons'

  export let keywords: string[] = []
  export let index: number

  // this keyword search box will manage its own value, and a parent form component
  // can observe it through binding, e.g.
  // <KeywordAutocomplete bind:value={variableInParentComponent} />
  export let value = ''

  // a keyword autocomplete will just display a list of strings, e.g. keywords
  // when attempting to remove or add, an event will be dispatched to the parent
  // component, hosting a field array, which will handle the event
  const dispatch = createEventDispatcher()

  // remove a keyword from the field array
  function dispatchRemove() {
    dispatch('remove_keyword', {
      index,
    })
  }

  // add a keyword to the field array
  function dispatchAdd() {
    dispatch('add_keyword', {
      index,
    })
  }

  // value is responsive based on assignment, and bound to other form handlers,
  // e.g. in a parent form control
  // if somebody selects an option, update the value and close the autocomplete
  function handleChange(newValue: string) {
    value = newValue
    close()
  }

  let isOpen = false

  function close() {
    isOpen = false
  }

  function open() {
    isOpen = true
  }
</script>

<div
  class="flex items-center justify-between gap-3 flex-wrap w-full h-full relative"
  use:clickOutside
  on:outside_click={close}
  on:outside_click
>
  <input type="text" bind:value class="input input-bordered w-1/2" on:click={open} />
  <div class="flex gap-2">
    <button
      class="btn btn-primary btn-glass btn-outline rounded-full"
      on:click|preventDefault={dispatchAdd}><Fa icon={faPlus} /></button
    >
    <button
      class="btn btn-error btn-glass btn-outline rounded-full"
      on:click|preventDefault={dispatchRemove}><Fa icon={faX} /></button
    >
  </div>
  <div class="w-1/2 h-full relative mr-auto">
    <Autocomplete options={keywords} {isOpen} isAbsolute searchValue={value}>
      <li slot="list-item" let:item>
        <a href="/" on:click|preventDefault={() => handleChange(item)}>
          {item}
        </a>
      </li>
    </Autocomplete>
  </div>
</div>
