# Changelog — Legislativní prohlížeč

Formát vychází z [Keep a Changelog 1.1.0](https://keepachangelog.com/cs/1.1.0/), verze podle sémantického verzování.

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
