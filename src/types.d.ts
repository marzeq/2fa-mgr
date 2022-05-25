import type { Command } from "commander"

export type Awaitable<T> = Promise<T> | PromiseLike<T> | T
export type SubcommandFunction = (program: Command) => Awaitable<any>

export interface Config {
    apps: {
        [app: string]: App
    }
}

export interface App {
    secret: string
    length: number
    interval: number
    encrypted: boolean
}