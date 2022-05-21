import password from "password-prompt"
import type { App, SubcommandFunction } from "../types"
import { setApp, getApp, deleteApp, parseSecret, encryptStr, decryptStr } from "../util"

const update: SubcommandFunction = async program => {
    program
        .command("update")
        .aliases(["edit"])
        .argument("<app>", "The name of the app")
        .option("-n, --name [name]", "new name for the app")
        .option("-s, --secret [secret", "secret key")
        .option("-l, --length [length]", "length of the TOTP")
        .option("-i, --interval [interval]", "interval between TOTP updates")
        .option("-d, --decrypt", "convert the secret key from encrypted to unencrypted")
        .option("-e, --encrypt", "convert the secret key from unencrypted to encrypted")
        .description("update an existing app")
        .action(async (app: string, { name, secret, length, interval, encrypt, decrypt }: {
            name?: string
            secret?: string
            length?: string
            interval?: string
            encrypt?: boolean
            decrypt?: boolean
        }) => {
            const _appcfg = await getApp(app)

            if (!_appcfg)
                return console.error(`App ${app} not found`)

            if (encrypt && decrypt)
                return console.error(`You can't use both --encrypt and --decrypt`)
            else if (encrypt && !_appcfg.encrypted)
                return console.error(`The secret key for ${app} is already encrypted`)
            else if (decrypt && _appcfg.encrypted)
                return console.error(`The secret key for ${app} is already unencrypted`)

            let encrypted: boolean = _appcfg.encrypted

            if (encrypt) {
                const pswd = await password("Enter password: ", {
                    method: "hide"
                })
                try {
                    secret = encryptStr(secret || _appcfg.secret, pswd)
                } catch (e: any) {
                    return console.trace(e)
                }
                encrypted = true
            } else if (decrypt) {
                const pswd = await password("Enter password: ", {
                    method: "hide"
                })
                try {
                    secret = decryptStr(secret || _appcfg.secret, pswd)
                } catch (e: any) {
                    if (e.reason === "bad decrypt")
                        return console.error("Wrong password")
                    else
                        return console.trace(e)
                }
                encrypted = false
            }

            const appcfg: App = {
                secret: parseSecret(secret || _appcfg.secret),
                length: length ? parseInt(length) : _appcfg.length,
                interval: interval ? parseInt(interval) : _appcfg.interval,
                encrypted
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