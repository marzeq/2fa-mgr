import type { SubcommandFunction } from "../types"
import { deleteApp, getApp } from "../util"

const remove: SubcommandFunction = async program => {
    program
        .command("remove")
        .aliases(["rm", "delete"])
        .argument("<app>", "name of the app")
        .description("remove an app")
        .action(async (app: string, secret: string, { length, interval }: {
            length: string
            interval: string
        }) => {
            if (!(await getApp(app)))
                return console.error(`App ${app} not found`)

            await deleteApp(app)
            console.log(`Removed app ${app}`)
        })
}

export default remove