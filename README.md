# chat-app

A small chat UI- Sends and displays messages from all participants

## Tech stack

- **Next.js 16** (App Router, Turbopack, React Server Components for the initial render)
- **React 19** + **TypeScript 5**
- **TanStack Query 5** for fetching, polling, and optimistic mutation
- **Tailwind CSS 4**

## Prerequisites

1. Node.js (any version compatible with Next 16; Node 20 LTS works).
2. The chat backend running locally

## Setup

```bash
npm install
cp .env.example .env.local
```

Then edit `.env.local` and update the variables.

> **Note on `NEXT_PUBLIC_*`:** these are inlined into the browser bundle. That is for demo purpose, but in a real product the token would never be shipped to the client — the Next.js app would proxy requests through a server route that injects the token from a non-public secret.

## Run

```bash
npm run dev      # http://localhost:3005
npm run build    # production build + type-check
npm run start    # serve the production build
npm run lint     # ESLint
```

## Architecture notes

```
src/
  app/
    _components/
      ChatContainer.tsx     # loading / error / empty / list orchestration
      MessageList.tsx       # message bubbles + auto-scroll-to-bottom
      SendMessage.tsx       # composer + optimistic useMutation
      GeneralProvider.tsx   # wraps the app in QueryClientProvider
    page.tsx                # RSC: prefetches messages, renders <main>
    layout.tsx              # html/body, skip link, fonts
    globals.css             # tokens, sr-only / skip-link, doodle bg
  lib/
    services/
      api.service.ts        # base fetch wrapper (Bearer auth, error mapping)
      api-message.service.ts# getMessages / createMessage + query/mutation options
      ApiRequestError.ts
    queryClient.ts          # SSR-safe singleton QueryClient
    types.ts                # Message, GetMessagesParams, CreateMessageBody
    constants.ts            # API_URL, SELF_AUTHOR
    helper.ts               # formatTimestamp
```

### Data layer

- The messages query is **prefetched on the server** in [`src/app/page.tsx`](src/app/page.tsx) so the first paint already has data; the client then takes over via TanStack's hydration.
- `createMessageMutation(queryClient)` is **optimistic**: it cancels in-flight refetches, snapshots all `["messages", "list", …]` cache entries, **appends** a `temp-…` message (the API returns oldest-first, so the new bubble belongs at the end), reverts on error, and invalidates the prefix on settle so any future paginated keys reconcile.

### Live updates

- `refetchInterval: 5000` polls every 5 s while the tab is visible.
- `refetchOnWindowFocus: true` (in [`src/lib/queryClient.ts`](src/lib/queryClient.ts)) catches messages sent while the tab was inactive.

### "Self" vs "others"

`SELF_AUTHOR = "You"` is hard-coded in [`src/lib/constants.ts`](src/lib/constants.ts). Since the app doesn't include any auth/identity:

- Newly sent messages render as the yellow self-bubble (right-aligned, no author label) because the optimistic insert uses `author: "You"`.
- After a refetch they still come back from the server with `author: "You"`, so they continue to render as self.
- If multiple users opened the app, they'd all appear as "You" to each other. This is a known limitation of the demo, not a bug.

## Things deliberately not implemented

- **Pagination UI.** The service supports `after` / `before` / `limit`, but no "Load older" affordance is wired up — an obvious next step.
- **Real authentication.** See "Self vs others" above.
- **Cancelling in-flight POSTs.** `createMessage` keeps a `signal?` parameter for a future cancel-send flow, but no caller currently provides one.
