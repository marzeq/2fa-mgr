import clipboardy from "clipboardy"
import totp from "totp-generator"
import type { SubcommandFunction } from "../types"
import { getApp } from "../util"

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

            const psswd = totp(appcfg.secret, {
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