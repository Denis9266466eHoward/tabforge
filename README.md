# tabforge

A CLI tool to generate and manage browser session snapshots for reproducible dev environments.

---

## Installation

```bash
npm install -g tabforge
```

---

## Usage

Capture your current browser session and save it as a named snapshot:

```bash
tabforge snapshot save --name my-dev-session
```

Restore a snapshot to reopen all tabs in your browser:

```bash
tabforge snapshot restore --name my-dev-session
```

List all saved snapshots:

```bash
tabforge snapshot list
```

Export a snapshot to share with your team:

```bash
tabforge snapshot export --name my-dev-session --output ./session.json
```

Import a snapshot from a file:

```bash
tabforge snapshot import --file ./session.json
```

---

## How It Works

tabforge connects to your browser via the Chrome DevTools Protocol (CDP), captures all open tabs and their URLs, and stores them as portable JSON snapshots. Snapshots can be versioned, shared, and restored on any machine — making it easy to pick up exactly where you left off or onboard teammates with a consistent set of resources.

---

## Requirements

- Node.js >= 16
- Chrome or Chromium-based browser

---

## License

MIT © tabforge contributors