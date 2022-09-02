<script lang="ts">
  import { QueryClientProvider } from '@sveltestack/svelte-query'
  import { queryClient } from '$lib/query'

  import HeaderBody from '$components/Header/index.svelte'

  import '../app.css'
</script>

<QueryClientProvider client={queryClient}>
  <HeaderBody>
    <slot />
  </HeaderBody>
</QueryClientProvider>
