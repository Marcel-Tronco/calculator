# Calculator Endpoint
## Description

This express app provides an endpoint for calculation queries at /calculus and excepts get requests with query parameter "query" and a base64 encoded string attached to it (like `/calculus?query=Myoz` for 3*3.

It returns an JSON containing the information if there was some error in the request or on the server side (`{error: true, message "..."}`) or the result (`{error: false, result: 9}`)

Other features:
- CI/CD pipeline based on github actions, testing, linting and pushing to heroku if the tests where succesfull