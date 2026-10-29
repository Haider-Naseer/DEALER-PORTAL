# Honda Dealer Portal

A static Next.js dealer dashboard for sales, service income, and FBR entry tracking. All transaction data is stored in the browser's local storage; there is no backend.

## Run locally

```bash
npm install
npm run dev
```

Demo sign-in:

- Email: `admin@gmail.com`
- Password: `admin`

## Static deployment

Run `npm run build` to generate the static site in `out/`. Deploy that folder to any static web host.

The demo sign-in is client-side only and is not suitable for protecting sensitive data or production access. Each browser stores its own transaction list.
