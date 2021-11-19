// Migration of Settings table from version 6 to version 7
//
// The vps providers are now an array instead of an object
// and pre-populated with the default provider (hetzner)
// and 2nd provider scaleway (ubuntu image on STARTDUST1 in NL-AMS-1).
//

const fs = require('fs')
const path = require('path')
const JSDB = require('@small-tech/jsdb')

const oldVersion = 6
const newVersion = 7

async function migrate() {
  console.log(`Migrating settings table from version ${oldVersion} to version ${newVersion}.`)

  // Backup settings table.
  console.log(' > Backing up existing table…')
  const currentTablePath = path.join('.db', 'settings.cjs')
  const backupTablePath = path.join('.db', `settings-v${oldVersion}-to-v${newVersion}-pre-migration-backup.cjs`)
  fs.copyFileSync(currentTablePath, backupTablePath)
  console.log(' > Done.')

  console.log(' > Opening database and loading table…')
  const db = JSDB.open('.db')
  const settings = db.settings
  console.log(' > Done.')

  // Is migration necessary?
  if (settings.version && settings.version >= newVersion) {
    console.log('Already migrated, exiting.')
    process.exit()
  }

  console.log(' > Carrying out migration…')
  // Attempt to migrate.
  try {
    // Migration

    const vps = db.settings.vps
    const hetzner = vps
    hetzner.name = hetzner.provider
    hetzner.cloudInit = ''
    delete hetzner.provider

    const scaleway = Object.assign(
      hetzner,
      {
        name: 'Scaleway',
        serverType: 'nl-ams-1STARDUST1-S',
        location: 'nl-ams-1',
        image: '3f1b9623-71ba-4fe3-b994-27fcdaa850ba',
        cloudInit: '#FIXME'
      }
    );

    vps = {
      provider: 0,
      providers: [
        hetzner,
        scaleway
      ]
    }

    // Update version
    db.settings.version = newVersion
  } catch (error) {
    console.log('Migration encountered an error and cannot proceed.', error)
    console.log(' > Closing database…')
    await db.close()
    console.log(' > Done.')
    console.log(' > Reverting changes.')
    fs.copyFileSync(backupTablePath, currentTablePath)
    console.log(' > Done.')
    process.exit()
  }
  console.log(' > Done.')

  // Delete the backup file.
  console.log(' > Deleting backup file.')
  fs.unlinkSync(backupTablePath)
  console.log(' > Done.')

  console.log(' > Migration successful.')
}

migrate()
