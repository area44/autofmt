# autofmt

This GitHub Action provides a reusable Composite Action for fast JavaScript and TypeScript formatting using `oxfmt` (the Oxc formatter).

## Features

- **Blazing Fast**: Powered by Oxc, the fastest JavaScript toolchain.
- **Auto-commit**: Automatically detects changes and pushes formatted code back to your branch.
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
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          ref: ${{ github.head_ref || github.ref }}

      - name: Run autofmt
        uses: area44/autofmt@v1
        with:
          # (Optional) Provide formatting rules as a JSON string
          rules: |
            {
              "printWidth": 100,
              "semi": true,
              "singleQuote": true
            }
          # (Optional) Provide ignore patterns as a multiline string
          ignore: |
            dist/**
            build/**
            vendor/*.js
```

## Configuration

| Input    | Description                            | Default    |
| -------- | -------------------------------------- | ---------- |
| `rules`  | JSON string of formatting rules        | (optional) |
| `ignore` | Multiline string of patterns to ignore | (optional) |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
