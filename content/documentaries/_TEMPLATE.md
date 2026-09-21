---
# ===========================================================================
# DOCUMENTARY TEMPLATE
# ===========================================================================
# Files starting with "_" are ignored by the site, so this one is safe to keep
# as a reference. To add a film:
#
#   1. Copy this file to content/documentaries/<your-slug>.md
#      The filename becomes the URL:
#      content/documentaries/my-film.md -> /documentaries/my-film/
#   2. Fill in the frontmatter below
#   3. Write a director's note in the body (optional but recommended)
#
# Required: title, subject.  Everything else is optional.
# ===========================================================================

title: Your film title
subject: The person's name            # REQUIRED. Who the film is about.
date: '2026-01-01'                    # YYYY-MM-DD, when it was finished.
location: Where you shot it
runtime: 18 min
summary: >-
  One or two sentences for the card and the film page. If you leave this out,
  the first ~220 characters of the body are used.
tags:
  - Portrait
featured: true                        # optional; pins it to the top of the grid

# ---------------------------------------------------------------------------
# videoUrl — the site works out how to embed whatever you paste here:
#
#   https://www.youtube.com/watch?v=XXXXXXXXXXX   -> YouTube (privacy domain)
#   https://youtu.be/XXXXXXXXXXX                  -> YouTube
#   https://vimeo.com/123456789                   -> Vimeo
#   https://www.bilibili.com/video/BV1xx411c7mD   -> Bilibili (danmaku off)
#   /videos/my-film.mp4                           -> a file you dropped in public/videos/
#
# Leave it out and the site shows a styled placeholder frame instead of a
# broken player — safe to create the page before the film is finished.
# ---------------------------------------------------------------------------
videoUrl: ''

# poster: /images/my-film-still.jpg   # optional 16:9 still; file goes in public/images/

# Shown as a two-column credits table on the film page. Add or remove rows freely.
credits:
  Director & Camera: Your Name
  Sound: A Collaborator
  Editor: Someone Else
---

A short synopsis, then a director's note — why the film exists, what you were
trying to do, what you had to give up. This is the only long-form text on the
film page, so it is worth writing properly.

## Director's note

What you saw that the film does not show. What the subject asked you to keep
or cut. The decision you are still not sure about.

---

Anything after a horizontal rule reads as an afterword.
