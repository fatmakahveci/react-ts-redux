# CI/CD

The repository uses GitHub Actions to validate changes and publish release
artifacts to GitHub Container Registry (GHCR).

## Workflows

| Workflow | Trigger | Result |
| --- | --- | --- |
| [CI](../.github/workflows/ci.yml) | Pull requests into `main`, pushes to `main`, or a manual run | Clean installation, dependency audit, lint, tests, TypeScript/production build, Docker build, and an HTTP/security-header smoke test |
| [Publish application image](../.github/workflows/publish-container.yml) | Successful CI for a push to `main`, a published release, or a manual run | Builds and smoke-tests the validated commit's image, then publishes that exact image |
| [Publish source package](../.github/workflows/publish-source-package.yml) | Published release or a manual run | Validates the selected commit, then publishes the source archive and checksum |

Pull requests run validation without registry write permissions. After CI passes
for a push to `main`, the application-image workflow checks out that CI run's
exact commit, even if `main` has advanced. Failed or cancelled runs, pull request
runs, and runs from another repository cannot trigger automatic publication.

Release and manual publishing run the reusable CI workflow first. Automatic
image publication uses the already successful CI result. Every image publication
builds and loads the image locally, checks the application and security headers,
then pushes the tested image without rebuilding. The job summary records the
commit and registry digest. See GitHub's
[workflow completion trigger documentation](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflow_run).

CI reads Node.js 22.23.3 from `.nvmrc`; Docker uses the same version. It runs
`npm ci` with the committed lockfile and an npm download cache.
The Next.js build also checks TypeScript.
`npm run audit:security` includes development dependencies and fails for known
vulnerabilities at any severity. The container smoke test checks the homepage
and the security headers on both successful and not-found responses.

## Repository Configuration

1. Commit and push the workflow files, `package-lock.json`, `Dockerfile`,
   `.dockerignore`, `.nvmrc`, and `next.config.mjs` along with the application changes.
2. Allow GitHub Actions and the referenced actions in the repository settings.
3. Require **Quality checks** and **Container smoke test** from GitHub Actions
   in the `main` branch rules, with branches required to be up to date before
   merging. These checks are enforced in the upstream repository.
4. Merge a passing pull request into `main`. Its push CI run automatically
   starts **Publish application image** after both jobs pass.
5. For a versioned image and source archive, publish a release whose tag contains
   these workflow files. For a manual image delivery, select
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

Automatic `main` deliveries use only the full-commit `sha-...` tag; they do not
move the stable release's `latest` tag. Prefer the digest from the job summary
when an exact, reproducible deployment or rollback reference is needed.

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
npm run audit:security
npm run lint
npm test
npm run build
docker build --tag redux-state-demo:local .
bash scripts/smoke-test-container.sh redux-state-demo:local
docker run --rm --publish 127.0.0.1:3000:3000 redux-state-demo:local
```

Docker must be installed and its daemon running for the container commands.
The smoke test uses a temporary container and cleans it up on success or failure.
Pass a second argument, such as `3100`, if port 3000 is already in use.
Open `http://localhost:3000` to check the container. If installed, `actionlint`
validates the workflow files without running or publishing them.

With the server running, check its response headers separately:

```bash
node scripts/check-security-headers.mjs http://localhost:3000
```

Dependabot checks npm packages, GitHub Actions, and the Docker base image
weekly. Actions are pinned to full commit SHAs and the base image is pinned
to a digest; dependency changes are reviewed through pull requests.
