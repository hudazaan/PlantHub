# Contributing

Thanks for contributing to PlantHub.

## Setup

1. Install dependencies: `npm install`
2. Create a `.env` file using variables from README.
3. Generate JWT secret once: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
4. Start dev server: `npm run dev`
5. Run tests: `npm test`

## Contribution Workflow

### 1. Clone the Repository
```bash
git clone https://github.com/hudazaan/PlantHub.git
cd PlantHub
```

### 2. Create a Feature Branch
```bash
git checkout -b feature/brief-description
```
Example: `git checkout -b feature/add-responsive-fixes`

### 3. Make Changes
- Edit files as needed
- Test locally: `npm run dev`
- Run tests: `npm test`

### 4. Commit Changes (with sign-off)
```bash
git add .
git commit -m "Brief description of changes" -m "Longer description if needed" --signoff
```

Or use the shorthand:
```bash
git commit -m "Brief description" -s
```

### 5. Test Before Pushing
```bash
npm test
```
Ensure all tests pass.

### 6. Push to Your Fork
```bash
git push origin feature/brief-description
```

### 7. Open a Pull Request
- Go to [GitHub](https://github.com) and navigate to the original repository.
- Click "New Pull Request" → select your branch.
- Write a clear PR description (what changed, why, any testing notes).
- Submit the PR.

### 8. Wait for Review
Maintainers will review and provide feedback. Be ready to address comments.

## Pull Request Checklist

- Keep changes focused and small.
- Add or update tests for behavior changes.
- Do not commit secrets or `.env` values.
- Ensure `npm test` passes.
- Update docs when API or setup changes.
