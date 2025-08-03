# Testing

This document describes how to run tests in the XMRChat project.
Tests are using [Playwright](https://playwright.dev/) and run from client directory.

## Setup tests

To setup tests the server needs to be running with `TEST_ENV` variable set to `true`. It adds the TestModule for creating a user and page for making tips in tests.
You need to pass the url of running client application to `TEST_BASE_URL` ( for example http://localhost:3002 ) env in client when running tests. It is used in `playwright.config.ts` file as base url for navigation.

## Running tests

**Locally**
You can run tests locally while the both server and client are running.

```bash
cd client
# Make sure you have TEST_BASE_URL then run:
npx playwright test
```

**Github actions**

The test.yml workflow file runs the tests in a server.
It needs setting `SERVER_HOST` and `SERVER_USERNAME` and `SERVER_PASSWORD` secrets in repository secrets and also changing the wokrflow file to run the tests from where you have XMRChat.
