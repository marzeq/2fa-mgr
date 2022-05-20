import type { App, SubcommandFunction } from "../types"
import { setApp, getApp, deleteApp, parseSecret } from "../util"

const update: SubcommandFunction = async program => {
    program
        .command("update")
        .aliases(["edit"])
        .argument("<app>", "The name of the app")
        .option("-n, --name [name]", "new name for the app")
        .option("-s, --secret [secret", "secret key")
        .option("-l, --length [length]", "length of the TOTP")
        .option("-i, --interval [interval]", "interval between TOTP updates")
        .description("update an existing app")
        .action(async (app: string, { name, secret, length, interval }: {
            name?: string
            secret?: string
            length?: string
            interval?: string
        }) => {
            const _appcfg = await getApp(app)

            if (!_appcfg)
                return console.error(`App ${app} not found`)

            const appcfg: App = {
                secret: parseSecret(secret || _appcfg.secret),
                length: length ? parseInt(length) : _appcfg.length,
                interval: interval ? parseInt(interval) : _appcfg.interval
            }

            if (name) {
                await deleteApp(app)
                await setApp(name, appcfg)

                console.log(`Updated app ${app} and renamed to ${name}`)
            } else {
                await setApp(app, appcfg)

                console.log(`Updated app ${app}`)
            }
        })
}

export default update