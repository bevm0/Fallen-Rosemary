<script lang="ts">
  import type { CreatorType } from '$lib/schemas/Creator'

  export let name = ''
  export let creator: CreatorType

  const CreatorFields: {
    field: keyof CreatorType
    required: boolean
    label: string
  }[] = [
    {
      field: 'firstName',
      required: true,
      label: 'First Name',
    },
    {
      field: 'lastName',
      required: true,
      label: 'Last Name',
    },
    {
      field: 'email',
      required: false,
      label: 'Email',
    },
    {
      field: 'institution',
      required: false,
      label: 'Institution',
    },
    {
      field: 'address',
      required: false,
      label: 'Address',
    },
  ]
</script>

<div class="flex flex-col gap-4">
  {#each CreatorFields as { field, label, required }}
    <label for="{name}.{field}" class="text-xl">{label}{required ? '*' : ''}</label>
    <input
      id="{name}.{field}"
      name="{name}.{field}"
      type="text"
      class="input input-bordered"
      {required}
      placeholder={label}
      bind:value={creator[field]}
    />
  {/each}
</div>
