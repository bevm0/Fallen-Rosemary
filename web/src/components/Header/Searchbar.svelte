<script lang="ts">
  import { clickOutside } from '$lib/actions'

  import { useQuery } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'

  import VirtualList from '$components/VirtualList.svelte'
  import SearchIcon from '$components/Icons/Search.svelte'

  // input
  let search = ''

  // is searching will respond to the length of search string, but also to radio buttons
  $: isSearching = search.length > 0

  // controls
  //////////////////////////////////////////
  const openSearch = () => (isSearching = true)
  const closeSearch = () => (isSearching = false)

  // selecting an autocomplete option will update the search string
  const handleAutocompleteClick = (search_selected: string) => {
    search = search_selected
  }

  // search results
  //////////////////////////////////////////
  const queryResult = useQuery(
    'getNames',
    async () => await trpc(fetch).query('getNames')
  )

  // use search type to determine which options to show
  let searchType = 'names'

  // autocomplete options is reactive to the search type as well as the queries
  $: autocompleteOptions = (searchType === 'keywords' ? keywords : names).filter((word) =>
    word.includes(search)
  )
  $: keywords = $queryResult.data?.keywords || []
  $: names = $queryResult.data?.names || []
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
    />
    <div on:click>
      <button class="btn btn-ghost btn-circle btn-sm" aria-label="toggle sidebar">
        <SearchIcon />
      </button>
    </div>
    <div
      tabindex="0"
      class="absolute w-full top-full collapse border border-base-300 border-t-primary border-b-0 outline-none bg-base-100 max-h-80 overflow-y-scroll scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100 scrollbar-thumb-rounded-full"
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
                value="names"
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
        <VirtualList items={autocompleteOptions} let:item>
          <li>
            <a href="/" on:click={() => handleAutocompleteClick(item)}>{item}</a>
          </li>
        </VirtualList>
      </div>
    </div>
  </div>
</div>
