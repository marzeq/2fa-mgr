import type { App, SubcommandFunction } from "../types"
import { setApp, getApp, parseSecret, encryptStr } from "../util"
import password from "password-prompt"

const add: SubcommandFunction = async program => {
    program
        .command("add")
        .argument("<app>", "name of the app")
        .argument("<secret>", "secret key")
        .option("-l, --length [length]", "length of the TOTP", "6")
        .option("-i, --interval [interval]", "interval between TOTP updates", "30")
        .option("-n, --noencrypt", "do not encrypt the secret key")
        .description("add a new app")
        .action(async (app: string, secret: string, { length, interval, noencrypt }: {
            length: string
            interval: string
            noencrypt: boolean
        }) => {
            if (await getApp(app))
                return console.error(`App ${app} already exists!
Please use the "update" command to update an existing app`)

            if (!noencrypt) {
                const pswd = await password("Enter password: ", {
                    method: "hide"
                })
                try {
                    secret = encryptStr(secret, pswd)
                } catch (e: any) {
                    return console.trace(e)
                }
            }

            const appcfg: App = {
                secret: parseSecret(secret),
                length: parseInt(length),
                interval: parseInt(interval),
                encrypted: !noencrypt
            }

            await setApp(app, appcfg)

            console.log(`Added app ${app}`)
        })
}

export default add