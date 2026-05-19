# Lockdownvinyl Shop

Standalone Shop-Frontend, deploybar als `shop.lockdownvinyl.de`.
React + Vite + React Router. Aktuell mit Mock-Daten — wird später
an PocketBase angeschlossen.

## Setup

```bash
npm install
npm run dev
```

## Routes

- `/` — Katalog mit Sortierung
- `/instrument/:id` — Produktdetail mit Bilder-Carousel und Mailto/Tel

## Mock-Daten

Liegen in `src/data/instruments.json`. Sechs Beispiel-Instrumente
mit Unsplash-Demo-Bildern. Werden später durch echte Daten aus
PocketBase ersetzt.

## TODO später

- PocketBase JS SDK einbauen
- Fetch aus `src/data/instruments.json` durch API-Call ersetzen
- Bilder-URLs auf PocketBase-File-URLs umstellen
- Nur `published: true` Items zeigen
