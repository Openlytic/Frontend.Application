# Openlytic.Frontend.App.Organization

Next.js 15 (+ React 19) web app for Openlytic — the email-tracking SaaS frontend, redesigned
around the Openlytic brand (indigo/violet) and ported to the real Openlytic backend surface.

## Stack

- Next.js 15 (App Router), React 19
- Ant Design 5 (theme tokens in `lib/theme.js`; `@ant-design/v5-patch-for-react-19`)
- Apollo Client 3 (GraphQL reads against `NEXT_PUBLIC_API_URL/graphql`)
- Redux Toolkit (auth slice)
- Tailwind CSS + Poppins font
- Axios (REST auth/org calls in `helpers/restApiRequests.js`)
- `middleware.js` — route protection (reads `accessToken` cookie) + public path list

## Routes

| Route                       | Auth    | Purpose                                            |
| --------------------------- | ------- | -------------------------------------------------- |
| `/login`                    | public  | Sign in (REST `POST /auth/login`)                  |
| `/signup`                   | public  | Pre-register + verify email                        |
| `/account-verification`     | public  | OTP entry (signup verify or forgot-password code)  |
| `/create-account`           | public  | Onboarding: profile + workspace + org creation     |
| `/forgot-password`          | public  | Request reset code (`POST /auth/forgot-password`)  |
| `/create-new-password`      | public  | Set new password after code verification           |
| `/`                         | private | Dashboard (real stats from `getEmailAnalytics`)    |
| `/emails`                   | private | Sent email list (`getEmails`)                      |
| `/emails/[id]`              | private | Email detail: analytic, tracked links, event log   |
| `/analytics`                | private | Analytics hub (under construction)                 |
| `/settings`                 | private | Workspace settings (under construction)            |
| `/my-profile`               | private | Profile (under construction)                       |

## Design

Brand system lives in `lib/theme.js` (single source of truth) and flows to:

- `app/globals.css` CSS variables + Tailwind theme (`tailwind.config.js`)
- antd `ConfigProvider` theme (`components/core/AntdThemeProvider.jsx`)
- `components/core/OpenlyticLogo.jsx` (brand mark + wordmark)

Layout shell is a custom Tailwind rail (`components/layout/Sidebar.jsx`) + topbar
(`components/layout/Topbar.jsx`) assembled in `components/layout/PrivateLayout.jsx`.
Auth screens use the split-panel `components/auth/AuthShell.jsx`.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
```

Requires the API server on `http://localhost:8000` (see `Openlytic.Backend.API.Server`)
and the email consumer on `:9000` (tracking base) / `:3001` (dev webhook).

## Env

Copy `.env.sample` → `.env.local` and point `NEXT_PUBLIC_API_URL` at the API server,
`NEXT_PUBLIC_TRACKING_URL` at the email service tracking base.