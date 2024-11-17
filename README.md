We stand with Palestine  against the ongoing [genocide](https://twitter.com/A_Abdelrahman0/status/1720100566368743555) and brutal [occupation](https://twitter.com/A_Abdelrahman0/status/1732448343639327122).

[![Buy Me A Coffee](https://cdn.buymeacoffee.com/buttons/default-orange.png)](https://www.buymeacoffee.com/protibimbok)

# Django Vite Plugin

[![npm version](https://img.shields.io/npm/v/vite-hotfile)](https://www.npmjs.com/package/vite-hotfile)
[![npm downloads](https://img.shields.io/npm/dt/vite-hotfile)](https://www.npmjs.com/package/vite-hotfile)
[![Licence](https://img.shields.io/npm/l/vite-hotfile)](https://www.npmjs.com/package/vite-hotfile)

# vite-hotfile

`vite-hotfile` is a Vite plugin that generates a `.hotfile` containing the development server URL. This can be particularly useful for development workflows that require external tools or scripts to be aware of the dev server's address.

## Installation

Install the plugin using npm, yarn, or pnpm:

```bash
# npm
npm install vite-hotfile --save-dev

# yarn
yarn add vite-hotfile --dev

# pnpm
pnpm add vite-hotfile --save-dev
```

## Usage

Add `vite-hotfile` to your Vite configuration file (`vite.config.ts` or `vite.config.js`):

```javascript
import { defineConfig } from 'vite';
import hotfile from 'vite-hotfile';

export default defineConfig({
  plugins: [
    hotfile() // Default destination is './hotfile'
    // or specify a custom destination:
    // hotfile('./path/to/your/.hotfile')
  ],
});
```

### Parameters

- `dest` (optional): A string representing the destination path of the `.hotfile`. The default value is `./hotfile`.

### Example

By default, the `.hotfile` is created in the root of your project. You can customize the destination like this:

```javascript
hotfile('./my/custom/hotfile');
```

When the development server starts, the plugin writes the dev server URL (e.g., `http://localhost:3000`) into the specified file.

## Why Use This Plugin?

- **Simplifies dev workflows**: Share the dev server URL with other tools or scripts automatically.
- **Customizable**: Easily define where the `.hotfile` is created.
- **Lightweight**: Minimal configuration with maximum utility.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
