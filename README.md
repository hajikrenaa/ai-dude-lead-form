# AI Dude — eCommerce Store Build (Landing Page + Lead Form)

A minimalist, glowing-purple landing page for the **"Build & launch your
eCommerce store in half a day"** offer. It collects leads (name, email, phone)
and shows the full production build spec with a one-click copy.

**Live form (Apps Script Web App):**
https://script.google.com/macros/s/AKfycbwdhT1Iz6-NauT1xVYzn2o_12dG7o5Vpks-Z0nlpcnjV9n5K1WaJH5ddO_w4LsGuE5F/exec

- **Font:** Space Grotesk · **Look:** white background, glowing purple, minimal
- **Built with:** React (via CDN, no build step)

## Repo contents

```
appscript/
  Code.gs          Server: serves the page + submitLead() writes o Google Sheet
  Index.html       The landing page (form posts via google.script.run)
  appsscript.json  Web-app manifest (Asia/Kolkata, access: anyone)
  DEPLOY.md        Step-by-step deploy guide
landing.html       Standalone copy of the page (no backend — for preview/hosting)
```

## Lead capture

Submissions are written to this Google Sheet:
https://docs.google.com/spreadsheets/d/1yszd_HHYOGPTmavSCiYBI0vS4hyaxQ4QzTzI8AxRZ4Y/edit
(columns: `Timestamp | Name | Email | Phone`).

The reliable way to run this publicly is as a **Google Apps Script Web App** —
see [`appscript/DEPLOY.md`](appscript/DEPLOY.md).

> Note: `landing.html` is the same page without a backend; a static host can’t
> write to the Sheet on its own, which is why the Apps Script version exists.
