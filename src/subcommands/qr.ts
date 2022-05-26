import querystring from "node:querystring"
import type { App, SubcommandFunction } from "../types"
import { setApp, getApp, parseSecret, encryptStr, readQrFile } from "../util"
import password from "password-prompt"
import jsQR from "jsqr"

const qr: SubcommandFunction = async program => {
    program
        .command("qr")
        .argument("<path>", "path to the QR code image")
        .option("-n, --noencrypt", "do not encrypt the secret key")
        .option("-a, --app <app>", "the alternative name of the app")
        .description("add a new app from a QR code")
        .action(async (path: string, { noencrypt, app: appName }: {
            noencrypt: boolean
            app?: string
        }) => {
            const { data, width, height } = await readQrFile(path),
                qrCode = jsQR(data, width, height)

            if (!qrCode || !qrCode.data)
                return console.error("Could not read QR code")

            const [nonQuery, query] = qrCode.data.split("?")

            if (!nonQuery)
                return console.error("Could not read QR code")

            const [, , , name] = nonQuery.split("/")

            if (!name)
                return console.error("Could not read QR code")

            let { secret: qrSecret, digits: qrDigits, period: qrPeriod } = querystring.parse(query)

            if (!qrSecret)
                return console.error("Could not read QR code")

            qrPeriod ||= "30"
            qrDigits ||= "6"

            let secret = parseSecret(String(qrSecret))

            const length = parseInt(String(qrDigits)),
                interval = parseInt(String(qrPeriod))

            if (isNaN(length) || isNaN(interval))
                return console.error("Could not read QR code")

            const app = appName || name

            if (await getApp(app))
                return console.error(`App ${app} already exists!
Please use the "update" command to update an existing app`)

            if (!noencrypt) {
                const pswd = await password("Enter the encryption password: ", {
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
                length,
                interval,
                encrypted: !noencrypt
            }

            await setApp(app, appcfg)

            console.log(`Added app ${app}`)
        })
}

export default qr
