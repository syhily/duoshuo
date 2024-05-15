# Request Path Pattern

This is a CSR project and serving public API requests for any blogger systems.
We have to divide the requests into different categories and give them uniform request patterns.
This can simplify the user's privilege design and have a better access control pattern.

## Request Categories

All the requests are divided into two main types. The web page requests and the API requests.
All the API requests match the regex pattern `/api/.+`, while other requests are all the web pages.

The API requests can be divided into two main types. The public APIs and the APIs which need a valid privilege.
The APIs which require a valid privilege is called [authentication and authority workflow](./authentication-and-authority.md).
All the APIs in this category match the regex pattern `/api/admin/.+`.

Other APIs that didn't match the previous pattern are called public APIs. It can be accessed anonymously.
For privacy consideration, we don't use cookies and other things to track the user when accessing the public APIs.
But we will record the UA and the IP for security consideration, for instance, ratelimit for all the public APIs.

The privilege (for authenticated login user) can be two types, the normal user and the administrator.
But we don't divide the API for different privileges through the request path.
Instead, we configured the privilege for APIs one by one.
The uses with different privileges may share some APIs by default.
But they will get different response by the privileges they belong to.

## The 404 Requests

DuoShuo is a CSR application.
That means all the requests that didn't match the backend API paths will be fall back to the frontend index page.
The [TanStack Router](https://tanstack.com/router) will read the request path and display the related web page if it exists.

If user requests a 404 page. The user will get the `index.html` as the response.
The TanStack Router will automatically display a 404 page.
