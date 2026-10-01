# Buggy Cars Rating Playwright Tests

TypeScript end-to-end tests for the public [Buggy Cars Rating](https://buggy.justtestit.org/) practice application. The suite covers login, session/logout behavior, and registration-form UI. Scenarios are identified by the manual test case IDs `TC-002` through `TC-029`.

## Manual Testing

Manual test cases and results are tracked in the [manual testing Google Sheet](https://docs.google.com/spreadsheets/d/1aZ7977LHdiNC6ZeHVLgLp3JD3vC7L_BGbRAbtHt11tQ/edit?gid=647998131#gid=647998131).

## Automated Coverage

| Test cases | Coverage | Test file |
|---|---|---|
| TC-002 to TC-004 | Navbar login controls, accessible field names, and hover colors | [tests/login.spec.ts](tests/login.spec.ts) |
| TC-005 to TC-008 | Email-like username validation | [tests/login.spec.ts](tests/login.spec.ts) |
| TC-009 to TC-014 | Username normalization and password behavior | [tests/login.spec.ts](tests/login.spec.ts) |
| TC-015 to TC-020 | Required fields, valid login, and invalid-login responses | [tests/login.spec.ts](tests/login.spec.ts) |
| TC-021 to TC-027 | Cookies, refresh/context persistence, and logout flows | [tests/login.spec.ts](tests/login.spec.ts) |
| TC-028 to TC-029 | Registration labels and Register button visual states | [tests/register.spec.ts](tests/register.spec.ts) |

## Confirmed Bugs

Known defects are asserted as expected behavior and marked with Playwright's `test.fail()`. Such tests appear as passing while the defect remains; if the assertion unexpectedly passes after a fix, Playwright reports it as an unexpected pass.

| ID | Observed defect | Test |
|---|---|---|
| BUG-06 | Login accepts malformed email-like usernames without field validation | TC-005 to TC-008, [bug report](bug-reports/BUG-06.md) |
| BUG-07 | Navbar password input has no accessible name or placeholder | TC-003, [bug report](bug-reports/BUG-07.md) |
| BUG-08 | Enabled Register button has no hover visual state | TC-029, [bug report](bug-reports/BUG-08.md) |
| BUG-09 | Login rejects usernames with leading or trailing spaces | TC-009, [bug report](bug-reports/BUG-09.md) |
| BUG-10 | Successful login does not create a session cookie | TC-021 and TC-025, [bug report](bug-reports/BUG-10.md) |
| BUG-11 | Logout from Overall Rating leaves the user logged in | TC-027, [bug report](bug-reports/BUG-11.md) |
| BUG-12 | Login rejects uppercase usernames | TC-010, [bug report](bug-reports/BUG-12.md) |

The live navbar password field has no show-password eye control. The current automated suite does not test a show-password control. Bug reports note that screenshots could not be captured because the browser screenshot tools timed out waiting for page fonts.

## Stack and Structure

- Playwright Test with TypeScript (`@playwright/test`)
- `dotenv` loads local credentials from `.env` through `playwright.config.ts`
- Playwright MCP configuration for agent-driven browser exploration

```text
.
├── .env.examples                 # Credential template; copy to .env
├── .github/copilot-instructions.md
├── .vscode/mcp.json               # Playwright MCP server configuration
├── bug-reports/                   # Confirmed BUG-XX reports
├── tests/
│   ├── example.spec.ts            # Playwright documentation smoke tests
│   ├── login.spec.ts              # TC-002 through TC-027
│   └── register.spec.ts           # TC-028 and TC-029
├── package.json
├── package-lock.json
├── playwright.config.ts
└── README.MD
```

Playwright's generated HTML report is written to `playwright-report/`; test artifacts are written to `test-results/`. Both output directories are ignored by Git.

## Setup

Requirements: Node.js and npm.

```bash
git clone https://github.com/faiyaz029/sqa_Manual_and_auto_test_BuggyCarsRating.git
cd sqa_Manual_and_auto_test_BuggyCarsRating
npm ci
npx playwright install
cp .env.examples .env
```

Set `BUGGY_USER` and `BUGGY_PASS` in `.env` to a valid account. The credential-dependent tests skip when credentials are missing or do not authenticate. TC-010 also needs a lowercase username, and TC-011 needs a password containing a special character. `.env.examples` includes optional `BUGGY_USER2` and `BUGGY_PASS2` values, but the current tests do not use a second account. `.env` is ignored by Git; never commit real credentials.

## Run Tests

The Playwright configuration defines Chromium, Firefox, and WebKit projects. There are no custom npm scripts; run the tests with `npx`:

```bash
npx playwright test                              # all tests in all three projects
npx playwright test tests/login.spec.ts          # login cases in all three projects
npx playwright test --project=chromium           # Chromium only
npx playwright test --project=firefox            # Firefox only
npx playwright test --project=webkit             # WebKit only
npx playwright test --ui                         # interactive UI mode
npx playwright test --debug                       # step-through debugging
npx playwright show-report                        # open the HTML report
```

## MCP Exploration

The repository instructions in `.github/copilot-instructions.md` require exploring each scenario with Playwright MCP and observing real page locators and behavior before generating a test. The MCP server is configured in `.vscode/mcp.json`. Review generated tests to ensure each assertion matches the intended behavior and each confirmed defect has a corresponding report.

## Disclaimer

Buggy Cars Rating is a public practice application for testers. This project is for learning and portfolio use.
