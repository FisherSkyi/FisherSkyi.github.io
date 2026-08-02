# Miscellaneous Links Design

## Goal

Turn the unfinished Miscellaneous page into a polished, growing collection of external links that fits the site's existing visual language.

## Content and interaction

- Use the heading **Things worth keeping** and the supporting line **A small collection of links I return to.**
- Start the collection with `theunknownth.ing` and make the whole link row clickable.
- Show a title, short description, hostname, and external-link icon for each entry.
- Open external links in a new tab with safe `rel` attributes.
- Include visible hover and keyboard-focus states.
- Connect the existing top-bar filter to link titles, descriptions, and hostnames, using the site's existing empty state when nothing matches.

## Structure

- Store link content in a `misc` array in `src/data.js` so future entries require data changes only.
- Pass the existing `match` function from `App` into `Miscellaneous`.
- Render the collection in `src/sections.jsx` using semantic anchor elements.
- Add narrowly scoped styles in `src/index.css`; reuse existing color, type, spacing, border, and motion tokens.
- Use a distinct Miscellaneous navigation icon that remains consistent with the Lucide icon set.

## Visual design

The collection will use full-width bordered rows rather than cards. Each row will have a restrained two-part layout: the title and description on the left, and the hostname with an external-link icon on the right. A subtle accent border/background response will make links feel interactive without overpowering the site's minimal design. On narrow screens, metadata will wrap below the primary text.

## Scope boundaries

- No categories, tags, thumbnails, sorting controls, or persistence are needed for the initial collection.
- No unrelated restructuring or copy changes will be included.
- Existing uncommitted work outside the Miscellaneous implementation will be preserved.

## Verification

- Run the production build.
- Confirm the Miscellaneous hash route renders and navigation remains valid.
- Check that filtering finds the seed link and shows the empty state for a non-match.
- Check external-link attributes, keyboard focus, dark/light themes, and narrow-screen wrapping.
