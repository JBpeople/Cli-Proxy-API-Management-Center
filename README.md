# CLIProxyAPI Management Center (JBpeople fork)

This is the frontend companion fork for the JBpeople CLIProxyAPI fork.

It is focused on making OpenAI-compatible provider management more practical.

## What this fork changes

- adds a dedicated **Model Sync** page
- adds a **Run now** action for manual sync
- adds **Auto discover models** toggle to the OpenAI-compatible provider editor
- uses a more Chinese-friendly management workflow/UI for the added features

## Intended workflow

This frontend is designed to work together with:

- https://github.com/JBpeople/CLIProxyAPI

The backend fork provides:

- automatic model discovery from `/v1/models`
- model sync status API
- dynamic auth registration for discovered compatibility models

## Added backend endpoints expected by this frontend

```text
GET  /v0/management/model-sync/status
POST /v0/management/model-sync/run
```

## Build

```bash
npm install
npm run build
```

The build output is:

- `dist/index.html`

You can rename/copy it as `management.html` when deploying into a CLIProxyAPI static directory.

## Notes

This fork is meant to be used with the matching backend fork.
Using it with upstream backend may cause some added UI features to show but not work fully.

## License

MIT
