<script lang="ts">
  //import { validator } from '@felte/validator-zod'
  //import { reporter, ValidationMessage } from '@felte/reporter-svelte'
  //import { z } from 'zod'
  import { onMount } from 'svelte'

  import { parse } from 'papaparse'
  import type { JSpreadsheetElement } from 'jspreadsheet-ce'

  let jexcelRef: JSpreadsheetElement

  // the actual DOM node that has Jexcel/Jspreadsheet as a property
  interface JexcelDivElement extends HTMLDivElement {
    jexcel: JSpreadsheetElement
  }

  export let value: string[][] = []

  const dateformat1 = /^(0?[1-9]|[12][0-9]|3[01])[/-](0?[1-9]|1[012])[/-]\d{4}$/
  const dateformat2 = /^(0?[1-9]|1[012])[/-](0?[1-9]|[12][0-9]|3[01])[/-]\d{4}$/
  const floatRegex = /^-?\d*(?:[.,]\d*?)?$/
  const intRegex = /^-?\d+$/

  const hasHeaders = false
  const missingIndicator = null
  function handleChange(event: Event) {
    let files = (event.target as HTMLInputElement).files || []
    for (let f of files) {
      parse(f, {
        header: false,
        skipEmptyLines: true,
        preview: 5000,
        fastMode: true,
        complete: function (results) {
          const data = results.data as string[][]

          // each row is an attribute, either with a name or just "Attribute#"
          const attributes = data[0].map((header, i) => {
            if (hasHeaders && header !== null && header !== '') {
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
            jexcelRef.setRowData(col, newRow)
          }
        },
      })
    }
  }

  const initializeJspreadsheet = async () => {
    // awaiting an import doesn't do a default import, but Jspreadsheet doesn't agree
    // so I'll force it to agree
    const jspreadsheet = (await import('jspreadsheet-ce')) as unknown as {
      default: jspreadsheet.JSpreadsheet
    }

    // get the default export, which is a function to initialize the spreadsheet
    const createSpreadsheet = jspreadsheet.default

    createSpreadsheet(document.getElementById('spreadsheet') as HTMLDivElement, {
      onchange: () => {
        value = document.getElementById('spreadsheet')?.jspreadsheet.getData()
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
    jexcelRef = (document?.getElementById('spreadsheet') as JexcelDivElement)?.jexcel
  }

  onMount(initializeJspreadsheet)
</script>

<div class="my-10">
  <input type="file" on:change={handleChange} />
</div>

<div id="spreadsheet" />
