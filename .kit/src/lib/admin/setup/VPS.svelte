<script>
  import Remote from "@small-tech/remote";
  import SensitiveTextInput from "$lib/SensitiveTextInput.svelte";
  import ServiceState from "./ServiceState.js";

  export let settings;

  export let socket;
  const remote = new Remote(socket);

  export const state = new ServiceState();

  function validateSettings() {
    state.set(state.PROCESSING);

    const provider = settings.vps.providers[settings.vps.provider];
    const { apiToken } = provider;
    if (
      apiToken.length === 64 || // hetzner
      apiToken.length === 36 // scaleway
    ) {
      remote.vps.validate.request.send({ provider });
    }
  }

  // Remote event handlers.

  remote.settings.handler = () => validateSettings();

  remote.vps.validate.response.handler = (message) => {
    const vpsDetails = message.details;

    const { provider, serverTypes, locations, images, sshKeys } = vpsDetails;

    const vpsProvider =
      settings.vps.providers.find((vpsProvider) => {
        return vpsProvider.name === provider.name;
      }) || settings.vps.providers[0];

    const vpsServerType = serverTypes.find((serverType) => {
      return serverType.name === vpsProvider.serverType;
    });

    const vpsLocation = locations.find((location) => {
      return location.name === vpsProvider.location;
    });

    const vpsImage = images.find((image) => {
      return image.name === vpsProvider.image;
    });

    // FIX-ME: Unlike the others, initially this will be unset
    // ======= so we have to handle this differently. Test
    //         by removing SSH keys from Hetzner and starting
    //         with a blank slate.
    const vpsSshKey = sshKeys.find((sshKey) => {
      return sshKey.name === vpsProvider.sshKeyName;
    });

    state.set(state.OK, {
      vpsProvider,
      vpsDetails,
      vpsServerType,
      vpsLocation,
      vpsImage,
      vpsSshKey,
    });
  };

  remote.vps.validate.error.handler = (message) =>
    state.set(state.NOT_OK, { error: message.error });

  // Settings getter/ setter helpers.

  function setVpsProvider(providerName) {
    const providerIdx = settings.vps.providers.findIndex(
      (provider) => provider.name === providerName
    );
    settings.vps.provider = providerIdx;
  }

  function setVpsProviderProperty(prop, val) {
    settings.vps.providers[settings.vps.provider][prop] = val;
  }

  // Local event handlers.

  function vpsProviderChange() {
    setVpsProvider(state.OK.vpsProvider.name);
    validateSettings();
  }

  function vpsServerTypeChange() {
    setVpsProviderProperty("serverType", state.OK.vpsServerType.name);
    validateSettings();
  }

  function vpsLocationChange() {
    setVpsProviderProperty("location", state.OK.vpsLocation.name);
    validateSettings();
  }

  function vpsImageChange() {
    setVpsProviderProperty("image", state.OK.vpsImage.name);
    validateSettings();
  }

  function vpsSshKeyChange() {
    setVpsProviderProperty("sshKeyName", state.OK.vpsSshKey.name);
    setVpsProviderProperty("sshKey", state.OK.vpsSshKey.public_key);
    validateSettings();
  }
</script>

<h3 id="vps">VPS Host Settings</h3>

<h4>Hetzner</h4>

<section class="instructions">
  <h5>Instructions</h5>
  <ol>
    <li>
      Create a <a href="https://www.hetzner.com/cloud">Hetzner Cloud</a> account.
    </li>
    <li>
      <a href="https://accounts.hetzner.com/account/dpa"
        >Create a GDPR Data Protection Agreement</a
      >, accept it, download a copy, sign it, and keep it somewhere safe. (See
      <a
        href="https://docs.hetzner.com/general/general-terms-and-conditions/data-privacy-faq/"
        >Hetzner Data Privacy FAQ</a
      >)
    </li>
    <li>
      <a href="https://console.hetzner.cloud/projects">Create a new project</a> to
      hold the sites you will be hosting.
    </li>
    <li>
      Make sure you've created and added at least one SSH Key to <strong
        ><em>your-project</em> → Security → SSH Keys</strong
      > in your Hetzner dashboard.
    </li>
    <li>
      Generate an API Token from <strong
        ><em>your-project</em> → Security → API Tokens</strong
      > in your Hetzner dashboard and copy it below.
    </li>
  </ol>
</section>

<h4>Scaleway</h4>

<section class="instructions">
  <h5>Instructions</h5>
  <ol>
    <li>
      Create a <a href="https://www.scaleway.com/elements">Scaleway Elements</a>
      account.
    </li>
    <li>
      <a href="#FIXME">Create a GDPR Data Protection Agreement</a>, accept it,
      download a copy, sign it, and keep it somewhere safe. (See
      <a href="#FIXME">Scaleway on Data Privacy</a>)
    </li>
    <li>
      <a href="https://console.scaleway.com/organization/projects"
        >Create a new project</a
      > to hold the sites you will be hosting.
    </li>
    <li>
      Generate an API Token (Secret Key) from
      <strong><em>your-project</em> → Credentials → API Keys</strong> in your Scaleway
      dashboard and copy it below.
    </li>
  </ol>
</section>

{#if $state.is(state.UNKNOWN)}
  <p>You’ll be informed once you have the correct details set.</p>
{/if}

{#if $state.is(state.OK)}
  <p>✔️ Your VPS settings are correct.</p>
{/if}

{#if $state.is(state.NOT_OK)}
  <p style="color: red;">❌️ {state.NOT_OK.error}</p>
{/if}

{#if settings}
  <!-- VPS Provider -->
  <label for="vpsProvider">Provider</label>
  <!-- svelte-ignore a11y-no-onchange -->
  <select
    id="vpsProvider"
    bind:value={state.OK.vpsProvider}
    on:change={vpsProviderChange}
  >
    {#each settings.vps.providers as provider}
      <option value={provider}>{provider.name}</option>
    {/each}
  </select>
  {#if state.OK.vpsProvider}
    <p class="vpsItemDetails">
      {state.OK.vpsProvider.serverType} server type, {state.OK.vpsProvider
        .location} location,
      {state.OK.vpsProvider.image} image.
    </p>
  {/if}

  <label id="vpsApiTokenLabel" for="vpsApiToken"
    >API Token or Key (with read/write permissions)</label
  >
  <SensitiveTextInput
    name="vpsApiToken"
    bind:value={settings.vps.providers[settings.vps.provider].apiToken}
    on:input={validateSettings}
  />
{/if}

{#if $state.is(state.OK)}
  <!-- SSH keys -->
  <label for="vpsSshKey">SSH Key Name</label>
  <!-- svelte-ignore a11y-no-onchange -->
  <select
    id="vpsSshKey"
    bind:value={state.OK.vpsSshKey}
    on:change={vpsSshKeyChange}
  >
    {#each state.OK.vpsDetails.sshKeys as sshKey}
      <option
        value={sshKey}
        selected={settings.vps.providers[settings.vps.provider].sshKey ===
          sshKey.name}>{sshKey.name}</option
      >
    {/each}
  </select>
  {#if state.OK.vpsSshKey}
    <ul class="vpsItemDetails">
      <li>Created: {state.OK.vpsSshKey.created}</li>
      <li>Fingerprint: {state.OK.vpsSshKey.fingerprint}</li>
      <li>Public Key: <code>{state.OK.vpsSshKey.public_key}</code></li>
    </ul>
  {/if}

  <details>
    <summary>Advanced</summary>
    <h3>Server details</h3>
    <p>These settings will be used when setting up servers.</p>

    <!-- VPS Locations -->
    <label for="vpsLocation">Location</label>
    <!-- svelte-ignore a11y-no-onchange -->
    <select
      id="vpsLocation"
      bind:value={state.OK.vpsLocation}
      on:change={vpsLocationChange}
    >
      {#each state.OK.vpsDetails.locations as location}
        <option value={location}
          >{location.description.replace("DC", "Data Centre")}</option
        >
      {/each}
    </select>
    {#if state.OK.vpsLocation}
      <p class="vpsItemDetails">
        {state.OK.vpsLocation.city} ({state.OK.vpsLocation.country}), {state.OK.vpsLocation.network_zone.replace(
          "eu-central",
          "central EU"
        )} network zone.
      </p>
    {/if}

    <!-- VPS Server Types -->
    <label for="vpsServerType">Server type</label>
    <!-- svelte-ignore a11y-no-onchange -->
    <select
      id="vpsServerType"
      bind:value={state.OK.vpsServerType}
      on:change={vpsServerTypeChange}
    >
      {#each state.OK.vpsDetails.serverTypes as serverType}
        <option value={serverType}>{serverType.description}</option>
      {/each}
    </select>
    {#if state.OK.vpsServerType}
      <p class="vpsItemDetails">
        {state.OK.vpsServerType.cores} cores, {state.OK.vpsServerType.memory}GB
        memory, {state.OK.vpsServerType.disk}GB disk. Cost: €{parseFloat(
          state.OK.vpsServerType.prices[0].price_monthly.net
        ).toFixed(2)}/month (exc. VAT).
      </p>
    {/if}

    <!-- VPS Images -->
    <label for="vpsImage">Image</label>
    <!-- svelte-ignore a11y-no-onchange -->
    <select
      id="vpsImage"
      bind:value={state.OK.vpsImage}
      on:change={vpsImageChange}
    >
      {#each state.OK.vpsDetails.images as image}
        <option value={image}>{image.description}</option>
      {/each}
    </select>
    {#if state.OK.vpsImage}
      <p class="vpsItemDetails">
        {#if state.OK.vpsImage.name === "ubuntu-20.04" || state.OK.vpsImage.name === "ubuntu_focal"}
          <strong class="positive"
            >This is currently the only supported system for Small Web
            deployments.</strong
          >
        {:else}
          <strong class="warning"
            >This is an unsupported system for Small Web deployments.</strong
          >
        {/if}
        Any Linux with systemd should work but you might have to adjust the Cloud
        Init scripts for your apps.
      </p>
    {/if}
  </details>
{/if}

<style>
  summary {
    font-size: 1.5em;
    border-bottom: 2px dashed grey;
    padding-bottom: 0.5em;
  }

  details {
    margin-top: 1.5em;
    padding-bottom: 0.75em;
  }

  details[open],
  details[open] summary {
    border-bottom: 2px solid grey;
  }

  .vpsItemDetails {
    margin-top: -0.75em;
    font-size: smaller;
    font-style: italic;
  }
</style>
