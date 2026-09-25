# CI/CD

The repository uses GitHub Actions to validate changes and publish release
artifacts to GitHub Container Registry (GHCR).

## Workflows

| Workflow | Trigger | Result |
| --- | --- | --- |
| [CI](../.github/workflows/ci.yml) | Pull requests into `main`, pushes to `main`, or a manual run | Clean installation, lint, tests, TypeScript/production build, Docker build, and an HTTP smoke test |
| [Publish application image](../.github/workflows/publish-container.yml) | Published release or a manual run | Validates the selected commit, then publishes a runnable application image |
| [Publish source package](../.github/workflows/publish-source-package.yml) | Published release or a manual run | Validates the selected commit, then publishes the source archive and checksum |

Both publishing workflows call the same CI workflow and require all of its
jobs to pass. Pull requests run validation without registry write permissions.
CI reads Node.js 22.23.3 from `.nvmrc`; Docker uses the same version. It runs
`npm ci` with the committed lockfile and an npm download cache.
The Next.js build also checks TypeScript.

## Enable the Workflows

1. Commit and push the workflow files, `package-lock.json`, `Dockerfile`,
   `.dockerignore`, `.nvmrc`, and `next.config.mjs` along with the application changes.
2. Allow GitHub Actions and the referenced actions in the repository settings.
3. Run **CI** from the Actions tab and confirm both **Quality checks** and
   **Container smoke test** pass. Add these checks to the `main` branch rules
   if merges should require successful validation.
4. Publish a release whose tag contains these workflow files, or select
   **Publish application image → Run workflow** for the desired ref.

Publishing uses the automatically provided `GITHUB_TOKEN`; no extra registry
secret is required. The publish jobs request `packages: write`. Organization
policies and any existing package permissions must allow this repository to
publish. New GHCR packages default to private; configure package visibility
or read access before distributing the image. See the
[GHCR authentication and permissions documentation](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).

## Application Images

The image name is `ghcr.io/<owner>/<repository>/app` in lowercase. For this
repository it is `ghcr.io/fatmakahveci/react-ts-redux/app`.

| Tag | When published |
| --- | --- |
| `sha-<full-commit-sha>` | Every successful application-image publication |
| Release tag, such as `v1.0.0` | A published release or a manual run targeting a tag |
| `latest` | A published release that is not marked as a prerelease |

Manual branch runs and prereleases do not update `latest`. Published images
target `linux/amd64`. The existing source package keeps its separate
`ghcr.io/<owner>/<repository>` location.

The container runs the Next.js standalone server as the unprivileged `node`
user and exposes port 3000. It includes a health check for the home page.
The image build follows Next.js
[standalone output requirements](https://nextjs.org/docs/app/api-reference/config/next-config-js/output),
including copying static files into the runtime image.

After an image has been published, run it on a Docker host:

```bash
docker run --rm --name redux-state-demo \
  --publish 127.0.0.1:3000:3000 \
  ghcr.io/fatmakahveci/react-ts-redux/app:v1.0.0
```

Replace the example tag with a published version. For a private package,
authenticate to GHCR first using a credential with package read access.
For a rollback, run the previous release tag or image digest.

The CD workflow delivers the image to the registry. Running it on a hosting
service, configuring a domain, and enabling HTTPS are separate deployment
steps; this repository does not configure a production host.

## Local Verification

```bash
npm ci
npm run lint
npm test
npm run build
docker build --tag redux-state-demo:local .
docker run --rm --publish 127.0.0.1:3000:3000 redux-state-demo:local
```

Docker must be installed and its daemon running for the last two commands.
Open `http://localhost:3000` to check the container. If installed, `actionlint`
validates the workflow files without running or publishing them.

Dependabot checks npm packages, GitHub Actions, and the Docker base image
weekly. Actions are pinned to full commit SHAs and the base image is pinned
to a digest; dependency changes are reviewed through pull requests.
