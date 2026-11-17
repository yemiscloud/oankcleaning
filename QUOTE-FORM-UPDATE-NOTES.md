# OANK Cleaning – Quote Form Update

## Changes made

1. Added a selectable **Living room/dining room – £25** option to the quote form. It is optional and is recorded as a separate selection.
2. Added **Will you be supplying cleaning materials/equipment?** with Yes/No choices. Selecting Yes records a **10% discount** for the OANK team to apply to the confirmed quote.
3. Updated the React quote form data type and request payload.
4. Updated `api/quote.php` to validate/normalise both selections, include them in the saved enquiry details and admin notification, and return them in the API response.
5. Updated `api/database.php` to save both values in dedicated database columns.
6. Updated `schema.sql` and added `migrations/2026-11-15-quote-room-materials-discount.sql`.

## Important pricing behaviour

The current quote endpoint deliberately does not calculate a final total: the team confirms the final price after reviewing the scope. The £25 room selection is therefore recorded as an explicit add-on, and the 10% discount rate is recorded and clearly shown to the customer/team; the final confirmed quote must include the add-on and apply the discount. No invented subtotal or final estimate is displayed.

## Deployment instruction

**Run the SQL migration once on the live MySQL database before deploying the updated PHP files.** Then deploy the updated frontend and PHP API together. Existing rows remain valid because both new columns have defaults.

## Verification

PHP syntax checks and ZIP integrity checks should be run before production deployment. A full production build and live database/email test require the hosting environment and its installed dependencies.
