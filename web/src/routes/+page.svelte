<script lang="ts">
  import { useQuery } from '@sveltestack/svelte-query'
  import trpc from '$lib/trpc'
  import DatasetGrid from '$components/DatasetGrid.svelte'

  const queryResult = useQuery(
    'topDatasetsByDate',
    async () =>
      await trpc(fetch).query('getDatasets', {
        orderBy: 'DateDonated',
        limit: 6,
      })
  )
  const queryResultHits = useQuery(
    'topDatasetsByHits',
    async () =>
      await trpc(fetch).query('getDatasets', {
        orderBy: 'NumHits',
        limit: 6,
      })
  )
</script>

<main class="px-4 max-w-[1640px] mx-auto">
  <div class="hero mx-auto my-12">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-3xl text-primary font-bold">
          Welcome to the UC Irvine Machine Learning Repository
        </h1>
        <p class="py-6">
          We currently maintain 612 datasets as a service to the machine learning
          community. Here, you can donate and find datasets used by millions of people all
          around the world!
        </p>
        <div class="flex justify-center gap-5 flex-wrap">
          <a href="/" class="btn btn-primary">View Datasets</a>
          <a href="/donation" class="btn btn-secondary">Contribute a Dataset</a>
        </div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 xl:grid-cols-2 w-full my-16 ">
    <div class="flex flex-col col-span-1 gap-1 p-4">
      {#each $queryResultHits.data || [] as dataset}
        <DatasetGrid {dataset} />
      {/each}
    </div>

    <div class="flex flex-col col-span-1 gap-1 p-4">
      {#each $queryResult.data || [] as dataset}
        <DatasetGrid {dataset} />
      {/each}
    </div>
  </div>
</main>
