# 2fa-mgr

**Disclaimer: I am not responsible for any damages caused by this software.**

This is a simple 2FA manager that allows you to generate a 6-digit code that can be used to authenticate your account.

It's cross-platform and works on Linux, macOS, and Windows (although it's not tested on Windows or macOS).

## Usage

```sh
# Global help
2fa-mgr help
# Help for subcommand
2fa-mgr help generate

# Add an app
2fa-mgr add <app_name> <secret>

# Generate a code
2fa-mgr generate <app_name> # aliased to gen for convenience
```

For more subcommands and options, see the global and subcommand specific help pages.

## Installation

### Dependencies

#### Build time:

- nodejs (v16 recommended, but should work with any modern version)
- npm & yarn

The rest will be installed by yarn when you run `yarn` in the build process.

#### Runtime:

- (Linux) xsel – for copying the code to the clipboard _(optional)_

### Build

```
git clone https://github.com/marzeq/2fa-mgr.git
cd 2fa-mgr
yarn
yarn pkg
```

Now you should have 3 binaries in `dist/`:

- `2fa-mgr-linux`
- `2fa-mgr-macos`
- `2fa-mgr-win.exe`

Simply run the one for your platform to start the application.

### Installation

It is recommended to put the appropriate binary in your `PATH` so that you can run it from anywhere.

You should look it up online to see how to do that for your platform.

You might also want to remove the platform specific suffix from the binary name to make it easier to run it.

## Planned features

- **Find an alternative to pkg (the filesizes are huge).** Ideally without node as a runtime dependency, but we'll see how that goes. Maybe I'll just rewrite this in like rust or something (this would also immensely help with the build process, and maybe even with packaging to linux repos and to crates.io).
- QR code reader
