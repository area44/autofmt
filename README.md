# autofmt GitHub Action

This GitHub Action provides a reusable Composite Action for fast JavaScript and TypeScript formatting using `oxfmt` (the Oxc formatter).

## Features

- **Blazing Fast**: Powered by Oxc, the fastest JavaScript toolchain.
- **Auto-commit**: Automatically detects changes and pushes formatted code back to your branch.
- **Zero Repo Noise**: Provide rules and ignore patterns directly in your workflow file—no need for extra `.oxfmtrc.json` or `.prettierignore` files in your repository.
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
      # Necessary to push changes back to the repository
      contents: write
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          # Required for the git push step
          fetch-depth: 0

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

| Input | Description | Default |
|-------|-------------|---------|
| `rules` | JSON string of formatting rules | (optional) |
| `ignore` | Multiline string of patterns to ignore | (optional) |

## Permissions

This action requires `contents: write` permissions to push the formatted code back to your repository.

```yaml
permissions:
  contents: write
```

## Why `GITHUB_TOKEN`?

The action uses the built-in `GITHUB_TOKEN` provided by GitHub Actions to authenticate the `git push` command. This is why the `contents: write` permission is necessary. By default, the `actions/checkout` action configures git to use this token for subsequent operations.

## Tagging and Releases

To allow others to use this action via `uses: area44/autofmt@v1`, you should:

1.  Commit and push your changes to the `main` branch.
2.  Create a new release or tag:
    ```bash
    git tag -a v1 -m "Release version 1"
    git push origin v1
    ```
    Users can then reference it as `@v1`.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
