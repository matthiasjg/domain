const fetch = require('node-fetch')

module.exports = async provider => {
    let details = {}

    // https://developers.scaleway.com/en/products/instance/api/
    let { apiToken, location } = provider
    if (!location) {
        location = 'nl-ams-1' // sane default
    }
    const apiBaseUrlInstance = `https://api.scaleway.com/instance/v1/zones/${location}`
    const apiBaseUrlMarketplace = `https://api.scaleway.com/marketplace/v1`
    const perPage = 100

    // TODO implement pagination
    // TODO improve error handling
    const fetchFromApi = async (apiBaseUrl, path) => (await (await fetch(`${apiBaseUrl}${path}`, {
        headers: {
            Accept: 'application/json',
            'X-Auth-Token': apiToken
        }
    })).json())

    const availableServerTypes = []
    const suitableImages = []

    // Get server types technical details.
    const { servers } = await fetchFromApi(apiBaseUrlInstance, `/products/servers?per_page=${perPage}`)

    if (servers) {
        // Filter down to relevant server types
        Object.keys(servers).forEach(serverKey => {
            // Re-shape for compatibility w/ ui, originally developed against hetzner shape
            const { ncpus, ram, volumes_constraint, monthly_price } = servers[serverKey]
            const hetznerShape = {
                name: serverKey,
                cores: ncpus,
                memory: ram / 1024 / 1024 / 1024,
                disk: volumes_constraint.min_size / 1000 / 1000 / 1000,
                prices: [{ price_monthly: { net: monthly_price } }],
                description: serverKey
            }
            // Flag the recommended server type.
            if (serverKey === 'STARDUST1-S') {
                hetznerShape.description += ' (recommended)'
            }
            servers[serverKey] = Object.assign(servers[serverKey], hetznerShape)
        })
    } else {
        details.error = 'Could not load server types.'
    }

    // Get availibility for all server types.
    const serversAvailibility = await fetchFromApi(apiBaseUrlInstance, `/products/servers/availability?per_page=${perPage}`)

    // Filter down to available server types
    if (serversAvailibility) {
        Object.keys(servers).forEach(serverKey => {
            if (serversAvailibility.servers[serverKey].availability === 'available') {
                availableServerTypes.push(servers[serverKey])
            }
        })
    } else {
        details.error = 'Could not load availability of server types.'
    }

    // List all images available in an account.
    const { images } = await fetchFromApi(apiBaseUrlMarketplace, `/images?per_page=${perPage}&arch=x86_64&name=Ubuntu 20.04 Focal Fossa`)

    if (images) {
        // Filter down to relevant images
        images.forEach(image => {
            // Flag the recommended image.
            image.description = image.name
            image.name = image.label
            if (image.id === '3f1b9623-71ba-4fe3-b994-27fcdaa850ba') {
                image.description += ' (recommended)'
                suitableImages.push(image)
            }
        })
    } else {
        details.error = 'Could not load images.'
    }

    const locations = [
        { name: 'fr-par-1', description: 'Paris - PAR 1', network_zone: 'eu-central', country: 'France', city: 'Paris' },
        { name: 'fr-par-2', description: 'Paris - PAR 2', network_zone: 'eu-central', country: 'France', city: 'Paris' },
        { name: 'nl-ams-1', description: 'Amsterdam - AMS 1', network_zone: 'eu-central', country: 'France', city: 'Paris' },
        { name: 'pl-waw-1', description: 'Warsaw - WAW 1', network_zone: 'eu-central', country: 'France', city: 'Paris' }
    ]

    const sshKeys = []

    details = Object.assign(details, {
        provider,
        serverTypes: availableServerTypes,
        locations,
        images: suitableImages,
        sshKeys
    })

    return details
}