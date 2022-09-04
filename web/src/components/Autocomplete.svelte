<script lang="ts">
  import VirtualList from './VirtualList.svelte'
  export let isOpen = false
  export let options: string[] = []
  export let isAbsolute = true

  // pass in height as a tailwind class
  export let height = 'h-64'

  // don't bind to searchValue, just pass it in as a prop and allow this
  // component to produce the correct options
  export let searchValue = ''

  $: filteredOptions = options.filter((option) => option.includes(searchValue))
</script>

<div
  tabindex="0"
  class="w-full top-full collapse border-base-300 bg-base-100"
  class:collapse-open={isOpen}
  class:absolute={isAbsolute}
  class:border={isOpen}
>
  <div class="collapse-content p-0">
    <slot name="above" />

    <ul class="menu {height}">
      <!-- default slot allows you to wrap the virtual list -->
      <VirtualList items={filteredOptions} let:item>
        <slot name="list-item" {item}>
          {item}
        </slot>
      </VirtualList>
    </ul>
  </div>
</div>
