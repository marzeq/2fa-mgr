#!/usr/bin/env node

import { Command } from "commander"
import { programName } from "./util"
import add from "./subcommands/add"
import update from "./subcommands/update"
import generate from "./subcommands/generate"
import remove from "./subcommands/remove"
import list from "./subcommands/list"
import qr from "./subcommands/qr"

const main = async () => {
    const program = new Command()

    program
        .name(programName)
        .description("Simple 2FA manager")
        .version("1.0.2")

    add(program)
    update(program)
    generate(program)
    remove(program)
    list(program)
    qr(program)

    program.parse()
}

main().catch(console.error)
