# FoodSave AI

FoodSave AI is a research-oriented web prototype that estimates the risk of household food waste from everyday food and storage information. I built it to explore how a simple, explainable prediction experience can help people decide what to use, freeze, or monitor before food is wasted.

The application is intentionally transparent: it uses synthetic data and a local risk-scoring model for demonstration. It does not connect to a production database, external AI service, or live food-safety data source.

## Features

- Collects food type, storage method, quantity, days since purchase, temperature, household size, and previous waste rate.
- Calculates a food-waste risk score from 3 to 99.
- Classifies the score as Low, Medium, or High risk.
- Provides an action recommendation based on the risk level.
- Lets users edit the inputs and run the prediction again.
- Explains the main signals used in the prediction.
- Uses responsive, accessible UI patterns for desktop and mobile layouts.
- Clearly labels the experience as a research prototype using synthetic data.

## How to use the application

### Run locally

1. Install Node.js 20 or newer.
2. Install the project dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Make a prediction

1. Choose a food category, such as Fruit, Vegetables, Dairy, Meat & seafood, or Grains & bakery.
2. Select where the food is stored: Refrigerator, Freezer, Pantry, or Countertop.
3. Enter the approximate quantity in kilograms.
4. Enter how many days have passed since the food was purchased.
5. Enter the storage temperature in degrees Celsius.
6. Enter the number of people in the household.
7. Enter the household's previous waste rate as a percentage.
8. Select **Predict waste risk**.
9. Review the score, risk category, and recommended action.
10. Select **Edit details** to return to the form and try another scenario.

The default values provide an example scenario and can be changed before submitting. The prediction is calculated immediately in the browser, so no personal information or form data is sent to a server.

## Machine-learning approach

The current prototype implements an **interpretable weighted risk-scoring algorithm**, rather than a trained machine-learning model. This is intentional for the research prototype: every prediction can be inspected and explained without hiding the result behind a black-box model.

The score is produced from these signals:

- Days since purchase: increases the risk as food remains unused for longer.
- Storage temperature: increases risk at warmer temperatures.
- Quantity per person: increases risk when there is more food relative to household size.
- Previous waste rate: uses the household's past waste percentage as a behavioral signal.
- Storage method: applies a method-specific adjustment. Freezer storage reduces the score, while pantry and countertop storage add smaller penalties.
- Household size: normalizes quantity into an approximate per-person amount.

Conceptually, the implementation follows this form:

```text
perPersonQuantity = quantity / householdSize

risk = 19
     + (daysSincePurchase * 8)
     + (temperature * 1.5)
     + (perPersonQuantity * 7)
     + (previousWasteRate * 0.45)
     + storageAdjustment
```

The resulting value is rounded and bounded between 3 and 99. The interpretation thresholds are:

- **Low risk:** score below 38
- **Medium risk:** score from 38 through 64
- **High risk:** score 65 or above

This is best described as a rule-based baseline or heuristic model. It is not trained with labeled historical observations, and it does not claim statistical accuracy. A future production version could replace this baseline with a supervised classifier or regression model trained on verified household food-waste records, while retaining the current score explanation and safety constraints.

## Technology stack

### Frontend

- **Next.js 16** with the App Router
- **React 19** for the interactive user interface
- **TypeScript** for typed component and form logic
- **Tailwind CSS 4** for responsive styling and design tokens
- **Lucide React** for interface icons
- **CSS utilities from `tw-animate-css`** for animation support

### Application structure

- `app/page.tsx` contains the interactive prediction experience.
- `app/layout.tsx` defines the root layout, metadata, fonts, and document structure.
- `app/globals.css` contains the global theme, semantic color tokens, typography setup, and risk-state styling.
- `public/` is available for static assets.

The form is implemented as a client component because it needs React state for field updates, live score calculation, submission state, and resetting the result. The score is derived with React's `useMemo` so it updates consistently from the current form state.

## Project scripts

```bash
npm run dev    # Start the development server
npm run build  # Create a production build
npm run start  # Start the production server after building
```

## Design and accessibility decisions

- The interface uses a focused two-column workflow: inputs on the left and the prediction result on the right.
- The main action is visually prominent without relying on decorative gradients or unnecessary dashboard elements.
- Result changes are announced through an `aria-live` region.
- Decorative icons are hidden from assistive technology with `aria-hidden` where appropriate.
- Form controls have visible labels and keyboard-focus styles.
- The layout collapses into a single-column mobile experience.
- Color is paired with text labels such as Low, Medium, and High so the result is not communicated by color alone.

## Limitations

This version is a prototype and should not be used as a food-safety authority. The score estimates waste likelihood, not whether food is safe to eat. The algorithm uses synthetic assumptions and has not been validated against a real-world dataset. It also does not account for food-specific expiration guidance, packaging, humidity, preparation state, or local health recommendations.

## Future improvements

- Collect and validate a privacy-conscious dataset of food-waste events.
- Train and evaluate a supervised model against the heuristic baseline.
- Add food-specific freshness rules from reliable food-safety sources.
- Include confidence ranges and model evaluation metrics.
- Add user accounts and saved household scenarios.
- Add historical charts showing waste risk and avoided waste over time.
- Add server-side persistence only after the data model and privacy requirements are defined.

## License

This project is currently a personal research prototype. Add a license before distributing it as an open-source project.
