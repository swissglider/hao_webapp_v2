**Prompt:**

Ich arbeite an einem Backend-Projekt, das in JavaScript mit Express entwickelt wird. Es hat eine Cache-Implementierung zur Speicherung von Daten, die von einem Home Assistant-Server abgerufen werden.

**Hier sind die wichtigsten Details:**

1. **Datenquellen**: Die Daten werden über REST-API-Endpunkte des Home Assistant Servers abgerufen (z. B. Temperatur, Bewegung, Status).
2. **Caching-Strategie**: Die Daten werden in einem In-Memory-Cache gespeichert, der eine Time-to-Live (TTL) hat. Wenn die Daten abgerufen werden, wird geprüft, ob sie im Cache vorhanden und nicht abgelaufen sind.
3. **Intervall-Aktualisierung**: Die Daten sollen in bestimmten Intervallen (konfiguriert über eine `.env`-Datei) aktualisiert werden, um sicherzustellen, dass die neuesten Daten vorliegen.
4. **Routen und Controller**: Die API-Routen sind so gestaltet, dass sie die abgerufenen Daten bereitstellen.
5. **Dokumentation**: Es soll eine ausführliche Dokumentation in Markdown (.md) erstellt werden, die den Ablauf des API-Aufrufs `/api/data/status`, das Caching und die Intervallaktualisierung beschreibt.
6. **Diagramme**: Ich benötige auch UML- und Aktivitätsdiagramme, die den Ablauf visuell darstellen.

Bitte fahre mit den erforderlichen Änderungen oder Implementierungen fort.
