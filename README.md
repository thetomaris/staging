# MCP Client Staging

Vorschau-Links für Kundenarbeit, bevor sie auf die Kundenseite wandert.
Ein Ordner pro Kunde, der Ordnername ist der Pfad.

```
/janet-bartucci/   ->  https://mcp-client-staging.netlify.app/janet-bartucci
```

## Neuen Kunden anlegen

1. Ordner mit dem Kundennamen anlegen, kleingeschrieben und mit Bindestrichen.
2. `index.html` reinlegen, vollständiges HTML-Dokument mit Viewport-Meta.
3. Committen und pushen. Netlify baut automatisch.

## Regeln

- `robots.txt` sperrt die ganze Domain für Suchmaschinen, jede Seite trägt
  zusätzlich `noindex`. Kundenvorschauen gehören nicht in Google.
- Der Team-Login ist für dieses Netlify-Projekt bewusst abgeschaltet, sonst
  stehen Kunden vor einer Anmeldewand.
- Hier liegen nur Dateien, die ein Kunde sehen darf. Keine internen Notizen,
  keine Strategiepapiere, keine Zugangsdaten.
- Staging ist nicht Produktion. Sobald etwas abgenommen ist, wandert es auf die
  Seite des Kunden und der Ordner hier kann weg.
