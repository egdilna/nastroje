# Changelog — Legislativní prohlížeč

Formát vychází z [Keep a Changelog 1.1.0](https://keepachangelog.com/cs/1.1.0/), verze podle sémantického verzování.

## [1.1.0] — 2026-10-20

### Přidáno
- Poznámka k celému předpisu v Markdownu na vlastní stránce s náhledem; ukládá se jako samostatný soubor `predpisy/<rok>-<číslo>/poznamka.md` a zobrazuje se nad textem předpisu.
- Komentáře k ustanovením — libovolně mnoho k jednomu ustanovení, v Markdownu, s úpravou a mazáním; značka 💬 s počtem v textu předpisu a v přístupném názvu označení.
- Skupiny komentářů s přehledy komentářů podle skupiny, předpisu, oblasti i všech dohromady a s kopírováním přehledu.
- Kopírování ustanovení i s komentáři; hledání i v komentářích a poznámkách k předpisům.
- Upozornění při odchodu ze stránky s rozepsaným a neuloženým textem.

## [1.0.0] — 2026-10-19

### Přidáno
- Pracovní prostor ve složce GitHub repozitáře (`legprohlizec.json` a složka `predpisy`), token jen v prohlížeči, úložiště předatelné odkazem.
- Oblasti jako uživatelské složky předpisů; jeden předpis může být ve více oblastech.
- Přidání předpisu podle čísla (110/2019, citace, ELI nebo adresa z e-Sbírky) se stažením aktuálního a volitelně i budoucích znění; každé znění v samostatných souborech do zhruba 600 kB.
- Strukturované vykreslení celého předpisu: části, hlavy, díly, paragrafy a články jako nadpisy, odstavce, písmena a body jako vnořené seznamy, tabulky, poznámky pod čarou, obsah předpisu.
- Detail ustanovení s umístěním v předpisu, kontextem celého paragrafu, sousedními ustanoveními, odkazy a kopírováním v několika tvarech.
- Vyznačená ustanovení ve skupinách (neomezeně) s poznámkami, značka v textu, přehledy podle předpisu, oblasti, skupiny i celkový.
- Odkazy mezi předpisy; předpis mimo knihovnu se nabídne k zařazení.
- Hledání v předpisu, oblasti nebo celé knihovně (i bez diakritiky a v poznámkách), přechod na ustanovení podle citace.
- Kontrola a stažení nových znění, historie a obnova pracovního prostoru.
