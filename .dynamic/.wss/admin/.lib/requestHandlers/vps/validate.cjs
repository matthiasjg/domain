const providers = {
  Hetzner: require('./providers/hetzner.cjs'),
  Scaleway: require('./providers/scaleway.cjs')
}

module.exports = async (remote, message) => {
  const { provider } = message
  if (!provider) {
    return remote.vps.validate.error.send({
      error: 'Could not validate, no provider name was specified.'
    })
  }
  const { name } = provider
  if (!name || !Object.keys(providers).includes(name)) {
    return remote.vps.validate.error.send({
      error: `Could not validate, unknown provider: ${name}.`
    })
  }
  console.log(`   📡️    ❨Domain❩ Validating VPS Provider settings for ${name}`)

  const validateProvider = providers[name]

  try {
    const vpsDetails = await validateProvider(provider)
    if (vpsDetails.error) {
      return remote.vps.validate.error.send({
        error: vpsDetails.error
      })
    }
    remote.vps.validate.response.send({ details: vpsDetails })
  } catch (error) {
    remote.vps.validate.request.respond(message, { error: error.message })
  }
}
