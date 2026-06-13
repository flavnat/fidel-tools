# Contributing to Fidel Tools

Thank you for your interest in contributing to Fidel Tools! Our goal is to build the most robust, high-performance, and developer-friendly NLP pipeline for Amharic and other Ethiopic script languages.

By contributing, you help make Amharic-language application development accessible to developers worldwide.

---

##  How to Contribute

We welcome contributions of all kinds:
*  **Bug Reports**: Open an issue describing steps to reproduce the bug.
*  **Feature Requests**: Propose enhancements or new pipeline stages.
*  **Documentation**: Improve the README, developer guides, or inline code comments.
*  **Code Contributions**: Fix bugs, add new tools, optimize performance, or create new language packs.

---

##  Development Setup

Fidel Tools is managed as a pnpm monorepo. 

### Prerequisites
* **Node.js**: v20 or later
* **pnpm**: v9 or later

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Yehonatal/fidel-tools.git
   cd fidel-tools
   ```
2. Install workspace dependencies:
   ```bash
   pnpm install
   ```
3. Build all workspace projects:
   ```bash
   pnpm build
   ```

### Workspace Commands
* **Build all packages**: `pnpm build`
* **Run test suite**: `pnpm test`
* **Run core tests only**: `pnpm --filter @fidel-tools/core test`
* **Run validation check**: `pnpm --filter @fidel-tools/validate-pack validate`
* **Fix validation warnings**: `pnpm --filter @fidel-tools/validate-pack validate -- --fix`

---

##  Language Pack Guidelines

Fidel Tools utilizes a strictly schema-driven architecture. The configuration for languages resides in JSON packs (like `packages/lang-am/am.json`).

If you are modifying or creating a language pack:
1. **Never introduce duplicate rules**: Ensure prefixes, suffixes, and stopwords do not contain duplicates.
2. **Expose logical structures**: Follow the schema defined in `packages/core/src/types.ts`.
3. **Verify via Validator**: Always run `@fidel-tools/validate-pack` to make sure there are no mapping cycles or invalid schemas.
4. **Use CLI Fix**: If you add lists that contain duplicates, let the validator clean them up automatically using:
   ```bash
   pnpm --filter @fidel-tools/validate-pack validate -- --fix
   ```

---

##  Git Workflow

1. Fork the repository and create your branch from `main`:
   ```bash
   git checkout -b feat/your-awesome-feature
   ```
2. Make your changes, ensuring code matches existing style conventions.
3. Write comprehensive unit tests in the respective `tests/` directory.
4. Verify that all tests pass (`pnpm test`) and the build succeeds (`pnpm build`).
5. Commit your changes using descriptive commit messages. We follow Conventional Commits:
   - `feat(...)`: A new feature
   - `fix(...)`: A bug fix
   - `docs(...)`: Documentation changes
   - `chore(...)`: Maintenance or dependencies
6. Push to your fork and submit a Pull Request.

---

## Code of Conduct

* Be respectful and constructive.
* Keep pull requests focused and small.
* Write clean, self-documenting code. Maintain code comments and docstrings.
