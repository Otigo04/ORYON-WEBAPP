/**
 * Rendert strukturierte Daten (schema.org JSON-LD) als <script>-Tag.
 *
 * Server Component. JSON-LD ist der von Google empfohlene Weg für Rich Results
 * und verbessert das Verständnis der Seite durch Suchmaschinen (Knowledge Graph,
 * Sitelinks, lokale Treffer).
 */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify ist sicher: rein serverseitig erzeugte, statische Daten.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
