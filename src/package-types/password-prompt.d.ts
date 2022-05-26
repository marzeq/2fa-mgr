declare module "password-prompt" {
    export default function password(ask: string, options?: {
        method: "mask" | "hide"
    }): Promise<string>
}
