import os from "node:os"
import path from "node:path"
import fs from "node:fs/promises"
import crypto from "node:crypto"
import type { App, Config } from "./types"

export const programName: "2fa-mgr" = "2fa-mgr"

export const platform: "win32" | "darwin" | "linux" = os.platform() as any

export let configDir: string

if (platform === "win32") {
    if ("APPDATA" in process.env)
        configDir = `${process.env.APPDATA}\\${programName}`
    else if ("USERPROFILE" in process.env)
        configDir = `${process.env.USERPROFILE}\\${programName}`
    else
        throw new Error("Could not determine config directory because neither APPDATA nor USERPROFILE is set")
}
else if (platform === "darwin") {
    if ("HOME" in process.env)
        configDir = `${process.env.HOME}/.config/${programName}`
    else if ("USER" in process.env)
        configDir = `/Users/${process.env.USER}/.config/${programName}`
    else
        throw new Error("Could not determine config directory because neither HOME nor USER is set")
}
else if (platform === "linux") {
    if ("XDG_CONFIG_HOME" in process.env)
        configDir = `${process.env.XDG_CONFIG_HOME}/${programName}`
    else if ("HOME" in process.env)
        configDir = `${process.env.HOME}/.config/${programName}`
    else if ("USER" in process.env)
        configDir = `/home/${process.env.USER}/.config/${programName}`
    else
        throw new Error("Could not determine config directory because neither XDG_CONFIG_HOME, HOME nor USER are set")
} else
    throw new Error(`Unsupported platform: ${platform}`)

export const configFile = path.join(configDir, "config.json")

export const readConfig = async (): Promise<Config> => {
    await createConfigIfMissing()

    const config = await fs.readFile(configFile, "utf8")
    return JSON.parse(config)
}

export const createConfigIfMissing = async () => {
    const exists = await fs.access(configFile).catch(() => null)

    if (exists === null) {
        await fs.mkdir(configDir, { recursive: true })
        await fs.writeFile(configFile, JSON.stringify({ apps: {} }))
    }
}

export const getApp = async (app: string): Promise<App | undefined> => {
    const config = await readConfig()
    return config.apps[app]
}

export const setApp = async (app: string, appData: App): Promise<void> => {
    const config = await readConfig()
    config.apps[app] = appData
    await fs.writeFile(configFile, JSON.stringify(config, null, 4))
}

export const deleteApp = async (app: string): Promise<void> => {
    const config = await readConfig()
    delete config.apps[app]
    await fs.writeFile(configFile, JSON.stringify(config, null, 4))
}

export const getApps = async (): Promise<string[]> => {
    const config = await readConfig()
    return Object.keys(config.apps)
}

export const parseSecret = (secret: string) => secret.toUpperCase().replaceAll("-", "").replaceAll(" ", "")

export const encryptStr = (str: string, salt: string) => {
    const iv = crypto.randomBytes(16),
        hash = crypto.createHash("sha1")

    hash.update(salt)

    const key = hash.digest().slice(0, 16),
        cipher = crypto.createCipheriv("aes-128-cbc", key, iv)

    let encrypted = cipher.update(str, "utf8", "hex")
    encrypted += cipher.final("hex")

    return iv.toString("hex") + ":" + encrypted
}

export const decryptStr = (str: string, key: string) => {
    const [iv, encrypted] = str.split(":"),
        ivBuffer = Buffer.from(iv, "hex"),
        hash = crypto.createHash("sha1")

    hash.update(key)

    const cipher = crypto.createDecipheriv("aes-128-cbc", hash.digest().slice(0, 16), ivBuffer)

    let decrypted = cipher.update(encrypted, "hex", "utf8")
    decrypted += cipher.final("utf8")

    return decrypted
}
