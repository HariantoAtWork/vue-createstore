# Automating Package Publishing with GitHub Actions: A Vue.js Library Journey

As I recently developed my Vue.js utility library `@harianto/vue-createstore`, I wanted to streamline the release process. This post details how I set up automated versioning and npm publishing using GitHub Actions.

## The Challenge

Managing package versions and publishing to npm manually can be error-prone and time-consuming. I needed a solution that would:

1. Automate version bumping (major, minor, patch)
2. Create Git tags and GitHub releases
3. Publish to npm automatically
4. Ensure consistency in the release process

## The Solution: GitHub Actions Workflows

I implemented three GitHub Actions workflows to handle different aspects of the process:

### 1. CI Workflow (ci.yml)

This workflow runs on every push and pull request to ensure the package builds correctly:

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [20.x]

    steps:
    - uses: actions/checkout@v4
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: ${{ matrix.node-version }}
    - name: Install pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 8
    - name: Install dependencies
      run: pnpm install
    - name: Build
      run: pnpm run build
    - name: Check dist files
      run: |
        test -f dist/index.esm.js
        test -f dist/index.umd.js
```

### 2. Version Management Workflow (version.yml)

This workflow handles version bumping and release creation:

```yaml
name: Version Management

on:
  workflow_dispatch:
    inputs:
      version_type:
        description: 'Version type (major, minor, patch)'
        required: true
        default: 'patch'
        type: choice
        options:
          - major
          - minor
          - patch

jobs:
  version:
    runs-on: ubuntu-latest
    permissions:
      contents: write
      packages: write
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
      - name: Bump version
        id: version
        run: |
          # Get current version and bump it
          CURRENT_VERSION=$(node -p "require('./package.json').version")
          # ... version bumping logic ...
          npm version $NEW_VERSION --no-git-tag-version
          git tag -a "v$NEW_VERSION" -m "Release v$NEW_VERSION"
      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          tag_name: v${{ steps.version.outputs.new_version }}
          draft: false
          prerelease: false
          generate_release_notes: true
```

### 3. Release Workflow (release.yml)

This workflow handles npm publishing:

```yaml
name: Release

on:
  release:
    types: [published]
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to publish'
        required: true
        type: string

jobs:
  publish:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
    - uses: actions/checkout@v4
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.x'
        registry-url: 'https://registry.npmjs.org'
    - name: Install dependencies
      run: pnpm install
    - name: Build
      run: pnpm run build
    - name: Publish to npm
      run: pnpm publish --access public --no-git-checks
      env:
        NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Setting Up the Workflows

To implement this automation, I followed these steps:

1. Created the workflow files in `.github/workflows/`
2. Added necessary permissions in the GitHub repository settings
3. Set up the `NPM_TOKEN` secret for npm publishing
4. Configured the workflows to work together seamlessly

## The Release Process

Now, releasing a new version is as simple as:

1. Go to GitHub Actions
2. Run the "Version Management" workflow
3. Choose the version type (major, minor, patch)
4. Click "Run workflow"

The workflow will:
1. Bump the version in package.json
2. Create a git tag
3. Create a GitHub release
4. Trigger the release workflow
5. Publish to npm automatically

## Benefits

This automation has brought several benefits:

1. **Consistency**: Every release follows the same process
2. **Time-saving**: No more manual version bumping or publishing
3. **Error reduction**: Automated steps reduce human error
4. **Better tracking**: Each release is properly tagged and documented
5. **Flexibility**: Can still trigger releases manually if needed

## Conclusion

Setting up GitHub Actions for automated package publishing has significantly improved my development workflow. It ensures consistent releases and saves time that can be better spent on development.

The complete setup can be found in my GitHub repository: [vue-createstore](https://github.com/HariantoAtWork/vue-createstore)

## Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [npm Publishing Guide](https://docs.npmjs.com/creating-and-publishing-scoped-public-packages)
- [Semantic Versioning](https://semver.org/) 