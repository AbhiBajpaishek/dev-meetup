# DevMeetup APIs

## Auth
 - POST /signup
 - POST /login
 - POSt /logout

## User
 - GET /user/feed
 - GET /user/requests
 - GET /user/connections

## Profile
 - GET /profile/:userId
 - PATCH /profile/:userId
 - PATCH /profile/password/
 - DELETE /profile/:userId

## Connections
 - POST /connection/interested
 - POST /connection/ignored
 - POST /connection/accepted
 - POST /connection/rejected