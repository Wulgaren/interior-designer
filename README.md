# Homiq

Mobile-first planer pomieszczeń wnętrz (PL). Budujesz proste pokoje w skali, zapisujesz je lokalnie, a aplikację możesz dodać do ekranu głównego jako PWA.

Plan produktu i podział na zadania: [docs/HOMIQ_PLAN.md](docs/HOMIQ_PLAN.md).

## Stack

Next.js (App Router) · TypeScript · Tailwind · Serwist (PWA) · React Three Fiber · Zustand · IndexedDB (`idb`)

## Start lokalnie

```bash
npm install
npm run dev
```

Dev używa webpacka (`next dev --webpack`), bo Serwist wymaga webpack w Next 16.

Produkcyjny build (webpack, wymagany przez Serwist):

```bash
npm run build
npm start
```

Na razie nie ma zmiennych środowiskowych ani sekretów.

## Deploy (Vercel)

1. Podłącz repozytorium do Vercel.
2. Framework: Next.js (domyślne ustawienia wystarczą).
3. HTTPS jest wymagane do service workera i instalacji PWA.

Preview per PR i produkcja z `main` działają jak zwykły Next.js.

## Instalacja PWA

Po wdrożeniu na HTTPS (lub lokalnie z `npm start` po buildzie):

**Android (Chrome).** Menu przeglądarki → „Zainstaluj aplikację” / „Dodaj do ekranu głównego”.

**iOS (Safari).** Przycisk Udostępnij → „Dodaj do ekranu początkowego”.

W development (`npm run dev`) service worker jest wyłączony. Testuj instalację i offline na buildzie produkcyjnym albo na Vercel.

## Offline

Serwist cache’uje shell aplikacji. Strona `/~offline` pokazuje się, gdy nawigacja nie ma sieci. Pomieszczenia zapisują się w IndexedDB na urządzeniu (baza `homiq`, store `rooms`) — działają bez konta i bez backendu.

## Model danych (faza 1)

```ts
type Room = {
  id: string
  name: string
  lengthCm: number // oś X w 3D
  widthCm: number  // oś Z w 3D
  heightCm: number // oś Y w 3D
  createdAt: string
  updatedAt: string
}
```

Walidacja: nazwa niepusta; każdy wymiar 50–2000 cm. Domyślne nowe pomieszczenie: 400 × 300 × 270 cm.

## Konwencja 3D

UI zawsze w centymetrach. W scenie Three.js **1 unit = 1 cm**. Podłoga na `y = 0`, pomieszczenie wyśrodkowane w początku układu.

## Ekrany

- `/` — start Homiq
- `/pomieszczenia` — lista (CRUD lokalny)
- `/pomieszczenia/[id]` — formularz + tryb Podgląd / Wymiary + canvas 3D
