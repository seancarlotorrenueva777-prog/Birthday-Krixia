# Asset accuracy pass

This pass fixes artwork loss from the previous cleanup round.

## What changed
- Removed all live HTML references to `public/designs/round5-clean/*`.
- Restored complete source cutouts for the Roblox character, mail characters, Sanrio friends, Michael Jackson figure, and Valorant logo.
- Added `public/designs/complete/` with the restored/cropped-to-transparent-bounds versions used by the site.
- Rebuilt the seven New Design JPG-to-PNG assets with a conservative foreground extraction so detached hearts, ears, figures, logo letters, and other valid artwork are preserved.
- Kept transparent padding removal separate from subject removal: crops are made only after foreground extraction and include a safety margin.
- Updated the Round 5 CSS documentation so future edits do not describe the old aggressive trimming behavior.

## Verification
- Every PNG referenced by `birthday.html` exists.
- No live HTML reference remains to the old `round5-clean` path.
- All corrected artwork files are RGBA PNGs with non-empty alpha masks.
- TypeScript source was parsed with the available global compiler; full project type-check/build was not possible because dependencies are not installed in the supplied ZIP and the sandbox cannot fetch packages.


## Final visual pass — Krixia
- Restored the secret strawberry with a stronger visible composition.
- Changed visible birthday copy to KRIXIA / Krixia.
- Replaced entry/secret page yarn transition with a flash-of-light reveal.
- Removed Cinnamoroll from the large central envelope and repositioned the full Cinnamoroll mail art as a floating header accent.
- Added sender labels: Ethan, Pane, Markli, Nissi, Sean.
- Updated the letter reader to show the sender per envelope.
- Replaced the site MJ figure with the final verified transparent cutout asset.
- Added tactile title texture, soft paper grain, foil-like highlight, and mail desk polish while preserving the original handmade aesthetic.
