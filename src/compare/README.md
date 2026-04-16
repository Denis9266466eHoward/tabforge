# compare

Side-by-side comparison of two snapshots.

## API

### `compareSnapshots(snapshotA, snapshotB)`
Returns a detailed comparison object:
- `onlyInA` — tabs present only in snapshot A
- `onlyInB` — tabs present only in snapshot B
- `inBoth` — tabs shared by both snapshots
- `similarity` — ratio of shared tabs to total unique tabs (0–1)

### `snapshotsEqual(snapshotA, snapshotB)`
Returns `true` if both snapshots contain exactly the same URLs.

### `rankBySimilarity(reference, snapshots)`
Ranks an array of snapshots by similarity to a reference snapshot, most similar first.

## CLI

```bash
node src/compare/compare.cli.js snapshot-a.json snapshot-b.json
```

Outputs a human-readable comparison summary to stdout.
