# WAD621S Lab 4 — Registration & Profile Cards

Student: Markus N.F.T.
Module: WAD621S

Overview
--------
This is a small client-side registration demo that validates a form and displays submitted students as profile cards and a summary table. The project emphasises simplicity, accessibility, and small interactive touches (entrance animation, inline errors).

Branding
--------
The site is branded as "Fitty Walaula" in the header and footer.

Key features
------------
- Client-side validation for required fields and email format
- Dynamic creation of profile cards and a synchronized summary table
- Remove buttons (remove from both card view and table)
- Accessible markup (labels, ARIA live region for feedback)
- Small UI polish (animations, responsive layout)

How to run
----------
1. Open `index.html` in any modern browser (no server required).
2. Fill in the registration form and click "Add Student".
3. The profile card will appear at the top of the cards area and a row will be added to the summary table.

Theme & shortcuts
------------------
- There is a theme toggle button in the header. The last chosen mode is remembered in your browser.
- Press `T` (while the page is focused) to toggle dark/light quickly.

Notes on persistence
--------------------
This demo does not persist student entries across page reloads. If you want entries to survive reloads, I can add localStorage persistence or a simple backend API.

Customisation tips
------------------
- Quick rebrand: edit the CSS variables at the top of `style.css` (for example `--primary`, `--bg`, `--text`).
- To change the placeholder image used when no photo URL is provided, edit the default URL in `script.js` (search for `placehold.co`).

Next steps (optional)
---------------------
- Persist students to localStorage so they survive reloads.
- Add form edit functionality (edit an existing student).
- Add filtering/sorting to the summary table.

Repository
----------
https://github.com/WAD621S-2025/lab04-214021254.git

Authorship
----------
This project and its source code were written by the student (Markus N.F.T.). No generative AI (e.g., ChatGPT or similar) was used to produce the final submitted code.

