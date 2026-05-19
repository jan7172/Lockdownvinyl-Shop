# Lockdownvinyl Admin

Standalone Admin-Frontend (UI only, vorerst ohne Funktion).
Deploybar als `admin.lockdownvinyl.de`. Wird später an PocketBase
angeschlossen.

## Setup

```bash
npm install
npm run dev
```

Läuft auf `http://localhost:5174` (anderer Port als Shop, damit beide
parallel laufen können).

## Routes

- `/login` — Login-Form (Submit redirected zu /produkte, kein echtes Auth)
- `/produkte` — Produktliste mit Filter, Bearbeiten/Löschen-Buttons
- `/produkte/neu` — Neues Produkt anlegen
- `/produkte/:id/bearbeiten` — Produkt bearbeiten

## Status

UI ist komplett, **alle Aktionen sind Platzhalter**:
- Login: Submit → redirect (kein Passwort-Check)
- Speichern: zeigt nur Alert
- Löschen: zeigt nur Confirm + Alert
- Bilder-Upload: zeigt Bilder lokal im Browser (URL.createObjectURL),
  wird nicht zum Server geschickt

## TODO später

- PocketBase JS SDK einbauen
- Login → PocketBase admin auth
- Products → fetch via PocketBase Collection
- Save → POST/PATCH zur API
- Delete → DELETE
- Image-Upload → PocketBase File-Upload mit Multipart
- Route-Guard: ohne Session → redirect zu /login
