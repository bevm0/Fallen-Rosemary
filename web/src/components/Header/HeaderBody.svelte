<script lang="ts">
  import Searchbar from './Searchbar.svelte'
  import NavLinks from './NavLinks.svelte'
  import Profile from './Profile.svelte'

  import SearchIcon from '$components/Icons/Search.svelte'
  import HamburgerIcon from '$components/Icons/Hamburger.svelte'
  import CloseIcon from '$components/Icons/X.svelte'

  let searchOpen = false

  const closeSearchbar = () => {
    searchOpen = false
  }
</script>

<svelte:window on:resize={closeSearchbar} />

<nav class="navbar bg-base-100 drop-shadow-md">
  <!-- left side of navbar, searchbar or logo button -->
  {#if searchOpen}
    <Searchbar on:outside_click={closeSearchbar} />
  {:else}
    <div class="navbar-start">
      <button class="btn btn-ghost">
        <img src="/assets/header/navbar.svg" alt="logo" class="h-12 p-1" />
      </button>
    </div>
  {/if}

  <!-- center of navbar, navigation links -->
  <div class="navbar-center">
    <NavLinks />
  </div>

  <!-- right side of navbar, profile icon or sidebar toggle -->
  <div class="flex justify-end gap-3" class:navbar-end={!searchOpen}>
    <!-- SEARCHBAR toggle -->
    <div class="form-control w-full flex justify-end">
      {#if !searchOpen}
        <div
          class="sm:hidden flex justify-end"
          on:click={() => (searchOpen = !searchOpen)}
        >
          <button class="btn btn-ghost btn-circle btn-sm" aria-label="toggle sidebar">
            <SearchIcon />
          </button>
        </div>
      {/if}
      <div class="hidden sm:flex">
        <Searchbar />
      </div>
    </div>

    <!-- profile icon and dropdown menu -->
    <Profile />

    <!-- SIDEBAR toggle -->
    <label
      for="sidebar"
      class="btn btn-ghost btn-circle text-primary swap swap-rotate md:hidden"
    >
      <input id="sidebar-nav" type="checkbox" aria-labelledby="sidebar-nav-label" />
      <label id="sidebar-nav-label" for="sidebar-nav" class="hidden">Toggle Sidebar</label
      >
      <HamburgerIcon class="swap-off" />
      <CloseIcon class="swap-on" />
    </label>
  </div>
</nav>
