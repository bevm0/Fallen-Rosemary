<script lang="ts">
  import SearchIcon from '$components/Icons/Search.svelte'
  import CaretIcon from '$components/Icons/Caret.svelte'
  import HamburgerIcon from '$components/Icons/Hamburger.svelte'
  import CloseIcon from '$components/Icons/X.svelte'
  import ProfileIcon from '$components/Icons/Profile.svelte'

  let searchOpen = false

  function clickOutside(node: HTMLElement) {
    const handleClick = (event: KeyboardEvent) => {
      if (!node.contains(event.target as HTMLInputElement)) {
        node.dispatchEvent(new CustomEvent('outclick'))
      }
    }

    document.addEventListener('click', handleClick, true)

    return {
      destroy() {
        document.removeEventListener('click', handleClick, true)
      },
    }
  }

  // if window resizes, just close the searchbar
  const handleResize = () => {
    searchOpen = false
  }
</script>

<svelte:window on:resize={handleResize} />

<div class="drawer drawer-end">
  <input
    id="sidebar"
    type="checkbox"
    class="drawer-toggle"
    aria-labelledby="hidden-sidebar-label"
  />
  <label id="hidden-sidebar-label" for="sidebar" class="hidden">Sidebar</label>
  <div class="drawer-content flex flex-col">
    <nav class="navbar bg-base-100 drop-shadow-md">
      {#if searchOpen}
        <div
          class="w-full input input-sm input-bordered border-primary"
          use:clickOutside
          on:outclick={handleResize}
        >
          <input type="text" class="w-full outline-none bg-transparent" />
          <div class="sm:hidden my-auto" on:click={() => (searchOpen = !searchOpen)}>
            <button class="btn btn-ghost btn-circle btn-sm" aria-label="toggle sidebar">
              <SearchIcon />
            </button>
          </div>
        </div>
      {:else}
        <div class="navbar-start">
          <button class="btn btn-ghost">
            <img src="/assets/header/navbar.svg" alt="logo" class="h-12 p-1" />
          </button>
        </div>
      {/if}
      <ul
        tabindex="0"
        class="navbar-center menu menu-horizontal text-primary hidden md:flex"
      >
        <li class=""><a href="/">Datasets</a></li>
        <li class="dropdown dropdown-hover">
          <a href="/">
            <span class="hidden lg:block"> Donate a Dataset </span>
            <span class="lg:hidden"> Contribute a Dataset </span>
            <CaretIcon class="rotate-90 block lg:hidden" />
          </a>
          <ul
            tabindex="0"
            class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 lg:hidden"
          >
            <li><a href="/">Donate a Dataset</a></li>
            <li><a href="/">Link an External Dataset</a></li>
          </ul>
        </li>
        <li class="hidden lg:block"><a href="/">Link a Dataset</a></li>
      </ul>

      <div class="flex justify-end gap-3" class:navbar-end={!searchOpen}>
        <div class="form-control">
          {#if !searchOpen}
            <div class="sm:hidden" on:click={() => (searchOpen = !searchOpen)}>
              <button class="btn btn-ghost btn-circle btn-sm" aria-label="toggle sidebar">
                <SearchIcon />
              </button>
            </div>
          {/if}
          <div
            class="hidden sm:flex justify-between input input-sm input-bordered border-primary rounded-full"
          >
            <input
              id="searchbar"
              type="text"
              aria-labelledby="hidden-search-label"
              class="outline-none w-5/6 hidden sm:block"
            />
            <label id="hidden-search-label" for="searchbar" class="hidden"
              >Search By</label
            >
            <button class="btn btn-ghost btn-circle btn-sm">
              <SearchIcon />
            </button>
          </div>
        </div>
        <div class="dropdown dropdown-end">
          <label
            tabindex="0"
            for="profile"
            class="btn btn-ghost btn-circle text-primary hidden md:flex"
          >
            <ProfileIcon />
          </label>
          <ul
            tabindex="0"
            class="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li><a href="/">Profile</a></li>
            <li><a href="/">Admin Dashboard</a></li>
            <li><a href="/">Logout</a></li>
          </ul>
        </div>
        <label
          for="sidebar"
          class="btn btn-ghost btn-circle text-primary swap swap-rotate md:hidden"
        >
          <!-- this hidden checkbox controls the state -->
          <input id="sidebar-nav" type="checkbox" aria-labelledby="sidebar-nav-label" />
          <label id="sidebar-nav-label" for="sidebar-nav" class="hidden"
            >Toggle Sidebar</label
          >
          <HamburgerIcon class="swap-off" />
          <CloseIcon class="swap-on" />
        </label>
      </div>
    </nav>
    <slot />
  </div>
  <div class="drawer-side">
    <label for="sidebar" class="drawer-overlay" />
    <div class="menu p-4 overflow-y-auto w-80 bg-base-100">
      <label for="sidebar" class="drawer-overlay btn btn-ghost btn-circle ml-auto">
        <!-- close icon -->
        <CloseIcon class="fill-red-600" />
      </label>
      <ul>
        <!-- Sidebar content here -->
        <li><a href="/">Home</a></li>
        <li><a href="/">Datasets</a></li>
        <li><a href="/">Donate a Dataset</a></li>
        <li><a href="/">Link an External Dataset</a></li>

        <li class="divider" />

        <li><a href="/">Profile</a></li>
        <li><a href="/">Admin Dashboard</a></li>

        <li class="divider" />

        <li><a href="/">Logout</a></li>
      </ul>
    </div>
  </div>
</div>
