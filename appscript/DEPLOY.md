# Deploy the AI Dude form as a Google Apps Script Web App

This hosts the landing page **and** writes every lead into your Google Sheet.

**Your sheet:** https://docs.google.com/spreadsheets/d/1yszd_HHYOGPTmavSCiYBI0vS4hyaxQ4QzTzI8AxRZ4Y/edit

## Why Apps Script (and not the Claude artifact)
A published Claude artifact runs in a sandbox that blocks all outbound network
calls, so the artifact form cannot post to a Sheet. Hosting the same page as an
Apps Script Web App removes that limit — the form talks to the sheet on the same
Google origin, and it works for anyone who opens the link.

## Files
- `Code.gs` – server code: serves the page + `submitLead()` appends a row.
- `Index.html` – the full landing page (same design as the artifact), but its
  form calls `google.script.run.submitLead(...)`.
- `appsscript.json` – project manifest (timezone + web-app access).

## Steps

1. Go to **https://script.google.com** → **New project**.
2. Rename it (e.g. `AI Dude Form`).
3. **Code.gs** – delete the sample code, paste the contents of `Code.gs`.
4. Add the HTML file: **Files → + → HTML**, name it exactly **`Index`**
   (no `.html`), then paste the contents of `Index.html`.
5. (Optional) **Project Settings → “Show appsscript.json manifest file”**, then
   paste the contents of `appsscript.json` over the existing manifest.
6. **Deploy → New deployment → gear icon → Web app**:
   - **Description:** AI Dude form
   - **Execute as:** **Me**
   - **Who has access:** **Anyone**
   - Click **Deploy**.
7. The first deploy asks you to **Authorize access** – approve it (it needs
   permission to edit your spreadsheet). If you see “Google hasn’t verified this
   app”, click **Advanced → Go to … (unsafe)** — it’s your own script.
8. Copy the **Web app URL** — that’s your live form. Share that link.

## Verify it works
- Open the Web app URL, fill the form, submit.
- Open your sheet — a new row appears: `Timestamp | Name | Email | Phone`
  (the header row is created automatically on the first submission).

## Updating the page later
After editing `Code.gs` or `Index.html`, redeploy the SAME deployment so the URL
stays the same: **Deploy → Manage deployments → (your deployment) → edit (pencil)
→ Version: New version → Deploy**.

## Notes
- `SHEET_ID` / `SHEET_GID` at the top of `Code.gs` point at your sheet’s first
  tab. If you rename the tab it still works (matched by gid); to target a
  different tab, set `SHEET_GID` to that tab’s gid (the number in the sheet URL).
- Basic server-side validation rejects bad name/email/phone before writing.
- A ScriptLock prevents two people submitting at once from clobbering a row.
