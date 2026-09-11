---
trigger: manual
description: "Release checklist and deployment steps"
---

# Release Checklist

## Pre-release

1. Run the full test suite with `npm test`.
2. Check for uncommitted changes.
3. Update `CHANGELOG.md` with the new version and summary.

## Deployment

1. Create a Git tag with the version number.
2. Push the tag to the remote repository.
3. Deploy the staging build and run smoke tests.
4. Promote to production only after staging passes.
