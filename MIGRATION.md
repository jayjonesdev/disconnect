# Migration & Changes — `@jayjonesdev/disconnect` (v2) vs original `disconnect` (v1.2.2)

This fork is a full TypeScript rewrite of [bartve/disconnect](https://github.com/bartve/disconnect)
that also adds Discogs API endpoints introduced since the original was last
maintained (Feb 2021).

The **runtime behaviour is backwards compatible** — callbacks and promises both
still work, and every original method keeps its signature. The changes below are
additive plus a few structural differences (imports, package layout, types).

---

## 1. New API methods

All new methods follow the existing convention: pass a `callback(err, data, rateLimit)`
for the callback style, or omit it to get a `Promise`.

### Database (`client.database()`)

| Method | HTTP | Description |
|---|---|---|
| `getCommunityReleaseRating(release)` | `GET /releases/{id}/rating` | Community average rating + vote count for a release (no username needed). |
| `getReleaseStats(release)` | `GET /releases/{id}/stats` | "Have" and "want" counts for a release. |

```ts
const db = client.database();

await db.getCommunityReleaseRating(249504);
// → { release_id: 249504, rating: { count: 47, average: 4.19 } }

await db.getReleaseStats(249504);
// → { num_have: 2315, num_want: 467 }
```

### Marketplace (`client.marketplace()`)

| Method | HTTP | Description |
|---|---|---|
| `getReleaseStatistics(release, currAbbr?)` | `GET /marketplace/release_statistics/{id}` | Community marketplace stats (lowest price, number for sale). No auth required. Optional currency. |

```ts
await client.marketplace().getReleaseStatistics(249504, 'EUR');
```

### User (`client.user()`)

| Method | HTTP | Description |
|---|---|---|
| `editProfile(username, data)` | `POST /users/{username}` | Update the authenticated user's profile (name, home page, location, profile text, currency). Auth level 2. |

```ts
await client.user().editProfile('my_user', { location: 'Berlin', curr_abbr: 'EUR' });
```

### Collection (`client.user().collection()`)

| Method | HTTP | Description |
|---|---|---|
| `getCustomFields(username)` | `GET /users/{username}/collection/fields` | List the custom fields defined in a user's collection. Auth level 2. |
| `editInstanceField(username, folder, release, instance, fieldId, value)` | `POST .../instances/{instance}/fields/{fieldId}` | Set a custom-field value on one collection instance. Auth level 2. |
| `getValue(username)` | `GET /users/{username}/collection/value` | Minimum / median / maximum collection value from Marketplace data. Auth level 2. |

```ts
const col = client.user().collection();

await col.getValue('my_user');
// → { minimum: '$120.00', median: '$300.00', maximum: '$500.00' }
```

### Inventory export (`client.inventoryExport()`) — new namespace

| Method | HTTP | Description |
|---|---|---|
| `export()` | `POST /inventory/export` | Trigger an inventory CSV export. |
| `getExports()` | `GET /inventory/export` | List recent exports. |
| `getExport(id)` | `GET /inventory/export/{id}` | Get a single export's status. |
| `download(id)` | `GET /inventory/export/{id}/download` | Download the CSV (raw, unqueued). |

### Inventory upload (`client.inventoryUpload()`) — new namespace

| Method | HTTP | Description |
|---|---|---|
| `add(data)` | `POST /inventory/upload/add` | Bulk-add items via CSV. |
| `change(data)` | `POST /inventory/upload/change` | Bulk-update items via CSV. |
| `delete(data)` | `POST /inventory/upload/delete` | Bulk-remove items via CSV. |
| `getUploads()` | `GET /inventory/upload` | List recent uploads. |
| `getUpload(id)` | `GET /inventory/upload/{id}` | Get a single upload's status. |

---

## 2. Updated method signatures

Backwards compatible — existing calls keep working; these just accept more.

| Method | Change |
|---|---|
| `database.getRelease(release, currAbbr?)` | Optional currency abbreviation (`'USD'`, `'EUR'`, …) → `?curr_abbr=`. The callback may still be passed as the 2nd argument. |
| `database.getMasterVersions(master, params?)` | `params` is now typed (`MasterVersionsParams`): `format`, `label`, `released`, `country` on top of pagination. |

```ts
await db.getRelease(249504, 'USD');   // with currency
await db.getRelease(249504);          // unchanged
await db.getRelease(249504, cb);      // callback still works as 2nd arg
```

---

## 3. Structural differences from the original

### Package name & install
- Published as **`@jayjonesdev/disconnect`** (the name `disconnect` is taken on npm by the original).
- `main` → `dist/index.js`, `types` → `dist/index.d.ts`. Ships compiled JS **plus `.d.ts` type declarations**.
- Requires **Node ≥ 18** (original: ≥ 0.12).

### Imports (this is the main breaking change)
The original used CommonJS with a deep `lib/` path. This fork exposes **named exports** and no longer ships a `lib/` folder.

| Original | This fork |
|---|---|
| `const { Client } = require('disconnect')` | `import { DiscogsClient } from '@jayjonesdev/disconnect'` |
| `const OAuth = require('disconnect/lib/oauth')` | `import { DiscogsOAuth } from '@jayjonesdev/disconnect'` |
| `require('disconnect').util` | `import { util } from '@jayjonesdev/disconnect'` |

A backwards-compatible default export is still provided:
```ts
import Discogs from '@jayjonesdev/disconnect';
const client = new Discogs.Client('agent/1.0');   // { Client, util }
```
> Note the **deep path `disconnect/lib/oauth` no longer exists** — use the `DiscogsOAuth` named export instead.

### Named exports available
`DiscogsClient`, `DiscogsOAuth`, `Queue`, `DiscogsError`, `AuthError`, `util`, plus all types.

### Exported TypeScript types
`Auth`, `AuthMethod`, `RateLimit`, `DiscogsCallback<T>`, `RequestOptions`, `ClientConfig`,
`QueueConfig`, `PaginationParams`, `CurrencyAbbr`, `CommunityRatingResponse`,
`ReleaseStatsResponse`, `CollectionValueResponse`, `EditProfileData`,
`MasterVersionsParams`, `SearchParams`.

### Error classes
`DiscogsError` and `AuthError` are now real ES classes extending `Error` (was prototype-based).
`instanceof` checks and `err.statusCode` work as before.

### Internal changes (no API impact)
- `querystring` replaced with the standard `URLSearchParams` (one fewer dependency).
- `Queue` gains sliding-window helpers `canCall()` / `recordCall()` for Discogs' moving-average
  rate limit, alongside the original fixed-window `add()` behaviour.
- OAuth signing supports **HMAC-SHA1** (via a wired-in `hash_function`) in addition to the
  default **PLAINTEXT**. The OAuth request-token and access-token exchanges both use `GET`,
  same as the original.

---

## 4. Not changed
- Every original method name and signature is preserved.
- The callback-or-Promise return convention is identical.
- Auth methods (`userToken`, `consumerKey`/`consumerSecret`, OAuth 1.0a) are unchanged.
- Rate-limit queueing and pagination behave the same by default.
