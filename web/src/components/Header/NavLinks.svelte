<script lang="ts">
  import CaretIcon from '$components/Icons/Caret.svelte'
</script>

<ul tabindex="0" class="menu menu-horizontal text-primary hidden md:flex">
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
