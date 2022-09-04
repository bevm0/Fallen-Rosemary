<script lang="ts">
  import BasicInfo from './BasicInfo.svelte'
  import Descriptive from './Descriptive.svelte'
  import Tabular from './Tabular.svelte'
  import type { BasicInfoType, DescriptiveType } from './DataStore'

  //import { trpcClient } from '$lib/trpc'

  const currentUser = {
    firstName: 'Elysia',
    lastName: 'Ego',
    email: null,
    address: 'Elysian Realm',
    institution: 'Flamechasers',
  }

  const pages = [BasicInfo, Tabular, Descriptive]

  type DescriptiveFormData = { descriptive: DescriptiveType }

  interface TabularFormData {
    tabular: {
      missingValues: null | string | number
    }
    files: {
      supplemental: File | null
      csv: File | null
      testData: File | null
    }
  }

  interface AttributeFormData {
    attributes: string[][]
  }

  interface formData
    extends BasicInfoType,
      DescriptiveFormData,
      TabularFormData,
      AttributeFormData {
    Graphics: any
  }

  let pagesState: formData = {
    // part 1
    metadata: {
      Name: '',
      Abstract: '',
      Types: [],
      Task: [],
      Area: '',
      DOI: null,
    },
    creator: currentUser,
    keywords: [],
    creators: [],

    // part 2
    tabular: {
      missingValues: null,
    },

    files: {
      supplemental: null,
      testData: null,
      csv: null,
    },

    Graphics: null,

    attributes: [],

    // part 3
    descriptive: {
      purpose: null,
      funding: null,
      represent: null,
      dataSplits: null,
      sensitiveInfo: null,
      preprocessingDescription: null,
      used: null,
      otherInfo: null,
      datasetCitation: null,
    },
  }

  // derive the inital page data for each page and map it to an array
  $: BasicInfoInitialData = {
    metadata: pagesState.metadata,
    creator: pagesState.creator,
    keywords: pagesState.keywords,
    creators: pagesState.creators,
  }
  $: DescriptiveInitialData = { descriptive: pagesState.descriptive }
  $: TabularInitialData = {
    tabular: pagesState.tabular,
    attributes: pagesState.attributes,
    files: pagesState.files,
  }

  $: pageInitialData = [BasicInfoInitialData, TabularInitialData, DescriptiveInitialData]

  let page = 0

  // Our handlers
  function onSubmit(values: BasicInfoType) {
    // update the parent state
    pagesState = { ...pagesState, ...values }

    console.log(pagesState)

    // if at end of form, make request, otherwise increment page counter
    if (page === pages.length - 1) {
      console.log(pagesState)
      console.log('Done!')
    } else {
      page += 1
    }
  }

  function onBack(values: BasicInfoType) {
    pagesState = { ...pagesState, ...values }

    if (page !== 0) {
      page -= 1
    }
  }
</script>

<!-- choose the component to render by binding it to a component in the array 
all components are given props to handle submission, going back,
and their initial/stored values -->

<svelte:component
  this={pages[page]}
  {onSubmit}
  onBack={page === 0 ? null : onBack}
  initialValues={pageInitialData[page]}
  isLastStep={page === pages.length - 1}
/>
