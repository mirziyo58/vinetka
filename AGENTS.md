# Project architecture
- Keep the vinetka editor at the index route using client-only rendering for Konva, because the canvas needs browser APIs.
- Store each page's canvas dimensions with its page data, because pages may have different sizes and exports must match the chosen dimensions.
- Keep drafts in browser storage, because this project has no connected backend; do not imply order submissions work without one.
