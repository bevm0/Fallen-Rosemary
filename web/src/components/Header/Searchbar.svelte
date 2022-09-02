<script lang="ts">
  import { clickOutside } from '$lib/actions'

  import SearchIcon from '$components/Icons/Search.svelte'

  // possible autocomplete lists
  let keywords = ['anime', 'gamer', 'tarnished']
  let names = ['Vill-V', 'Saber', 'Rem']

  // input
  let search = ''

  // use search type to derive the autocomplete options
  let searchType = 'keywords'
  $: autocompleteOptions = searchType === 'keywords' ? keywords : names

  // is searching will respond to the length of search string, but also to events
  $: isSearching = search.length > 0

  // open and close the search bar
  const openSearch = () => (isSearching = true)
  const closeSearch = () => (isSearching = false)

  // selecting an autocomplete option will update the search string
  const handleAutocompleteClick = (search_selected: string) => {
    search = search_selected
  }
</script>

<div
  class={`relative w-full ml-auto lg:max-w-sm input input-sm input-bordered border-primary rounded-full`}
  use:clickOutside
  on:outside_click={closeSearch}
>
  <div class="relative w-full h-full flex justify-end my-auto">
    <input
      type="text"
      class="w-full outline-none bg-transparent"
      bind:value={search}
      on:click={openSearch}
    />
    <div on:click>
      <button class="btn btn-ghost btn-circle btn-sm" aria-label="toggle sidebar">
        <SearchIcon />
      </button>
    </div>
    <div
      tabindex="0"
      class="absolute w-full top-full collapse border border-base-300 border-t-primary border-b-0 outline-none bg-base-100"
      class:collapse-open={isSearching}
    >
      <div class="collapse-content">
        <div>
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">Name</span>
              <input
                type="radio"
                name="radio-6"
                class="radio checked:bg-primary"
                bind:group={searchType}
                value="name"
              />
            </label>
          </div>
          <div class="form-control">
            <label class="label cursor-pointer">
              <span class="label-text">Keyword</span>
              <input
                type="radio"
                name="radio-6"
                class="radio checked:bg-primary"
                bind:group={searchType}
                value="keywords"
              />
            </label>
          </div>
        </div>
        <div class="divider m-0" />
        <ul tabindex="0" class="menu menu-compact dropdown-content px-0">
          {#each autocompleteOptions as item}
            <li class="w-full">
              <a href="/" on:click={() => handleAutocompleteClick(item)}>{item}</a>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
</div>
