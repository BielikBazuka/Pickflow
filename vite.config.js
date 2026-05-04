# ── GitLab Pages deployment ────────────────────────────────────────────────────
# Builds the app and publishes to GitLab Pages on every push to main.
# Access it at: https://<group>.gitlab.io/<project>/

pages:
  image: node:20-alpine
  stage: deploy
  script:
    - npm ci
    - npm run build
    - mv dist public          # GitLab Pages serves from a folder named "public"
  artifacts:
    paths:
      - public
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
