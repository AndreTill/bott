- [Docker Scout](#docker-scout)
- [Usage](#usage)
- [CLI Plugin Installation](#cli-plugin-installation)
- [Building](#building)

# Docker Scout

[Docker Scout](https://www.docker.com/products/docker-scout/) is a collection of software supply chain features that appear throughout Docker user interfaces and the command line interface (CLI). These features provide detailed insights into the composition and security of container images.

This repository contains the source code of the `docker scout` CLI plugin.

## Versions and Releases

### Version Scheme

Versions of `docker scout` are like `x.y.z` with `x` equal `1`:

- `1.y.z`: do not bump the major version. This might have impact due to the Go versioning rules, so it's to avoid and keep for very good reasons.
- `1.(y+1).0`: is the default new version to release. If you don't know which version to pick, pick this one.
- `1.y.(z+1)`: is the version to use when you need to release a patch. This is done by cherry-picking the commit to the `release/1.y` branch and release from there. Please keep that for important patches only. Like a `panic` happening in the code or anything really blocking the CLI. Or if we are during the Docker Desktop code freeze and need to release a critical fix.

### Release Process

Once everything is ready on `main`, the release process is as follows:
- create a git `tag` on main with the new version `1.y.0`
- this will trigger a lot of automated processes:
  - build the binaries for all platforms and push them to [`docker/scout-cli`](https://github.com/docker/scout-cli)
    - this will open a pull request and run some tests
    - once the tests are green, the PR will be automatically merged
    - a new release will be created _in draft_
  - build the github actions related binaries for all platforms and push them to [`docker/scout-action`](https://github.com/docker/scout-action)
    - this will open a pull request and run some tests
    - once the tests are green, the PR will be automatically merged
    - a new release will be created _in draft_
  - build and push the Docker image for the CLI to `docker/scout-cli:1.y.0`, `docker/scout-cli:1.y`, `docker/scout-cli:1`, `docker/scout-cli:latest`
  - build and push the Docker image for the SBOM indexer to `docker/scout-sbom-indexer:1.y.0`, `docker/scout-sbom-indexer:1.y`, `docker/scout-sbom-indexer:1`, `docker/scout-sbom-indexer:latest`
  - open a pull request under [`docker/pinata`](https://github.com/docker/pinata) to update the CLI version in Docker Desktop
    - the pull request is created with the right labels and body

What you have to manually do is then:
- open a branch `release/1.y` from `main` that will host the patch releases if needed. This branch has a different set of rules regarding protection and the commit built to ensure the CI is working properly even with conflicts to `main`
- create the release under `docker/scout-cli-plugin`: this is an internal one, so you can add all details as you want
- fill the release under `docker/scout-cli`: this is a **public one** so you need to be careful about what you put in there but put as many details as needed and to not forget to add examples, screenshots, etc
- fill the release under `docker/scout-action`: this is a **public one** so you need to be careful about what you put in there but put as many details as needed and to not forget to add examples, screenshots, etc
- check and merge the PR under `docker/pinata` to update the CLI version in Docker Desktop. It might be required to ask for a rebuild because the release might not be available at the time the CI will run
- open a PR to add release notes to the docs at https://github.com/docker/docs/blob/main/content/scout/release-notes/cli.md

## Usage

See the [reference documentation](./docs/reference/scout.md).

[Read more](https://docs.docker.com/scout/) about Docker Scout including Docker Desktop and Docker Hub integrations.

## CLI Plugin Installation

Refer to the public [installation instructions](https://github.com/docker/scout-cli#manual-installation).

## Building

### Requirements

- [Go](https://go.dev)
- [Task](https://taskfile.dev)
- [Docker](https://www.docker.com)

### Binary for the Local Architecture

```console
$ task go:build
```

This will create a binary for the local architecture at `dist/docker-scout`.

### Installation

```console
$ task go:install
```

This will create the binary and install it at `~/.docker/cli-plugins/docker-scout`.

### Cross Platform Build

```console
$ task go:snapshot
```

This will create the different binaries for all supported platforms and make them available in `./dist` folder.

### Docker Image

```console
$ task docker:build 
```

This will build a Docker image for the local architecture and load it.

### Multi Arch Docker Image

```console
$ task docker:build:all
```

This will build a multi arch image for the two platforms `linux/amd64` and `linux/arm64`.

 
