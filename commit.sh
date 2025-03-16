#!/bin/bash
HEADREF=$1 

git config --global user.name "GitHub Actions"
git config --global user.email "actions@github.com"
git fetch origin
git checkout -B "$HEADREF" "origin/$HEADREF"
git add .
git commit -m "Update changelog"
git push origin "$HEADREF"