const HetznerCloud = require('hcloud-js')

module.exports.createServer = async (vpsProvider, domain, subdomain, cloudInit) => {
    // TODO: Handle errors in VPS service constructors.
    const hcloud = new HetznerCloud.Client(vpsProvider.apiToken)

    // Note: while the Hetzner API documentation states that the
    // ===== sshKey provided in the call is optional, if it is not
    //       provided (a) a root password is set (which we don’t want)
    //       and the sudo account creation fails during cloud-config/cloud-init.
    let serverBuildResult = {}
    try {
        serverBuildResult = await hcloud.servers.build()
            .name(`${subdomain}.${domain}`)
            .serverType(vpsProvider.serverType)
            .location(vpsProvider.location)
            .image(vpsProvider.image)
            .sshKey(vpsProvider.sshKeyName)
            .userData(cloudInit)
            .create()
    } catch (error) {
        serverBuildResult.error = error
    }
    return serverBuildResult
}

module.exports.getCreateServerStatus = async (vpsProvider, actionId) => {
    // TODO: Handle errors in VPS service constructors.
    const hcloud = new HetznerCloud.Client(vpsProvider.apiToken)

    const action = await hcloud.actions.get(actionId)
    return action
}