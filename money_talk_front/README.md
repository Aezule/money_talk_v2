# money_talk_front

Front minimaliste (Vite + React + TS) pour l'API décrite dans `../money_talk_api_go/openapi.yaml`.

```sh
npm install
npm run mock:api      
npm run dev           
API_URL=http://localhost:8080 npm run dev   
```

Les types de l'API sont générés depuis l'OpenAPI : `npm run gen:api` (→ `src/api/schema.d.ts`).

## Lint & commits

- `npm run lint` / `npm run lint:fix` (ESLint + typescript-eslint + react-hooks)
- Husky (installé par `npm install`) :
  - `pre-commit` : lance `npm run lint`
  - `commit-msg` : vérifie le format [Conventional Commits](https://www.conventionalcommits.org/) via commitlint, ex. `feat(front): ajout du formulaire`

## Tests

| Commande | Contenu |
|---|---|
| `npm run test:unit` | `tests/unit` – logique montants, client HTTP (fetch mocké), formulaire |
| `npm run test:integration` | `tests/integration` – `App` complète contre un backend MSW en mémoire |
| `npm run test:e2e` | `tests/e2e` – Playwright + Vite + mock Prism (1re fois : `npx playwright install chromium`) |
| `npm test` | unit + intégration |
