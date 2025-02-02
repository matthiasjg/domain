const fetch = require('node-fetch')

module.exports = async provider => {
  let details = {}

  // Get server types. (In this first call we’ll know if the
  // authorisation token is correct or not.)
  response = await fetch('https://api.hetzner.cloud/v1/server_types?per_page=50', {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${provider.apiToken}`
    }
  })

  if (response.status !== 200) {
    details.error = `${response.status}: ${response.statusText}`
  }

  const serverTypes = await response.json()

  if (serverTypes.error) {
    details.error = `${serverTypes.error.code}: ${serverTypes.error.message}`
  } else {
    // Filter down to relevant server types
    const relevantServerTypes = serverTypes.server_types.filter(serverType => {
      // Flag the recommended server.
      if (serverType.name === 'cpx11') serverType.description = 'CPX 11 (recommended)'

      return Boolean(serverType.deprecated) === false && parseInt(serverType.cores) > 1 && serverType.storage_type === 'local'
    })

    // Get locations
    const locations = (await (await fetch('https://api.hetzner.cloud/v1/locations?per_page=50', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${provider.apiToken}`
      }
    })).json()).locations
    // TODO: Handle error here also.

    // Get images
    const _images = (await (await fetch('https://api.hetzner.cloud/v1/images?type=system&status=available&include_deprecated=false&per_page=50', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${provider.apiToken}`
      }
    })).json()).images
    // TODO: Handle error here also.

    const images = _images.filter(image => {
      if (image.name === 'ubuntu-20.04') {
        image.description = 'Ubuntu 20.04 (recommended)'
      }

      // All system images appear to be rapid deploy at the moment, but just in case.
      return image.rapid_deploy === true
    })

    // Get SSH keys
    const sshKeys = (await (await fetch('https://api.hetzner.cloud/v1/ssh_keys?per_page=50', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${provider.apiToken}`
      }
    })).json()).ssh_keys
    // TODO: Handle error here also.

    details = Object.assign(details, {
      provider,
      serverTypes: relevantServerTypes,
      locations,
      images,
      sshKeys
    })
  }
  return details
}
