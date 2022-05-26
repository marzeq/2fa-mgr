import clipboardy from "clipboardy"
import password from "password-prompt"
import totp from "totp-generator"
import type { SubcommandFunction } from "../types"
import { decryptStr, getApp } from "../util"

const generate: SubcommandFunction = async program => {
    program
        .command("generate")
        .aliases(["gen", "get"])
        .argument("<app>", "name of the app")
        .option("-c, --clipboard", "whether to copy the generated password to the clipboard", false)
        .description("generate a one-time password")
        .action(async (app, { clipboard }: {
            clipboard: boolean
        }) => {

            const appcfg = await getApp(app)

            if (!appcfg)
                return console.error(`App ${app} not found`)

            let secret = appcfg.secret

            if (appcfg.encrypted) {
                const pswd = await password("Enter password: ", {
                    method: "hide"
                })
                try {
                    secret = decryptStr(secret, pswd)
                } catch (e: any) {
                    if (e.reason === "bad decrypt")
                        return console.error("Wrong password")
                    else
                        throw e
                }
            }

            const psswd = totp(secret, {
                digits: appcfg.length,
                period: appcfg.interval
            }),
                timeLeft = appcfg.interval - (new Date().getSeconds() > appcfg.interval ? new Date().getSeconds() - appcfg.interval : new Date().getSeconds())

            console.log(`Your one-time password is:
${psswd}
You have ${timeLeft} seconds left to use it`)

            if (clipboard) {
                await clipboardy.write(psswd)
                console.log("Copied to clipboard")
            }
        })
}

export default generate
