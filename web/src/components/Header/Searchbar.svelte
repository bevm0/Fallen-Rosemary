<script lang="ts">
  import { clickOutside } from '$lib/actions'
  import trpc from '$lib/trpc'

  import { useQuery } from '@sveltestack/svelte-query'

  import SearchIcon from '$components/Icons/Search.svelte'
  import Autocomplete from '$components/Autocomplete.svelte'

  // input
  let search = ''

  // is searching will respond to the length of search string, but also to radio buttons
  $: isSearching = search.length > 0

  // controls
  //////////////////////////////////////////
  const openSearch = () => (isSearching = true)
  const closeSearch = () => (isSearching = false)

  // search results
  //////////////////////////////////////////
  const nameResult = useQuery(
    'getDatasetNames',
    async () => await trpc(fetch).query('getDatasetNames')
  )

  const keywordResult = useQuery(
    'getKeywords',
    async () => await trpc(fetch).query('getKeywords')
  )

  // use search type to determine which options to show
  let searchType = 'names'

  // autocomplete options is reactive to the search type as well as the queries
  $: autocompleteOptions = searchType === 'keywords' ? keywords : names
  $: keywords = $keywordResult.data || []
  $: names = $nameResult.data || []
</script>

<div
  class={`relative w-full ml-auto lg:max-w-sm input input-sm input-bordered border-primary rounded-full`}
  use:clickOutside
  on:outside_click={closeSearch}
  on:outside_click
>
  <div class="relative w-full h-full flex justify-end my-auto">
    <input
      type="text"
      class="w-full outline-none bg-transparent"
      bind:value={search}
      on:click={openSearch}
      aria-label="search-input"
    />
    <div on:click>
      <button class="btn btn-ghost btn-circle btn-sm" aria-label="toggle sidebar">
        <SearchIcon />
      </button>
    </div>

    <!-- expose the item prop for the slot that renders each item -->
    <Autocomplete options={autocompleteOptions} isOpen={isSearching} searchValue={search}>
      <!-- use the "above" named slot to add in the two radio buttons that control search type -->
      <div class="p-2 flex justify-evenly flex-wrap" slot="above">
        <div class="form-control">
          <label class="label cursor-pointer flex gap-3">
            <span class="label-text">Name</span>
            <input
              type="radio"
              name="radio-6"
              class="radio checked:bg-primary"
              bind:group={searchType}
              value="names"
            />
          </label>
        </div>
        <div class="form-control">
          <label class="label cursor-pointer flex gap-3">
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

      <!-- use the list item slot to render each item forwarded from the virtual list -->
      <a slot="list-item" href="/" let:item on:click={() => (search = item)}>
        {item}
      </a>
    </Autocomplete>
  </div>
</div>
