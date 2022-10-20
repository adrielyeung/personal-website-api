# personal-website-api
Backend Express.js API to use with my personal website, connected to Mongo DB.

## Authentication
Uses JSON Web Token (JWT) for authentication. Connects to user DB.

### Endpoints
#### POST /user/register
Registers a user with name, email, role (admin / normal = read-only), and password.

#### POST /user/login
Logins a user with name + password. Returns a JWT on success. 

## Music data
Stores all the music video data (Instagram post ID, Youtube ID, create date).
Requires a JWT in request header 'Authorization' in format of 'JWT \<JSON Web Token\>'.
Connects to music DB.
For GET calls, all roles are allowed.
For other calls, only admin roles allowed.

### Public Endpoints
#### GET /music
Returns all music items.

#### GET /music/:id
Returns a music item with Mongo DB id specified.

#### GET /music/name/:name
Returns a music item with name specified.

#### GET /music/ig/:instagramId
Returns a music item with Instagram ID specified.

### Admin Only Endpoints
#### POST /music
Creates a music item with name, createDate, youtubeEmbedId and instagramId fields.
All fields are required.
If createDate is not specified, default date is today.

#### PUT /music/:id
Updates a music item (name, youtubeEmbedId and instagramId fields) with Mongo DB id specified.
All fields are required.

#### PATCH /music/:id
Updates a music item (name, youtubeEmbedId or instagramId fields) with Mongo DB id specified.
May specify 1-3 fields.

#### DELETE /music
Deletes a music item with Mongo DB id specified.
