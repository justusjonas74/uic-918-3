# Migration Plan: npm to pnpm & Nix Dev Environment - COMPLETED

This document outlines the steps to migrate the `uic-918-3` project from `npm` to `pnpm` and set up a reproducible development environment using `flake.nix` and `direnv`.

## Phase 1: pnpm Migration

- [x] **Prepare for pnpm**
  - [x] Delete `node_modules/` to ensure a clean slate.
  - [x] Delete `package-lock.json`.
- [x] **Initialize pnpm**
  - [x] Run `pnpm import` to generate `pnpm-lock.yaml` from the existing `package-lock.json` (if still available) or simply run `pnpm install`.
  - [x] Verify that `pnpm-lock.yaml` is created.
- [x] **Update package.json**
  - [x] Replace `npm run` with `pnpm run` in all script definitions (e.g., `build:release`, `prepublishOnly`).
  - [x] Update any documentation (like `README.md`) that references `npm`.
- [x] **Verification**
  - [x] Run `pnpm install` and ensure all dependencies are resolved correctly.
  - [x] Run `pnpm test` to verify that the test suite still passes.
  - [x] Run `pnpm run build` to ensure the build process is intact.

## Phase 2: Nix & direnv Setup

- [x] **Create `flake.nix`**
  - [x] Define a `flake.nix` file that includes:
    - `nixpkgs` input.
    - `devShell` for the project's supported systems (e.g., `x86_64-linux`, `aarch64-darwin`).
    - Build inputs: `nodejs_22`, `pnpm`, `emscripten`, `asn1c`, and `bash`.
- [x] **Setup `direnv`**
  - [x] Create a `.envrc` file containing `use flake`.
  - [x] Run `direnv allow` to activate the environment.
- [x] **Verification**
  - [x] Ensure that `node -v` and `pnpm -v` within the shell match the versions defined in the flake.
  - [x] Verify that the environment automatically loads when entering the directory.

## Phase 3: Cleanup & Finalization

- [x] **Update `.gitignore`**
  - [x] Add `.direnv/` to `.gitignore`.
  - [x] Ensure `node_modules/` is still ignored.
- [x] **Final Test Run**
  - [x] Perform a full `pnpm run build:release` within the Nix environment.
- [x] **GitHub Actions & Dependabot**
  - [x] Update `.github/workflows/node.js.yml` to use `pnpm/action-setup` and `pnpm` commands.
  - [x] Update `.github/dependabot.yml` to use `pnpm` ecosystem.
- [x] **Fix missing dependencies**
  - [x] Added `@types/emscripten` to `devDependencies`.
