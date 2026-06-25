## About

`disconnect` is a [Node.js](http://www.nodejs.org) client library that connects with the [Discogs.com API v2.0](http://www.discogs.com/developers/).

> **This is a TypeScript port** of the original [bartve/disconnect](https://github.com/bartve/disconnect). The whole library has been rewritten in TypeScript and ships full type declarations, and the API surface has been brought up to date with endpoints Discogs added since the original was last maintained (Feb 2021). The runtime API is backwards compatible: callbacks and promises both still work.

## Features

  * Covers all API endpoints
  * Written in TypeScript — ships `.d.ts` declarations for full editor/type support
  * Supports [pagination](http://www.discogs.com/developers/#page:home,header:home-pagination), [rate limiting](http://www.discogs.com/developers/#page:home,header:home-rate-limiting), etc.
  * All database, marketplace and user functions implement a standard `function(err, data, rateLimit)` format for the callback or return a 
    native JS [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) when no callback is provided
  * Easy access to protected endpoints with `Discogs Auth`
  * Includes OAuth 1.0a tools. Just plug in your consumer key and secret and do the OAuth dance
  * API functions grouped in their own namespace for easy access and isolation

## What's new in this port

  * Full TypeScript rewrite with exported types (`DiscogsCallback`, `RequestOptions`, `CurrencyAbbr`, response shapes, etc.)
  * `database.getCommunityReleaseRating(release)` — community average rating + count (`GET /releases/{id}/rating`)
  * `database.getReleaseStats(release)` — have/want counts (`GET /releases/{id}/stats`)
  * `database.getRelease(release, currAbbr?)` — optional marketplace currency
  * `database.getMasterVersions(master, params?)` — typed filter params (format, label, released, country)
  * `marketplace.getReleaseStatistics(release, currAbbr?)` — community marketplace stats
  * `user.editProfile(username, data)` — update the authenticated user's profile
  * `collection.getCustomFields(username)`, `collection.editInstanceField(...)`, `collection.getValue(username)`
  * `inventoryExport()` namespace — request/list/get/download inventory exports
  * `inventoryUpload()` namespace — add/change/delete via CSV upload, list/get uploads
  * OAuth access-token exchange now uses `POST` (per current Discogs docs); HMAC-SHA1 signing wired in
  * `Queue` gains sliding-window helpers (`canCall()` / `recordCall()`) for the moving-average rate limit

## Installation

This port is distributed as source. Clone it, install dependencies and build:

```bash
git clone https://github.com/jayjonesdev/disconnect.git
cd disconnect
npm install
npm run build   # compiles src/ -> dist/
npm test        # run the test suite
```

The compiled entry point is `dist/index.js` with type declarations in `dist/index.d.ts`.

## Structure
The global structure of `disconnect` looks as follows:
```
require('disconnect') -> new Client() -> oauth()
                                      -> database()
                                      -> marketplace()
                                      -> user() -> collection()
                                                -> wantlist()
                                                -> list()
                                      -> inventoryExport()
                                      -> inventoryUpload()
                      -> util
```

## Usage

### Quick start
Here are some basic usage examples that connect with the public API. Error handling has been left out for demonstrational purposes.

#### Init

```javascript
var Discogs = require('disconnect').Client;
```

In TypeScript / ESM you can use named imports and the exported types:

```typescript
import { DiscogsClient, type ReleaseStatsResponse } from 'disconnect';

const db = new DiscogsClient().database();
const stats = await db.getReleaseStats<ReleaseStatsResponse>(176126);
console.log(stats.num_have, stats.num_want);
```
#### Go!

Get the release data for a release with the id 176126.
```javascript
var db = new Discogs().database();
db.getRelease(176126, function(err, data){
	console.log(data);
});
```

Set your own custom [User-Agent](http://www.discogs.com/developers/#page:home,header:home-general-information). This is optional as when omitted `disconnect` will set a default one with the value `DisConnectClient/x.x.x` where `x.x.x` is the installed version of `disconnect`.
```javascript
var dis = new Discogs('MyUserAgent/1.0');
```

Get page 2 of USER_NAME's public collection showing 75 releases.
The second param is the collection folder ID where 0 is always the "All" folder.
```javascript
var col = new Discogs().user().collection();
col.getReleases('USER_NAME', 0, {page: 2, per_page: 75}, function(err, data){
	console.log(data);
});
```

### Promises
When no callback is provided, the API functions return a native JS [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) for easy chaining.

```javascript
var db = new Discogs().database();
db.getRelease(1)
	.then(function(release){ 
		return db.getArtist(release.artists[0].id);
	})
	.then(function(artist){
		console.log(artist.name);
	});
```

### Output format
User, artist and label profiles can be formatted in different ways: `plaintext`, `html` and `discogs`. `disconnect` defaults to `discogs`, but the output format can be set for each client instance.
```javascript
// Set the output format to HTML
var dis = new Discogs().setConfig({outputFormat: 'html'});
```

### Discogs Auth
Just provide the client constructor with your preferred way of [authentication](http://www.discogs.com/developers/#page:authentication).
```javascript
// Authenticate by user token
var dis = new Discogs({userToken: 'YOUR_USER_TOKEN'});

// Authenticate by consumer key and secret
var dis = new Discogs({
	consumerKey: 'YOUR_CONSUMER_KEY', 
	consumerSecret: 'YOUR_CONSUMER_SECRET'
});
```

The User-Agent can still be passed for authenticated calls.
```javascript
var dis = new Discogs('MyUserAgent/1.0', {userToken: 'YOUR_USER_TOKEN'});
```

### OAuth
Below are the steps that involve getting a valid OAuth access token from Discogs. Note that in the following examples the `app` variable is an [Express instance](http://expressjs.com/starter/hello-world.html) to handle incoming HTTP requests.

#### 1. Get a request token
```javascript
app.get('/authorize', function(req, res){
	var oAuth = new Discogs().oauth();
	oAuth.getRequestToken(
		'YOUR_CONSUMER_KEY', 
		'YOUR_CONSUMER_SECRET', 
		'http://your-script-url/callback', 
		function(err, requestData){
			// Persist "requestData" here so that the callback handler can 
			// access it later after returning from the authorize url
			res.redirect(requestData.authorizeUrl);
		}
	);
});
```

#### 2. Authorize
After redirection to the Discogs authorize URL in step 1, authorize the application.

#### 3. Get an access token
```javascript
app.get('/callback', function(req, res){
	var oAuth = new Discogs(requestData).oauth();
	oAuth.getAccessToken(
		req.query.oauth_verifier, // Verification code sent back by Discogs
		function(err, accessData){
			// Persist "accessData" here for following OAuth calls 
			res.send('Received access token!');
		}
	);
});
```

#### 4. Make OAuth calls
Simply provide the constructor with the `accessData` object persisted in step 3.
```javascript
app.get('/identity', function(req, res){
	var dis = new Discogs(accessData);
	dis.getIdentity(function(err, data){
		res.send(data);
	});
});
```

### Images
Image requests themselves don't require authentication, but obtaining the image URLs through, for example, release data does.
```javascript
var db = new Discogs(accessData).database();
db.getRelease(176126, function(err, data){
	var url = data.images[0].resource_url;
	db.getImage(url, function(err, data, rateLimit){
		// Data contains the raw binary image data
		require('fs').writeFile('/tmp/image.jpg', data, 'binary', function(err){
			console.log('Image saved!');
		});
	});
});
```

## Resources

  * [Discogs API documentation](http://www.discogs.com/developers/)
  * [The OAuth Bible](http://oauthbible.com/)

## License

MIT