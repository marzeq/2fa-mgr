# 2fa-mgr

**Disclaimer: I am not responsible for any damages caused by this software.**

This is a simple 2FA manager that allows you to generate a 6-digit code that can be used to authenticate your account.

It's cross-platform and works on Linux, macOS, and Windows (although it's not tested on Windows or macOS).

## Usage

```sh
# Global help
2fa-mgr help
# Help for a subcommand
2fa-mgr help generate

# Add an app
2fa-mgr add <app_name> <secret>

# Add from a QR code .png file
2fa-mgr qr <file_path>

# Generate a code
2fa-mgr generate <app_name> # aliased to gen for convenience
```

For more subcommands and options, see the global and subcommand specific help pages.

## Installation

```sh
# One time run (auto updates)
npx 2fa-mgr
# Install globally
npm install -g 2fa-mgr # might need sudo on some systems
```

### Dependencies

- (optional) xsel - for copying to clipboard on linux (yes, it will work on wayland too, but you need xwayland for that)
