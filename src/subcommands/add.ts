import type { App, SubcommandFunction } from "../types"
import { setApp, getApp, parseSecret } from "../util"

const add: SubcommandFunction = async program => {
    program
        .command("add")
        .argument("<app>", "name of the app")
        .argument("<secret>", "secret key")
        .option("-l, --length [length]", "length of the TOTP", "6")
        .option("-i, --interval [interval]", "interval between TOTP updates", "30")
        .description("add a new app")
        .action(async (app: string, secret: string, { length, interval }: {
            length: string
            interval: string
        }) => {
            if (await getApp(app))
                return console.error(`App ${app} already exists!
Please use the "update" command to update an existing app`)

            const appcfg: App = {
                secret: parseSecret(secret),
                length: parseInt(length),
                interval: parseInt(interval)
            }

            await setApp(app, appcfg)

            console.log(`Added app ${app}`)
        })
}

export default add