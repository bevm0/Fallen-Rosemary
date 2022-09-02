<script>
  import { createForm } from 'felte'

  const { form } = createForm({})
</script>

<form use:form>
  <input type="text" name="email" />
  <input type="password" name="password" />
  <button type="submit">Sign In</button>
</form>
