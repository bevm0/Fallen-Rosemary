<script lang="ts">
  import { useQuery } from '@sveltestack/svelte-query'
  import { AbbrevNum } from '$lib/utils'
  import trpc from '$lib/trpc'

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

  const queryCount = useQuery('getCount', async () => await trpc(fetch).query('getCount'))
</script>

<main class="px-4 max-w-[1640px] mx-auto">
  <div class="hero mx-auto my-12">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-3xl text-primary font-bold">
          Welcome to the UC Irvine Machine Learning Repository
        </h1>
        <p class="py-6">
          We currently maintain {$queryCount.data} datasets as a service to the machine learning
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
    <div
      class="flex flex-col col-span-1 gap-1 p-4 border border-primary border-0 xl:border-r-2"
    >
      {#each $queryResultHits.data || [] as dataset}
        <div class="hover:bg-base-200 p-2 rounded-lg">
          <h1 class="text-primary text-center font-bold break-word underline">
            <a href="/dataset/{dataset.slug}" class="btn btn-ghost">
              {dataset.Name}
            </a>
          </h1>

          <div class="avatar col-span-1 self-center justify-center w-full my-2 sm:hidden">
            <div class="mask mask-squircle w-12 h-12 flex align-center">
              <img
                src={dataset?.Graphics != null
                  ? '/ml/datasets/' + dataset.ID + '/Graphics/SmallLarge.jpg'
                  : '/ml/datasets/default/SmallLarge.jpg'}
                alt=""
              />
            </div>
          </div>

          <div class="grid grid-cols-12">
            <div class="avatar col-span-1 self-center justify-self-center hidden sm:flex">
              <div class="mask mask-squircle w-12 h-12 flex align-center">
                <img
                  src={dataset?.Graphics != null
                    ? '/ml/datasets/' + dataset.ID + '/Graphics/SmallLarge.jpg'
                    : '/ml/datasets/default/SmallLarge.jpg'}
                  alt=""
                />
              </div>
            </div>

            <div class="col-span-11 gap-5 ml-4">
              <h2 class="my-4 line-clamp-4 break-word overflow-x-hidden">
                {dataset.Abstract}
              </h2>
              <div class="hidden md:grid grid-cols-12">
                <div class="col-span-4 flex gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6 stroke-primary"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                    />
                  </svg>

                  {dataset.Task}
                </div>
                <div class="col-span-4 flex gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6 stroke-primary"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z"
                    />
                  </svg>

                  {dataset?.NumInstances
                    ? AbbrevNum(dataset.NumInstances) + '  Instances'
                    : 'N/A'}
                </div>
                <div class="col-span-4 flex gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6 rotate-90 stroke-primary"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z"
                    />
                  </svg>

                  {dataset?.NumAttributes
                    ? AbbrevNum(dataset.NumAttributes) + '  Attributes'
                    : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="divider my-0" />
      {/each}
    </div>

    <div class="flex flex-col col-span-1 gap-1 p-4">
      {#each $queryResult.data || [] as dataset}
        <div class="hover:bg-base-200 p-2 rounded-lg">
          <h1 class="text-primary text-center font-bold break-word">
            <a href="/" class="btn btn-ghost">
              {dataset.Name}
            </a>
          </h1>

          <div class="avatar col-span-1 self-center justify-center w-full my-2 sm:hidden">
            <div class="mask mask-squircle w-12 h-12 flex align-center">
              <img
                src={dataset?.Graphics != null
                  ? '/ml/datasets/' + dataset.ID + '/Graphics/SmallLarge.jpg'
                  : '/ml/datasets/default/SmallLarge.jpg'}
                alt=""
              />
            </div>
          </div>

          <div class="grid grid-cols-12">
            <div class="avatar col-span-1 self-center justify-self-center hidden sm:flex">
              <div class="mask mask-squircle w-12 h-12 flex align-center">
                <img
                  src={dataset?.Graphics != null
                    ? '/ml/datasets/' + dataset.ID + '/Graphics/SmallLarge.jpg'
                    : '/ml/datasets/default/SmallLarge.jpg'}
                  alt=""
                />
              </div>
            </div>

            <div class="col-span-11 gap-5 ml-4">
              <h2 class="my-4 line-clamp-4 break-word overflow-x-hidden">
                {dataset.Abstract}
              </h2>
              <div class="hidden md:grid grid-cols-12">
                <div class="col-span-4 flex gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6 stroke-primary"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                    />
                  </svg>

                  {dataset.Task}
                </div>
                <div class="col-span-4 flex gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6 stroke-primary"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z"
                    />
                  </svg>

                  {dataset?.NumInstances
                    ? AbbrevNum(dataset.NumInstances) + '  Instances'
                    : 'N/A'}
                </div>
                <div class="col-span-4 flex gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6 rotate-90 stroke-primary"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z"
                    />
                  </svg>

                  {dataset?.NumAttributes
                    ? AbbrevNum(dataset.NumAttributes) + '  Attributes'
                    : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="divider my-0" />
      {/each}
    </div>
  </div>
</main>
