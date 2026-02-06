# Tech Stack
- Express
- Prisma
- PostgreSQL
- BetterAuth

# How to run?
1. Install dependencies: `npm install`
2. Create a `.env` file with your `DATABASE_URL` and `BETTER_AUTH_SECRET`
3. Push the database schema: `npx prisma db push`
4. Generate the Prisma client: `npx prisma generate`
5. Start the dev server: `npm run dev`