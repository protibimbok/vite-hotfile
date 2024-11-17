import { Plugin, ResolvedConfig, UserConfig } from 'vite'
import { AddressInfo } from 'net'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs'
import path from 'path'

export type DevServerUrl = `${'http' | 'https'}://${string}:${number}`

export function resolveDevServerUrl(
  address: AddressInfo,
  config: ResolvedConfig,
  _userConfig: UserConfig,
): DevServerUrl {
  const configHmrProtocol =
    typeof config.server.hmr === 'object' ? config.server.hmr.protocol : null
  const clientProtocol = configHmrProtocol
    ? configHmrProtocol === 'wss'
      ? 'https'
      : 'http'
    : null
  const serverProtocol = config.server.https ? 'https' : 'http'
  const protocol = clientProtocol ?? serverProtocol

  const configHmrHost =
    typeof config.server.hmr === 'object' ? config.server.hmr.host : null
  const configHost =
    typeof config.server.host === 'string' ? config.server.host : null
  const serverAddress = isIpv6(address)
    ? `[${address.address}]`
    : address.address
  const host = configHmrHost ?? configHost ?? serverAddress

  const configHmrClientPort =
    typeof config.server.hmr === 'object' ? config.server.hmr.clientPort : null
  const port = configHmrClientPort ?? address.port

  return `${protocol}://${host}:${port}`
}
function isIpv6(address: AddressInfo): boolean {
  return (
    address.family === 'IPv6' ||
    // In node >=18.0 <18.4 this was an integer value. This was changed in a minor version.
    // See: https://github.com/laravel/vite-plugin/issues/103
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore-next-line
    address.family === 6
  )
}

let exitHandlersBound = false
const hotfile = (dest: string = './hotfile'): Plugin => {
  let userConfigG: UserConfig
  return {
    name: 'vite-hotfile',
    enforce: 'pre',
    config: (userConfig: UserConfig) => {
      userConfigG = userConfig
      return userConfig
    },
    configureServer(server) {
      server.httpServer?.once('listening', () => {
        const address = server.httpServer?.address()

        const isAddressInfo = (
          x: string | AddressInfo | null | undefined,
        ): x is AddressInfo => typeof x === 'object'
        if (isAddressInfo(address)) {
          const viteDevServerUrl = resolveDevServerUrl(
            address,
            server.config,
            userConfigG,
          )

          if (!existsSync(path.dirname(dest))) {
            mkdirSync(path.dirname(dest), { recursive: true })
          }

          writeFileSync(dest, viteDevServerUrl)

          if (!exitHandlersBound) {
            const clean = () => {
              if (existsSync(dest)) {
                rmSync(dest)
              }
            }
            process.on('exit', clean)
            process.on('SIGINT', process.exit)
            process.on('SIGTERM', process.exit)
            process.on('SIGHUP', process.exit)

            exitHandlersBound = true
          }
        }
      })
    },
  }
}

export default hotfile
