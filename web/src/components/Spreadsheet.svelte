<script lang="ts">
  export let hasHeaderRow = false
  export let missingIndicator: string | null = null

  // let a parent component bind to the files this component has
  // will update whenever csvFile changes
  export let file: File

  import { onMount } from 'svelte'
  import { parse } from 'papaparse'

  import Fa from 'svelte-fa'
  import { faFileExcel, faX } from '@fortawesome/free-solid-svg-icons'

  import type { CellValue, JSpreadsheetElement } from 'jspreadsheet-ce'

  // reference to the DOM node containing the jspreadsheet/jexcel properties
  // they have a bunch of spreadsheet operations, and they do the same thing
  let jexcelRef: JSpreadsheetElement

  // save the csvFile
  let csvRef: HTMLInputElement

  // the actual DOM node that has Jexcel/Jspreadsheet as a property
  interface JexcelDivElement extends HTMLDivElement {
    jexcel: JSpreadsheetElement
  }

  export let value: CellValue[][] = []

  const dateformat1 = /^(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])[/-]\d{4}$/
  const dateformat2 = /^(0?[1-9]|1[012])[/-](0?[1-9]|[12][0-9]|3[01])[/-]\d{4}$/
  const floatRegex = /^-?\d*(?:[.,]\d*?)?$/
  const intRegex = /^-?\d+$/

  const minDimensions = [6, 10] as [number, number]

  function handleChange(event: Event) {
    let newFiles = Array.from((event.target as HTMLInputElement).files || [])

    // there's only one file, so just get the first one
    file = newFiles[0]
    parse(newFiles[0], {
      header: false,
      skipEmptyLines: true,
      preview: 5000,
      fastMode: true,
      complete: function (results) {
        const data = results.data as string[][]

        // each row is an attribute, either with a name or just "Attribute#"
        const attributes = data[0].map((header, i) => {
          if (hasHeaderRow && header !== null && header !== '') {
            return header
          } else {
            return 'Attribute' + (i + 1).toString()
          }
        })

        // remove all rows except one (since it won't let you do that)
        const currentRows = jexcelRef.getData().length || 0
        for (let i = 0; i < currentRows - 1; i++) {
          jexcelRef.deleteRow(0, null)
        }

        // add rows until it matches the number of attributes
        for (let i = 0; i < attributes.length - 1; i++) {
          jexcelRef.insertRow(0)
        }

        // if there's a header row, exclude it from the parsing
        const dataToParse = hasHeaderRow ? data.slice(1) : data
        const numRows = hasHeaderRow ? data.length - 1 : data.length

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

          const newRow = [attributes[col], 'Feature', variableType || '', '', '', missing]
          jexcelRef.setRowData(col, newRow)
        }
      },
    })
  }

  const initializeJspreadsheet = async () => {
    // awaiting an import doesn't do a default import, but Jspreadsheet doesn't agree
    // so I'll force it to agree
    const jspreadsheet = (await import('jspreadsheet-ce')) as unknown as {
      default: jspreadsheet.JSpreadsheet
    }

    // get the default export, which is a function to initialize the spreadsheet
    // equivalent of import createSpreadsheet from 'jspreadsheet-ce' at top level
    // but this website also runs server side, and default import has browser side effects
    const createSpreadsheet = jspreadsheet.default

    createSpreadsheet(document.getElementById('spreadsheet') as HTMLDivElement, {
      onchange: () => {
        value = (
          document.getElementById('spreadsheet') as JexcelDivElement
        )?.jexcel.getData()
      },
      // either use min dimensions for uninitialized data, or just use the data provided
      ...(value?.length ? { data: value } : { minDimensions }),
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

    // save a reference to the jexcel/jspreadsheet ref in state
    // it would be nice if this could be done with bind:this={jexcelRef}
    jexcelRef = (document?.getElementById('spreadsheet') as JexcelDivElement)?.jexcel
  }

  onMount(initializeJspreadsheet)

  const removeFile = () => {
    // reset file
    csvRef.value = ''

    // reset spreadsheet data with 6 x 2 empty arrays (e.g. min dimensions
    jexcelRef.setData(Array(minDimensions[1]).fill(Array(minDimensions[0]).fill([])))
  }
</script>

<div class="flex flex-col gap-6">
  <label
    class="relative border border-primary h-24 cursor-pointer rounded-md flex items-center justify-center border-dashed"
  >
    {#if csvRef?.files?.[0]}
      <div class="flex gap-3 items-center justify-center h-full">
        <div on:click|preventDefault={removeFile}>
          <Fa
            icon={faX}
            class="btn btn-error btn-outline btn-sm top-0 right-0 absolute"
          />
        </div>
        <span>{csvRef.files[0].name}</span>
        <Fa icon={faFileExcel} class="text-2xl" />
      </div>
    {:else}
      <span> Upload File Here</span>
    {/if}
    <input
      class="w-full h-full hidden"
      id="file_input"
      type="file"
      on:change|preventDefault={handleChange}
      bind:this={csvRef}
    />
  </label>
  <div id="spreadsheet" />
</div>
