# Calculator Endpoint
## Description

This express app provides an endpoint for calculation queries at /calculus and excepts get requests with query parameter "query" and a base64 encoded string attached to it (like `/calculus?query=Myoz` for 3*3.

It returns an JSON containing the information if there was some error in the request or on the server side (`{error: true, message "..."}`) or the result (`{error: false, result: 9}`)

Other features:
- CI/CD pipeline based on github actions, testing, linting and pushing to heroku if the tests where succesfull
- Error Handling: other endpoints and wrong parametes and input will result in the mentioned JSON format 

## Usage

Chain a calculation. Only Integers are accepted. Whitespaces may occur. Supported operators: * / + - ( )
You can use (multiple) signs, where they are not against mathematical rules.