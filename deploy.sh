#!/bin/bash
set -e

git checkout main

if ! git show-ref --quiet refs/heads/gh-pages; then
  git branch gh-pages
fi

git checkout gh-pages
git merge main --no-edit

npm run build

git add dist -f
git commit -m "Deployment commit" || echo "No changes to commit"

npm run deploy

git checkout main
