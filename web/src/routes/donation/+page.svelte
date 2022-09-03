<script lang="ts">
  import { createForm } from 'felte'
  import { validator } from '@felte/validator-zod'
  import { reporter, ValidationMessage } from '@felte/reporter-svelte'
  import { z } from 'zod'
  import { onMount } from 'svelte'

  import papa from 'papaparse'

  const dateformat1 = /^(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])[/-]\d{4}$/
  const dateformat2 = /^(0?[1-9]|1[012])[/-](0?[1-9]|[12][0-9]|3[01])[/-]\d{4}$/
  const floatRegex = /^-?\d*(?:[.,]\d*?)?$/
  const intRegex = /^-?\d+$/

  const hasHeaders = false
  const missingIndicator = null
  function handleChange(event) {
    let files = event.target.files
    for (let f of files) {
      papa.parse(f, {
        header: false,
        skipEmptyLines: true,
        preview: 5000,
        fastmode: true,
        complete: function (results) {
          const { data } = results
          const ref = { current: document.getElementById('spreadsheet') }
          // each row is an attribute, either with a name or just "Attribute#"
          const attributes = data[0].map((header, i) => {
            if (hasHeaders && header !== null && header !== '') {
              return header
            } else {
              return 'Attribute' + (i + 1).toString()
            }
          })

          // remove all rows except one (since it won't let you do that)
          const currentRows = ref.current?.jspreadsheet.getData().length || 0
          for (let i = 0; i < currentRows - 1; i++) {
            ref.current?.jspreadsheet.deleteRow(0, null)
          }

          // add rows until it matches the number of attributes
          for (let i = 0; i < attributes.length - 1; i++) {
            ref.current?.jspreadsheet.insertRow(0)
          }

          // if there's a header row, exclude it from the parsing
          const dataToParse = hasHeaders ? data.slice(1) : data
          const numRows = hasHeaders ? data.length - 1 : data.length

          for (let col = 0; col < attributes.length; col += 1) {
            let missing = 'No'
            let variableType = null

            for (let row = 0; row < Math.min(numRows, 1000); row += 1) {
              const d = dataToParse[row][col].trim()
              if (d === missingIndicator) {
                missing = 'Yes'
              } else if (d.match(dateformat1) || d.match(dateformat2)) {
                variableType = 'Date'
              } else if (d.match(intRegex)) {
                variableType = 'Numerical - Discrete'
              } else if (d.match(floatRegex)) {
                variableType = 'Numerical - Continuous'
              } else {
                variableType = 'Categorical'
              }
            }

            const newRow = [
              attributes[col],
              'Feature',
              variableType || '',
              '',
              '',
              missing,
            ]
            ref.current?.jspreadsheet.setRowData(col, newRow)
          }
        },
      })
    }
  }
  const schema = z.object({
    metadata: z.object({
      DOI: z
        .string()
        .nullable()
        .transform((k) => k || null),
    }),
  })

  const { form, data, resetField, setData, addField, unsetField } = createForm({
    initialValues: {
      metadata: {
        DOI: null,
      },
      creators: [
        {
          firstName: '',
          lastName: '',
          emai: null,
          institution: null,
          address: null,
        },
      ],
    },
    extend: [validator({ schema }), reporter],
  })

  $: creators =
    ($data.creators as {
      firstName: string
      lastName: string
      email: string
      insitution: string
      address: string
    }[]) || []

  function removeCreator(index: number) {
    return () => unsetField(`creators.${index}`)
  }

  function addCreator(index: number) {
    return () =>
      addField(
        `creators`,
        { firstName: '', lastName: '', email: null, institution: null, address: null },
        index
      )
  }

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
      onchange: () => {
        setData(
          'tabledata',
          document.getElementById('spreadsheet')?.jspreadsheet.getData()
        )
      },
      minDimensions: [6, 10],
      columns: [
        { title: 'Names', width: 120 },
        {
          title: 'Role',
          type: 'dropdown',
          source: ['ID', 'Target', 'Other', 'Feature'],
          width: 120,
        },
        {
          title: 'Variable Type',
          type: 'dropdown',
          width: 240,
          source: [
            'Numerical - Continuous',
            'Numerical - Discrete',
            'Categorical',
            'Date',
          ],
        },
        { title: 'Units', width: 70 },
        { title: 'Description', width: 140 },
        {
          title: 'Missing Values',
          type: 'dropdown',
          width: 140,
          source: ['No', 'Yes'],
        },
      ],
    })
  }

  onMount(initializeJspreadsheet)

  const handleSubmit = () => {
    console.log($data)
  }

  const Types = [
    'Tabular',
    'Sequential',
    'Multivariate',
    'Time-Series',
    'Text',
    'Image',
    'Other',
  ]
  const Tasks = ['Classification', 'Regression', 'Clustering', 'Other']
  const Areas = [
    'Business',
    'Computer Science',
    'Engineering',
    'Game',
    'Law',
    'Life Science',
    'Physical Science',
    'Social Science',
    'Other',
  ]

  const descriptive_fields = [
    'purpose',
    'funding',
    'represent',
    'dataSplits',
    'sensitiveInfo',
    'preprocessingDescription',
    'used',
    'otherInfo',
    'datasetCitation',
  ] as const

  const descriptive_labels: { [key in typeof descriptive_fields[number]]: string } = {
    purpose: 'For what purpose was the dataset created?',
    funding: 'Who funded the creation of the dataset?',
    represent: 'What do the instances that comprise the dataset represent?',
    dataSplits: 'Are there recommended data splits?',
    sensitiveInfo:
      'Does the dataset contain data that might be considered sensitive in any way?',
    preprocessingDescription: 'Was there any data preprocessing performed?',
    used: 'Has the dataset been used for any tasks already?',
    otherInfo: 'Additional Information',
    datasetCitation: 'Citation Requests/Acknowledgements',
  }
</script>

{JSON.stringify($data, null, 2)}
<form use:form>
  <h1 class="text-2xl text-primary">Dataset Name</h1>
  <input type="text" name="name" class="input input-md input-bordered" />
  <div class="divider" />

  <h1 class="text-2xl text-primary">Metadata</h1>

  <p class="text-xl">Abstract</p>
  <input type="text" name="metadata.Abstract" class="input input-md input-bordered" />

  <p class="text-xl">Types</p>

  <div>
    {#each Types as Type}
      <label for="">
        {Type}
        <input
          type="checkbox"
          name="metadata.Types"
          class="input input-md input-bordered"
          value={Type}
        />
      </label>
    {/each}
  </div>

  <h1 class="text-2xl text-primary">Areas</h1>
  <div>
    {#each Areas as Area}
      <label for="">
        {Area}
        <input
          type="radio"
          name="metadata.Area"
          class="input input-md input-bordered"
          value={Area}
        />
      </label>
    {/each}
  </div>

  <h1 class="text-2xl text-primary">Tasks</h1>
  <div>
    {#each Tasks as Task}
      <label for="">
        {Task}
        <input
          type="checkbox"
          name="metadata.Tasks"
          class="input input-md input-bordered"
          value={Task}
        />
      </label>
    {/each}
  </div>

  <button
    class="btn btn-xl btn-primary"
    on:click|preventDefault={() => {
      const yeet = document.getElementById('spreadsheet')
      console.log(yeet.jexcel.insertRow())
    }}>HSDLKJFL</button
  >
  <label for="">
    NO DOI
    <input
      type="radio"
      name="metadata.DOI"
      class="input input-md input-bordered"
      checked={$data?.metadata?.DOI == null}
      value="null"
    />
  </label>

  <label for="">
    YES DOI
    <input
      type="radio"
      name="metadata.DOI"
      class="input input-md input-bordered"
      value=""
    />
  </label>

  {#if $data?.metadata?.DOI != null}
    <label for="">
      Custom DOI
      <input type="text" name="metadata.DOI" class="input input-md input-bordered" />
    </label>
  {/if}

  {#each creators as creator, index}
    <label for="">
      {creator.firstName}
      <input
        type="text"
        name="creators.{index}.firstName"
        class="input input-bordered input-xl"
      />
    </label>
    <label for="">
      {creator.lastName}
      <input
        type="text"
        name="creators.{index}.lastName"
        class="input input-bordered input-xl"
      />
    </label>
    <label for="">
      {creator.email}
      <input
        type="text"
        name="creators.{index}.email"
        class="input input-bordered input-xl"
      />
    </label>
    <label for="">
      {creator.insitution}
      <input
        type="text"
        name="creators.{index}.institution"
        class="input input-bordered input-xl"
      />
    </label>
    <label for="">
      {creator.address}
      <input
        type="text"
        name="creators.{index}.address"
        class="input input-bordered input-xl"
      />
    </label>
    <button class="btn btn-large btn-primary" on:click|preventDefault={addCreator(index)}
      >Add MORE</button
    >
    <button
      class="btn btn-large btn-primary"
      on:click|preventDefault={removeCreator(index)}>REMOVE MORE</button
    >
  {/each}

  {#each descriptive_fields as field}
    <label for="">
      {descriptive_labels[field]}
      <input
        type="text"
        name="descriptive.{field}"
        class="input input-bordered input-primary"
      />
    </label>
  {/each}
</form>
<button type="submit" on:click|preventDefault={handleSubmit}>Submit</button>
<div class="my-10">
  <input type="file" on:change={handleChange} />
</div>

<div id="spreadsheet" />
{JSON.stringify($data, null, 2)}
<div class="my-16" />
