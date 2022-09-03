<script lang="ts">
  import { createForm } from 'felte'
  import { validator } from '@felte/validator-zod'
  import { reporter, ValidationMessage } from '@felte/reporter-svelte'
  import { z } from 'zod'
  import { onMount } from 'svelte'

  const schema = z.object({
    interests: z
      .object({
        name: z.string().min(5),
        password: z.string().min(6),
        email: z.string().email().min(1),
      })
      .array(),
  })

  const { form, data, addField, unsetField, errors } = createForm({
    initialValues: {
      interests: [{ name: '', password: '', email: '' }],
    },
    extend: [validator({ schema }), reporter],
  })

  $: interests = $data.interests as string[]

  function removeInterest(index: number) {
    return () => unsetField(`interests.${index}`)
  }

  function addInterest(index: number) {
    return () => addField(`interests`, { value: '' }, index)
  }

  const handleSubmit = () => {
    console.log($data)
  }

  var data2 = [
    ['Jazz', 'Honda', '2019-02-12', '', true, '$ 2.000,00', '#777700'],
    ['Civic', 'Honda', '2018-07-11', '', true, '$ 4.000,01', '#007777'],
  ]

  const initializeJspreadsheet = async () => {
    // awaiting an import doesn't do a default import, but Jspreadsheet doesn't agree
    // so I'll force it to agree
    const jspreadsheet = (await import('jspreadsheet-ce')) as unknown as {
      default: jspreadsheet.JSpreadsheet
    }

    // get the default export, which is a function to initialize the spreadsheet
    const createSpreadsheet = jspreadsheet.default

    // make the spreadsheet, fuck this library
    createSpreadsheet(document.getElementById('spreadsheet') as HTMLDivElement, {
      data: data2,
      columns: [
        { type: 'text', title: 'Car', width: 120 },
        {
          type: 'dropdown',
          title: 'Make',
          width: 200,
          source: ['Alfa Romeo', 'Audi', 'Bmw'],
        },
        { type: 'calendar', title: 'Available', width: 200 },
        { type: 'image', title: 'Photo', width: 120 },
        { type: 'checkbox', title: 'Stock', width: 80 },
        { type: 'numeric', title: 'Price', width: 100, mask: '$ #.##,00', decimal: ',' },
        { type: 'color', width: 100, render: 'square' },
      ],
    })
  }

  onMount(initializeJspreadsheet)
</script>

<div id="spreadsheet" />
<div class="h-auto">
  <form use:form>
    {#each interests as interest, index}
      <div class="flex flex-col">
        <input name="interests.{index}.name" class="input input-md input-bordered" />
        <ValidationMessage for="interests.{index}.name" let:messages={message}>
          <span class="text-red-400">{message || ''}</span>
        </ValidationMessage>
      </div>
      <div class="flex flex-col">
        <input name="interests.{index}.password" class="input input-md input-bordered" />
        <ValidationMessage for="interests.{index}.password" let:messages={message}>
          <span class="text-red-400">{message || ''}</span>
        </ValidationMessage>
      </div>
      <div class="flex flex-col">
        <input name="interests.{index}.email" class="input input-md input-bordered" />
        <ValidationMessage for="interests.{index}.email" let:messages={message}>
          <span class="text-red-400">{message || ''}</span>
        </ValidationMessage>
      </div>
      <button class="btn btn-primary" type="button" on:click={addInterest(index + 1)}>
        Add Interest
      </button>
      <button class="btn btn-primary" type="button" on:click={removeInterest(index)}>
        Remove Interest
      </button>
    {/each}
  </form>
</div>
<button type="submit" on:click|preventDefault={handleSubmit}>Submit</button>
