<script lang="ts">
  import { useQuery } from '@sveltestack/svelte-query'
  import { AbbrevNum } from '$lib/utils'
  import trpc from '$lib/trpc'

  const queryResult = useQuery(
    'getDatasets',
    async () =>
      await trpc(fetch).query('getDatasets', {
        orderBy: 'DateDonated',
        limit: 6,
      })
  )
</script>

<div class="hero mx-auto my-12 bg-base-200">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-3xl text-primary font-bold">
        Welcome to the UC Irvine Machine Learning Repository
      </h1>
      <p class="py-6">
        We currently maintain 612 datasets as a service to the machine learning community.
        Here, you can donate and find datasets used by millions of people all around the
        world!
      </p>
      <div class="flex justify-center gap-5">
        <button class="btn btn-primary">View Datasets</button>
        <button class="btn btn-secondary">Contribute a Dataset</button>
      </div>
    </div>
  </div>
</div>

<div class="grid grid-cols-2 gap-2 mx-4">
  <div class="flex flex-col col-span-1 gap-6 my-16 mx-6 max-w-[40vw]">
    {#each $queryResult.data || [] as dataset}
      <div>
        <h1 class="divider text-primary font-bold">
          <a href="/" class="btn btn-ghost text-lg p-1">
            {dataset.Name}
          </a>
        </h1>
        <div class="grid grid-cols-12 gap-5">
          <div class="avatar col-span-1 flex self-center justify-self-center">
            <div class="mask mask-squircle w-12 h-12 flex align-center">
              <img
                src={dataset?.Graphics != null
                  ? '/ml/datasets/' + dataset.ID + '/Graphics/SmallLarge.jpg'
                  : '/ml/datasets/default/SmallLarge.jpg'}
                alt="Avatar Tailwind CSS Component"
              />
            </div>
          </div>

          <div class="col-span-11 gap-5">
            <h2 class="my-4 line-clamp-2">{dataset.Abstract}</h2>
            <div class="grid grid-cols-12">
              <div class="col-span-4 flex">
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
              <div class="col-span-4 flex">
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
              <div class="col-span-4 flex">
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
            <div class="flex" />
          </div>
        </div>
      </div>
    {/each}
  </div>

  <!-- 2 -->

  <div class="flex flex-col col-span-1 gap-6 my-16 mx-6 max-w-[40vw]">
    {#each $queryResult.data || [] as dataset}
      <div>
        <h1 class="divider text-primary font-bold">
          <a href="/" class="btn btn-ghost text-lg p-1">
            {dataset.Name}
          </a>
        </h1>
        <div class="grid grid-cols-12 gap-5">
          <div class="avatar col-span-1 flex self-center justify-self-center">
            <div class="mask mask-squircle w-12 h-12 flex align-center">
              <img
                src={dataset?.Graphics != null
                  ? '/ml/datasets/' + dataset.ID + '/Graphics/SmallLarge.jpg'
                  : '/ml/datasets/default/SmallLarge.jpg'}
                alt="Avatar Tailwind CSS Component"
              />
            </div>
          </div>

          <div class="col-span-11 gap-5">
            <h2 class="my-4 line-clamp-2">{dataset.Abstract}</h2>
            <div class="grid grid-cols-12">
              <div class="col-span-4 flex">
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
              <div class="col-span-4 flex">
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
              <div class="col-span-4 flex">
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
            <div class="flex" />
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
