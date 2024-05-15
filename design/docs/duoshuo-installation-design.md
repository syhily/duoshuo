# DuoShuo Installation

Given that the duoshuo is a prebuilt docker image with the minial configurations from environment variables for the Postgres database.
We are here to design the workflow
for creating the default administrator account to get everything works as expected
after the duoshuo container has been started successfully with a valid database.

## Initial Default Admin Account

```text
          ┌─────────────────────────────────────────────────┐
          │                                                 │
┌─────────▼──────────┐            ┌──────────────────────┐  │
│                    │            │                      │  │
│ All Page Requests  │      ┌─────►Redirect Register Page│  │
│                    │      │     │                      │  │
└─────────┬──────────┘      │     └──────────┬───────────┘  │
          │                 │                │              │
          │ Filter          │                │ POST         │
          │                 │                │              │
┌─────────▼──────────┐      │     ┌──────────▼──────────┐   │
│                    │      │     │                     │   │
│ Request Interceptor│      │     │  Bypass Admin API   │   │
│                    │      │     │                     │   │
└─────────┬──────────┘      │     └──────────┬──────────┘   │
          │                 │                │              │
          │ Assert          │                │ Success      │
          │                 │                │              │
┌─────────▼──────────┐      │     ┌──────────▼──────────┐   │
│                    │ No   │     │                     │   │
│ Has Admin Account  ├──────┘     │ Redirect Login Page │   │
│                    │            │                     │   │
└─────────┬──────────┘            └──────────┬──────────┘   │
          │                                  │ Access       │
          │ Yes                              └──────────────┘
          │
┌─────────▼──────────┐
│                    │
│  Next Interceptor  │
│                    │
└────────────────────┘
```

The default admin account creation is a hono middleware which will check the account information.
This middleware only checks the requests which aren't start with `/api/*` for performance consideration.
When the user accesses any web page which isn't an API request.
He or she will be redirected to the account register page by default.
The first registered account will be treated as the admin account by default.

Given that, the fresh installation will not have any checks like Email verification.
This creation flow keeps as simple as possible.
After the account has been created successfully. The user will be redirected to the login page by default.
