<script context='module'>
  // TODO: this is ugly, refactor.
  export async function load({page, fetch}) {
    const response = await fetch('ssr/config')

    if (response.status !== 200) {
      const details = await response.text()

      return {
        props: {
          serverError: {
            details
          },
          config: {site: {}, dns: {}, payment: {}, psl: {}}
        }
      }
    }

    const config = await (response).json()
    return {
      props: {
        config
      }
    }
  }
</script>

<script>
  // @hmr:keep-all
  import Remote from '@small-tech/remote'

  import { onMount } from 'svelte'
  import { TabbedInterface, TabList, Tab, TabPanel } from '$lib/TabbedInterface'

  import { PaymentProviders } from '$lib/Constants'

  // Admin panels.
  import Setup from '$lib/admin/setup/Index.svelte'
  import Places from '$lib/admin/places/Index.svelte'

  // Implement global Buffer support.
  import { Buffer } from 'buffer'
  globalThis.Buffer = Buffer

  // This property is set by the module script.
  export let config

  let errorMessage = null
  let password = null
  let signingIn = false

  let signedIn = false
  let baseUrl
  let socket
  let remote

  $: if (signingIn) errorMessage = false

  onMount(async () => {
    baseUrl = document.location.hostname
  })

  async function signIn () {
    signingIn = true
    try {
      socket = new WebSocket(`wss://${baseUrl}/admin/socket/${password}`)
      remote = new Remote(socket)
    } catch (error) {
      errorMessage = `WebSocket ${error}.`
      signingIn = false
      return
    }

    socket.onopen = () => {
      console.log('Socket open.')
    }

    socket.onerror = event => {
      errorMessage = 'WebSocket connection failed (<strong>is Site.js running?</strong>)'
      signingIn = false
    }

    socket.onclose = event => {
      signingIn = false
      signedIn = false
      console.log(`Socket closed.`)
    }

    remote.signIn.response.handler = () => {
      signingIn = false
      signedIn = true
    }

    remote.signIn.error.handler = message => {
      errorMessage = message.error
    }
  }

  function signOut () {
    window.location.reload()
  }
</script>

<main>
  <h1>{config.dns.domain} admin</h1>

  {#if !signedIn}
    <form on:submit|preventDefault>
      <label for='password'>Password:</label>
      <!--
        Since this is the only control on this page, the usability advantage
        outweighs the accessibility concern (which is valid on pages with more
        than one control).
      -->
      <!-- svelte-ignore a11y-autofocus -->
      <input id='password' type='password' bind:value={password} autofocus/>
      <button on:click={signIn}>Sign in</button>
    </form>

    {#if signingIn}
      <p style='color: blue;'>Signing in…</p>
    {/if}

    {#if errorMessage}
      <p style='color: red;'>❌️ {@html errorMessage}</p>
    {/if}
  {:else}
    <p class='signOut'><a href='/' on:click={signOut}>Sign out.</a></p>
    <TabbedInterface navStyle={true}>
      <TabList navStyle={true}>
        <Tab navStyle={true}>Setup</Tab>
        <Tab navStyle={true}>Places</Tab>
      </TabList>
      <TabPanel><Setup {socket} /></TabPanel>
      <TabPanel><Places {socket} /></TabPanel>
    </TabbedInterface>
  {/if}

  <footer>
    <!--<p><strong>Like this? <a href='https://small-tech.org/fund-us'>Help fund the folks who make it.</a></strong></p>-->
    <p>This is a <a href='https://small-tech.org/research-and-development'>Small Web</a> Domain run by <a href='{config.org.site}'>{config.org.name}.</a>
      {#if config.payment.provider !== PaymentProviders.none}
        <br>
        <!-- TODO: populate links. -->
        <a href=''>Terms of Service</a>.
        <a href=''>Privacy Policy.</a>
      {/if}
    <a href='https://github.com/small-tech/basil'>View Source.</a></p>
  </footer>

  <!-- Not sure why but getting a “received an unexpected slot ‘default’” warning
       in the console so this is a temporary measure to silence it. Nothing should
       be slotting in here. 🤔️
  -->
  <slot></slot>
</main>

<style>
  main {
    max-width: 760px;
    margin-left: auto;
    margin-right: auto;
    padding: 1em;
  }

  h1 {
    font-size: 4em;
    font-weight: 300;
    line-height: 1.5em;
    margin-bottom: 0.75em;
  }

  h2 {
    font-size: 3em;
    margin-top: 1em;
    margin-bottom: 0.5em;
  }

  h3 {
    font-size: 2em;
  }

  h4 {
    font-size: 1.5em;
    margin-top: 1.5em;
  }

  section > h4 {
    margin-top: 0.75em;
    margin-bottom: 0.75em;
  }

  h5 {
    font-size: 1.25em;
    margin-top: 1em;
    margin-bottom: 1em;
  }

  * :where(:global(input), :global(textarea), :global(select)) {
    display: block;
    margin-top: 0.5em;
    margin-bottom: 1em;
  }

  #password {
    display: inline-block;
  }

  label[for='password'] {
    display: block;
  }

  input[type='number'] {
    min-width: 4em;
    display: block !important;
  }

  * :global(textarea) {
    width: 100%;
    box-sizing: border-box;
    min-height: 200px;
  }

  * :global(textarea + small) {
    display: block;
    margin-top: -0.5em;
    font-style: italic;
  }

  label, .label {
    margin-bottom: 0.5em;
  }

  footer {
    border-top: 1px solid black;
    margin-top: 3em;
  }

  footer > p {
    font-size: 1em;
  }

  * :global(ul[role='tablist']) {
    margin-bottom: 2em;
  }

  * :global(.instructions) {
    background-color: #eee;
    margin-left: -1em;
    padding-left: 1em;
    margin-right: -1em;
    margin-top: 1.5em;
    margin-bottom: 1.5em;
    padding-right: 1em;
    padding-top: 0.25em;
    padding-bottom: 0.5em;
    border-radius: 1em;
  }

  * :global(.instructions li) {
    margin-top: 0.5em;
  }

  .signOut {
    text-align: right;
    font-size: 1.25em;
    margin-top: -1em;
  }

  button {
    min-width: 4.5em;
  }

  fieldset {
    max-width: 10em;
  }

  * :global(.openSelectBox) {
    scrollbar-width: none;
    overflow: hidden;
  }

</style>
