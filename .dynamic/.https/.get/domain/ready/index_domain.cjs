const fetch = require('node-fetch')

module.exports = async (request, response) => {

  const domain = db.settings.dns.domain
  const subdomain = request.params.domain

  try {
    await fetch(`https://${subdomain}.${domain}`)
  } catch (error) {
    response.json(false)
  }

  response.json(true)
}
