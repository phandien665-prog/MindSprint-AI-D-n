# Seed startup checks

Run `dotnet run --project backend/SeedChecks/SeedChecks.csproj -c Release`.

The console check loads the real vocabulary seed into an isolated in-memory
SQLite database using the production `DataSeeder`. It verifies a clean database
can seed repeated ExternalIds once, that seeding again is idempotent, and that
personal cards/accounts are preserved. It does not connect to PostgreSQL or
modify local application data.

The original seed has 1021 rows and 955 unique ExternalIds. Inserting all rows
caused startup to fail with PostgreSQL `23505` after migrations, even with a
valid connection string. Keep the unique index and upsert each ExternalId once.
