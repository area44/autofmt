# autofmt

This GitHub Action provides a reusable Composite Action for fast JavaScript and TypeScript formatting using `oxfmt` (the Oxc formatter).

## Features

- **Blazing Fast**: Powered by Oxc, the fastest JavaScript toolchain.
- **Auto-commit**: Automatically detects changes and pushes formatted code back to your branch.
- **Default Formatting Rules**: Includes sensible defaults for import sorting and Tailwind CSS class sorting.
- **Zero Repo Noise**: Provide rules and ignore patterns directly in your workflow file - no need for extra files in your repository.
- **CI Friendly**: Automatically adds `[skip ci]` to prevent recursive workflow runs.

## Usage

Create a file named `.github/workflows/format.yml` in your repository:

```yaml
name: Format

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  format:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Checkout code
        uses: actions/checkout@v7
        with:
          fetch-depth: 0
          ref: ${{ github.head_ref || github.ref }}

      - name: Run autofmt
        uses: area44/autofmt@v1
        with:
          # Optional: provide custom rules (merged with defaults)
          rules: |
            {
              "printWidth": 100,
              "semi": true,
              "singleQuote": true
            }
          # Optional: provide custom ignore patterns (appended to defaults)
          ignore: |
            vendor/*.js
```

## Default Configuration

If no `rules` or `ignore` are provided, the following defaults are used:

### Default Ignore Patterns
- `*.min.*`, `*.map`
- `**/public`, `**/build`, `**/dist`, `**/out`
- `**/.github`, `**/.next`, `**/.astro`, `**/.netlify`
- `**/*.gen.*`

### Formatting Rules
- **Import Sorting**: Groups imports by type, builtins/externals, internal, parents, and siblings.
- **Tailwind CSS Sorting**:
  - Attributes: `class`, `className`
  - Functions: `clsx`, `cn`, `cva`, `tv`
  - Stylesheet: Automatically detects `./src/styles/globals.css`.

## Configuration

| Input    | Description                                                     | Default    |
| -------- | --------------------------------------------------------------- | ---------- |
| `rules`  | JSON string of formatting rules (merged with defaults)          | (optional) |
| `ignore` | Multiline string of patterns to ignore (appended to defaults) | (optional) |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
