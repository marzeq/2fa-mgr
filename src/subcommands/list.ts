import type { App, SubcommandFunction } from "../types"
import { getApps } from "../util"

const list: SubcommandFunction = async program => {
    program
        .command("list")
        .aliases(["ls", "getall"])
        .description("list all the added apps")
        .action(async () => {
            console.log(`Available apps:
${(await getApps()).map(s => "  - " + s).join("\n")}`)
        })
}

export default list