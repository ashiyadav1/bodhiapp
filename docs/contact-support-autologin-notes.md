# Contact Support Auto-Login Notes

## Goal

Open Moodle's Contact site support page from the app with the current user already logged in.

## Supported Flow

Use Moodle mobile auto-login for an already authenticated app user:

```ts
const site = CoreSites.getRequiredCurrentSite();
const supportUrl = `${site.getURL()}/user/contactsitesupport.php`;

await site.openInAppWithAutoLogin(supportUrl);
```

This asks Moodle for an auto-login key and opens:

```text
/admin/tool/mobile/autologin.php?userid=...&key=...&urltogo=...
```

## Requirements

- The user must already be logged in to the app.
- The account must have a Moodle `privateToken`.
- The request must come from the installed Moodle mobile/desktop app, not browser preview.
- The support URL must belong to the same Moodle site.
- Moodle must support `tool_mobile_get_autologin_key`.
- Moodle mobile auto-login must be enabled and allowed server-side.

## Browser Preview Limitation

This does not work from `ionic serve` or normal browser testing.

Moodle checks whether the request comes from the Moodle mobile/desktop app. Browser JavaScript cannot set the `User-Agent` header, so Moodle can return:

```text
This functionality is only available when accessed via the Moodle mobile or desktop app.
```

Test this only in an installed Android/iOS build.

## Rate Limit

Moodle blocks repeated auto-login key generation for a configured time. The error looks like:

```text
Auto-login key generation is blocked. You need to wait X minutes between requests.
```

This is controlled in Moodle:

```text
Site administration > Mobile app > Mobile app authentication > Minimum time between auto-login requests
```

If a fallback is required, the app can catch this specific error and open the normal support URL without auto-login.

## Important Security Note

Do not pass the user's username/password in the URL or inject the password into the website. Use Moodle's auto-login key flow only.
