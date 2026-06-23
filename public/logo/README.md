# Firmenlogo

Hier liegen die Logo-Dateien, die in Navbar & Footer angezeigt werden.
Die aktuellen Dateien sind **Platzhalter** im ORYON-Stil – einfach mit denselben
Dateinamen überschreiben, dann erscheint dein echtes Logo automatisch überall.

| Datei                | Verwendung                                  |
| -------------------- | ------------------------------------------- |
| `oryon-mark.svg`     | Nur das Logo (Icon), z. B. für kleine Flächen / Favicon |
| `oryon-wordmark.svg` | Logo **mit** Schriftzug „ORYON SYSTEMS" (Navbar & Footer) |

## Ersetzen

- **Bevorzugt SVG** (scharf auf allen Auflösungen). Gleicher Dateiname → fertig.
- **PNG möglich:** Datei als `oryon-mark.png` / `oryon-wordmark.png` ablegen und
  in `src/components/Logo.tsx` die Endung `.svg` → `.png` ändern.
- Die Komponente skaliert das Logo über die Höhe (`h-*`-Klassen); die Breite
  passt sich automatisch an das Seitenverhältnis der Datei an.
