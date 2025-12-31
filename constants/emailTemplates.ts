import { EmailTemplate } from '../types';

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'tpl1',
    name: 'Preisangebot Gartenpflege',
    category: 'quote',
    subject: 'Ihr Angebot für Gartenpflegeservice',
    content: `Sehr geehrte/r [Kundenname],

vielen Dank für Ihre Anfrage bezüglich unserer Gartenpflegedienste.

Gerne unterbreiten wir Ihnen folgendes Angebot:
- Service: [Service-Beschreibung]
- Umfang: [Gartengröße/Details]
- Preis: [Betrag] EUR

Wir freuen uns auf Ihre Rückmeldung.

Mit freundlichen Grüßen
Ihr GreenBros Team`
  },
  {
    id: 'tpl2',
    name: 'Terminbestätigung',
    category: 'appointment',
    subject: 'Terminbestätigung - Gartenpflege',
    content: `Sehr geehrte/r [Kundenname],

hiermit bestätigen wir Ihren Termin:

Datum: [Datum]
Uhrzeit: [Uhrzeit]
Service: [Service-Beschreibung]
Mitarbeiter: [Mitarbeiter-Namen]

Bei Fragen stehen wir Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen
Ihr GreenBros Team`
  },
  {
    id: 'tpl3',
    name: 'Service-Nachbereitung',
    category: 'followup',
    subject: 'Nachbereitung - Ihr Gartenpflegetermin',
    content: `Sehr geehrte/r [Kundenname],

wir hoffen, Sie sind mit unserem Service zufrieden.

Durchgeführte Arbeiten:
- [Aufgabe 1]
- [Aufgabe 2]

Für Rückfragen oder weitere Termine stehen wir Ihnen gerne zur Verfügung.

Mit freundlichen Grüßen
Ihr GreenBros Team`
  },
  {
    id: 'tpl4',
    name: 'Allgemeine Anfrage',
    category: 'general',
    subject: 'Antwort auf Ihre Anfrage',
    content: `Sehr geehrte/r [Kundenname],

vielen Dank für Ihre Nachricht.

[Ihre persönliche Nachricht hier]

Wir freuen uns auf Ihre Rückmeldung.

Mit freundlichen Grüßen
Ihr GreenBros Team`
  }
];
