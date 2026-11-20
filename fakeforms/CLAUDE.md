# FakeForms – pokyny k nástroji

Mock zjednodušených formulářů DIA (EasyForms). Jeden soubor `index.html`, bez sestavení, česky.

## Účel

- **Režim úřadu (OVM)** napodobuje Katalog zjednodušených formulářů v AIS Správa katalogů:
  - seznam formulářů a průvodce ve 4 krocích (identifikace, struktura, přílohy, rekapitulace);
  - stavy rozpracovaný → ke schválení → schválený / odmítnutý / zrušený, schvalování za DIA;
  - nové verze s účinností, kopie, sdílené číselníky.
- **Režim občana** napodobuje Portál občana: profil místo NIA a ZR, zastupování místo ReZa, vyplnění, kontrolu a odeslání.
- **Adresát:** směrování podání se neuplatňuje. Adresátem je vždy smyšlený úřad ze souboru a jeho datová schránka.

## Data

- **Jeden JSON = jeden úřad** (`formát: "fakeforms-urad"`). Obsahuje nastavení úřadu, formuláře (každá verze je samostatný záznam se stejným `id`, jiným `uid` a `verze`), číselníky, profil klienta a doručené zprávy (`datovka`; v `obsah` je celý obsah ZIPu, binární soubory – přílohy a PDF – v base64 přes `bytyDoBase64`, takže zprávu jde kdykoli znovu stáhnout celou).
- **Ukládání:** průběžná kopie se ukládá do `localStorage` (`fakeforms-stav-v1`). Soubor úřadu se ukládá prostým stažením (File System Access API se nepoužívá). Velké přílohy mohou přeplnit `localStorage`; chyba se pak ukáže v Hlášení aplikace a data zůstanou jen ve staženém JSON. GitHub API se nepoužívá.
- **Kódy polí:** `parametr_1_N` z počítadla `dalšíKód`. Při přesunech se nemění, protože na ně odkazují výrazy.

## Výstup odeslání (ZIP)

- `obalka-datove-zpravy.xml` – smyšlená obálka, není ISDS.
- `podani-<id>.pdf` – volitelné. pdf-lib a font DejaVu z jsDelivr; tři XML jsou vložená jako přidružené soubory (AFRelationship Data). Nejde o validované PDF/A-3.
- `data-dokumentu-formuláře-pro-elektronické-podání.xml` – kořen `detail_podání` bez jmenného prostoru. Struktura je odvozená z dokumentace DIA ke strojovému vytěžování dat, **přesné XSD EasyForms není veřejné**. Oddíly jsou vnořené elementy v `předmět_podání`, názvy elementů vznikají z popisků (`názevElementu`).
- `metadata-dokumentu-formuláře-pro-elektronické-podání.xml` – OFN Dokumenty z formulářů ZoPDS 2024-10-04.
- `metadata-dokumentu-veřejnoprávního-původce.xml` – OFN 2024-12-10.
- `přílohy/…` – nahrané soubory.
- Osvědčení o digitálním úkonu (OFN 2024-10-17) se nabízí občanovi zvlášť.

Obě metadatová XML a osvědčení byly ověřeny proti XSD z repozitáře `datagov-cz/otevrene-formalni-normy` (XSD 1.1, knihovna `xmlschema`). Při změně generování XML ověření zopakuj.

## Výrazy

- **Výpočty a podmíněné zobrazení příloh** jsou XPath 1.0 přes `document.evaluate`. Proměnné `$parametr_…` se před vyhodnocením nahradí literály:
  - číslo jako číslo;
  - logická hodnota jako `true()` / `false()`;
  - text, datum a kód číselníku jako řetězec;
  - vícenásobný výběr jako kódy spojené středníkem, testuje se přes `contains()`.

## Konvence

- **Přístupnost:** seznamy jsou odkazy (`aria-current`). Struktura je ve vnořených `ol`, ne treeview. Žádný drag & drop, jen tlačítka pro posun. Žádné `position: sticky/fixed`. Chyby aplikace se vypisují do sekce Hlášení aplikace, ne do konzole.
- **Překreslování:** během `innerHTML` je nastaven příznak `překreslování`. Opožděný `change` z odstraněného pole se ignoruje, jinak přepíše čerstvě načtená data.
