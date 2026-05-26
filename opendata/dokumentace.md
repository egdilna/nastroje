# Prohlížeč otevřených dat — univerzální prohlížeč datových sad podle JSON Schema

**Online verze nástroje:** [https://egdilna.github.io/nastroje/opendata](https://egdilna.github.io/nastroje/opendata)
**Stránka nástroje:** [https://egdilna.github.io/nastroje/#opendata](https://egdilna.github.io/nastroje/#opendata)

Nástroj je dostupný také jako samostatný soubor HTML ke stažení a provozování lokálně bez připojení k internetu.

---

## Přehled funkcí

**Prohlížeč otevřených dat** je univerzální webová aplikace pro prohlížení, hledání a filtrování otevřených dat publikovaných na základě JSON Schema. Po zadání adresy schématu a datové sady umožňuje procházení záznamů v tabulce, fulltextové vyhledávání, sloupcové filtrování, řazení, stránkování a zobrazování detailů s propojenými podřízenými záznamy. Celá aplikace běží v jednom HTML souboru — žádný server, žádná instalace.

### Klíčové vlastnosti

- **Univerzální podpora schémat** — pracuje s libovolným JSON Schema, samostatně rozpoznává hlavní pole, podřízené záznamy, číselníkové hodnoty, jazykové mapy a typované hodnoty
- **Entitní model** — kromě plochých tabulek umí zobrazit i datové sady s vnořenými poli objektů (sub-records), které se v detailu zobrazují jako samostatné podtabulky
- **Více vstupních formátů** — automatická detekce JSON, JSON-LD (JSONLD) a JSON-RDF (JSONRDF) i CSV/TSV (RFC 4180 s podporou středníku, tabulátoru a svislé čáry jako oddělovače)
- **Fulltextové vyhledávání** — prohledává všechna pole hlavní úrovně i podřízené záznamy
- **Sloupcové filtry** — pro každý sloupec textové pole nebo výběrový seznam s rozpoznanými hodnotami
- **Řazení** — kliknutím na záhlaví sloupce, vzestupně i sestupně, s respektováním českého abecedního pořadí
- **Stránkování** — volitelně 10, 25, 50, 100 záznamů nebo všechny najednou
- **Detail záznamu** — strukturované zobrazení hlavních polí a všech podřízených tabulek, s formátovanými hodnotami a aktivními odkazy
- **Sdílený odkaz** — jedním kliknutím vytvoří odkaz, který po otevření okamžitě načte stejnou datovou sadu
- **CORS proxy fallback** — pokud cílový server nepodporuje CORS, zkusí načíst data přes veřejné proxy `corsproxy.io` a `api.allorigins.win`
- **Jazykové mapy** — automatické rozbalení polí typu `{"cs": "...", "en": "..."}` s preferencí češtiny
- **Číselníkové hodnoty** — pojmy typu `typ-údaje/VLASTNI` se zobrazí jako barevný odznak s lidským popiskem
- **Odkazy na e-Sbírku** — IRI začínající `/eli/` se otevřou v české e-Sbírce

### Přístupnost

Nástroj je navržen s ohledem na přístupnost — semantické HTML, ARIA atributy, atribut `aria-live` pro stavová hlášení, plná ovladatelnost klávesnicí, viditelný indikátor zaměření a odkaz Přeskočit na hlavní obsah pro uživatele čteček obrazovky.

---

## Začínáme

### Zadání zdrojů dat

V horní části aplikace je formulář **Načtení datové sady** se dvěma poli:

| Pole | Popis |
|------|-------|
| URL schématu (JSON Schema) | Adresa JSON Schema popisujícího strukturu dat |
| URL datové sady (JSON nebo CSV) | Adresa datového souboru s vlastními záznamy |

Po vyplnění obou polí stiskněte tlačítko **Načíst** nebo klávesu **Enter** v některém z polí. Aplikace stáhne oba soubory, projde schéma, sestaví sloupce a zobrazí data v tabulce. Stavová hlášení o průběhu načítání se zobrazují pod formulářem.

### Automatická detekce formátu dat

Aplikace rozpozná formát datové sady na základě:

1. hlavičky `Content-Type` z HTTP odpovědi (`application/json`, `text/csv`, `text/tab-separated-values`),
2. přípony v URL (`.json`, `.csv`, `.tsv`),
3. obsahu souboru (začíná-li `{` nebo `[`, považuje se za JSON).

Pokud je JSON neplatný, aplikace ještě zkusí soubor zpracovat jako CSV. CSV parser sám detekuje oddělovač (čárka, středník, tabulátor, svislá čára), respektuje RFC 4180 s uvozovkami a escapovanými uvozovkami (`""`) a odstraní případný UTF-8 BOM.

### Konverze hodnot v CSV

Při importu CSV se hodnoty automaticky převedou na vhodné typy:

| Vstup | Výstup |
|-------|--------|
| `true`, `false` | logická hodnota |
| Celé číslo | číslo (s ochranou kódů s úvodními nulami jako IČO, PSČ) |
| Desetinné číslo | číslo |
| Prázdná hodnota | `null` |
| Ostatní | text |

### Sdílení odkazem

Po načtení dat se v panelu metadat zobrazí tlačítko **Kopírovat odkaz ke sdílení**. Tlačítko vytvoří URL s vloženým fragmentem (`#d=...`) obsahujícím obě zadané adresy v base64 kódování. Otevřením takového odkazu se data automaticky načtou. Adresní řádek prohlížeče se aktualizuje při každém úspěšném načtení, takže lze odkaz uložit i jako záložku.

Pro zpětnou kompatibilitu rozpozná aplikace i starší formát `#schema=...&data=...`.

---

## Zobrazení a filtrování

### Panel metadat

Pod stavovým hlášením se zobrazí panel s informacemi o načtené datové sadě:

- název odvozený z `title` schématu nebo z `$id`,
- popis (pole `description` schématu),
- počet záznamů a sloupců, případně názvy podřízených (vnořených) sad,
- odkazy na zdrojové schéma a data,
- tlačítko **Kopírovat odkaz ke sdílení**.

### Tabulka

Datová tabulka zobrazuje hlavní pole jako sloupce. Vlastnosti tabulky:

- první sloupec **#** je pořadí v aktuálním řazení,
- sloupce s podřízenými záznamy ukazují odznak s počtem (např. `3 zázn.`),
- poslední sloupec **Akce** obsahuje odkaz **Detail**,
- najetím myši na záhlaví sloupce se zobrazí popis z `description` schématu.

### Řazení

Kliknutím na záhlaví sloupce se záznamy seřadí podle této hodnoty. Opakované kliknutí přepíná vzestupné a sestupné řazení; směr se ukazuje šipkou ▲/▼. Číselné sloupce se řadí numericky, ostatní podle českého abecedního pořadí (`localeCompare('cs')`).

### Fulltextové vyhledávání

Pole **Fulltextové vyhledávání** prohledá najednou všechna pole hlavní úrovně i vnitřek podřízených záznamů. Vyhledávání je nediakritické porovnání podřetězce, hodnoty se nejprve normalizují (jazykové mapy se rozbalí, objekty převedou na text). Vstup je odložen o 300 ms (debounce), aby se filtr nepřepočítával při každém stisku klávesy.

### Sloupcové filtry

Tlačítko **Sloupcové filtry** otevře panel s filtrem pro každý sloupec hlavní tabulky:

| Typ pole | Vstup |
|----------|-------|
| Boolean | rozbalovací výběr Ano / Ne / — vše — |
| Číselník (do 20 jedinečných hodnot) | rozbalovací výběr s rozpoznanými hodnotami |
| Ostatní (text, číslo, datum) | textové pole pro filtr podřetězcem |

Filtry se kombinují logicky AND s fulltextovým vyhledáváním. Tlačítko **Zrušit filtry** vymaže vyhledávání, sloupcové filtry i řazení.

### Stránkování

Pod tabulkou je ovládání stránkování:

- informace o aktuálně zobrazeném rozsahu („Zobrazeno 1–25 z 137 záznamů"),
- výběr počtu záznamů na stránku: 10, 25, 50, 100 nebo Vše,
- tlačítka **← Předchozí**, čísla stránek (se zkrácením `…` pro velké rozsahy) a **Další →**.

Při změně stránky se obrazovka plynule posune k začátku tabulky.

---

## Detail záznamu

Kliknutím na odkaz **Detail** v posledním sloupci tabulky se otevře pohled detailu. Tabulka i toolbar se skryjí, na jejich místě se zobrazí strukturovaná karta záznamu.

### Obsah karty detailu

| Část | Popis |
|------|-------|
| Nadpis | Hodnota pole `název`/`name`/`title`/`label` nebo první vhodný textový sloupec; pokud takový není, `Záznam #N` |
| Hlavní pole | Seznam polí ve formě definičního seznamu (`<dl>`) — popisek pole a hodnota |
| Extra pole | Pole, která nejsou ve schématu, ale jsou v datech, se zobrazí pod hlavními poli |
| Podřízené tabulky | Pro každé pole typu pole objektů samostatný oddíl s vlastní podtabulkou |

### Formátování hodnot v detailu

- **Prázdná hodnota** — text `(prázdné)` šedou kurzivou,
- **URL** — aktivní odkaz otevřený v nové kartě,
- **Boolean** — `Ano` / `Ne`,
- **Datum** — formátováno podle českých zvyklostí,
- **Číselník** — barevný odznak s lidským popiskem (např. `Vlastní`, `Referenční`, `Veřejný`, `Neveřejný`) a v závorce původní kód,
- **Jazyková mapa** — rozbalena na český text (s návratem na sk → en → první dostupný),
- **Pole textů** — každá hodnota na samostatném řádku,
- **Vnořený objekt** — zobrazen jako další úroveň definičního seznamu,
- **ELI odkaz** (`/eli/...`) — automaticky odkazuje na `https://www.e-sbirka.cz/...`.

### Odznaky pro typové hodnoty

Hodnoty ve tvaru `prefix/KÓD`, kde `KÓD` je velkými písmeny, se rozpoznají jako kódy a zobrazí jako odznak:

| Kód | Popisek | Barva odznaku |
|-----|---------|---------------|
| `VLASTNI` | Vlastní | šedá |
| `REFERENCNI` | Referenční | modrá |
| `NESDILENY` | Nesdílený | — |
| `SDILENY` | Sdílený | — |
| `NEMA_NOTIFIKACI` | Nemá notifikaci | — |
| `MA_NOTIFIKACI` | Má notifikaci | — |
| Ostatní | Kód s podtržítky nahrazenými mezerami | — |

### Návrat na seznam

Návrat zpět k tabulce je možný:

- odkazem **← Zpět na seznam** v levém horním rohu karty,
- klávesou **Esc**.

---

## Klávesové zkratky

| Klávesa | Akce |
|---------|------|
| **Enter** v poli URL | Načte data |
| **Esc** v zobrazení detailu | Zavře detail a vrátí seznam |
| **Tab** | Přesun zaměření mezi prvky |
| **Mezerník** / **Enter** na tlačítku | Aktivace tlačítka |

---

## Export

Prohlížeč otevřených dat sám neexportuje data v jiném formátu — slouží k zobrazení existujících publikovaných dat. Místo exportu nabízí:

- **Sdílený odkaz** — viz sekce Sdílení odkazem; odkaz vede ke stejnému pohledu, takže lze datovou sadu sdílet bez nutnosti přiložení souboru,
- **Odkazy na zdroje** — v panelu metadat jsou aktivní odkazy na původní schéma a datový soubor, které lze otevřít, stáhnout nebo dál zpracovávat ve vlastním nástroji,
- **Tisk prohlížeče** — pohled tabulky či detailu lze vytisknout standardním dialogem prohlížeče (Ctrl+P) a uložit jako PDF.

---

## Práce se schématem

### Struktura schématu

Aplikace rozpozná dva základní tvary schématu:

1. **Schéma s vlastnostmi** (`type: "object"`, `properties`) — pokud některá vlastnost je pole objektů, jeho položky se použijí jako definice záznamu; ostatní vlastnosti se ignorují.
2. **Schéma pole** (`type: "array"`, `items`) — položky pole se použijí jako definice záznamu.

Pokud schéma neobsahuje použitelné vlastnosti, sloupce se odvodí z prvních 50 záznamů samotných dat.

### Podporované rysy schématu

- `$ref` reference v rámci dokumentu se rozbalí,
- `anyOf` / `oneOf` — vybere se první neprázdná varianta (přeskočí `null`),
- `title` jako nadpis sloupce, jinak se název odvodí z klíče (`humanize`),
- `description` jako tooltip nad záhlavím sloupce,
- `format: date` / `date-time` — formát data,
- `format: uri` / `iri` — odkaz,
- `enum` — výčet hodnot,
- objektová pole s vlastnostmi výhradně jazykových kódů se považují za jazykovou mapu.

### Struktura dat

Datový soubor může obsahovat:

- **Pole záznamů** — `[ {...}, {...} ]`,
- **Objekt s polem záznamů** — vybere se největší pole; běžné u JSON-LD/RDF s polem `@graph` nebo podobnými obálkami,
- **Jediný objekt** — zobrazí se jako jediný záznam.

---

## Technické informace

### Závislosti a běh

Aplikace je jediný HTML soubor bez závislostí na externích knihovnách. Veškerá logika běží v prohlížeči; data se nikam neodesílají s výjimkou volání zvolené adresy schématu, adresy datové sady a případně CORS proxy.

### CORS proxy

Pokud cílový server neumožňuje CORS, aplikace automaticky zkusí dvě veřejné proxy:

1. `https://corsproxy.io/?`
2. `https://api.allorigins.win/raw?url=`

Pokud ani jedna nepomůže, zobrazí se chybové hlášení. Pro citlivá data je vhodné raději stáhnout soubor lokálně a publikovat na vlastním serveru s povoleným CORS.

### Kompatibilita

Aplikace funguje v moderních prohlížečích (Chrome, Firefox, Edge, Safari). Vyžaduje JavaScript, `fetch`, `URLSearchParams`, `URL`, `localStorage` (volitelně) a `navigator.clipboard` (pro kopírování sdíleného odkazu — s fallbackem na starší metodu).

### Formát sdíleného odkazu

Odkaz ke sdílení má tvar:

```
https://egdilna.github.io/nastroje/opendata#d=<base64url>
```

kde `<base64url>` je base64-url kódovaný JSON `{"s": "schemaUrl", "d": "dataUrl"}`. Pro zpětnou kompatibilitu je podporován i starší formát `#schema=...&data=...`.

### Podporované jazykové kódy

Aplikace rozpoznává tyto kódy v jazykových mapách (rozbaluje se přednostně `cs`, pak `sk`, `en`, případně první dostupný): `cs, sk, en, de, fr, pl, hu, es, it, pt, nl, da, sv, fi, no, ru, uk, bg, hr, sl, ro, el, lt, lv, et, ga, mt`.

---

## Slovník pojmů

| Pojem | Vysvětlení |
|-------|------------|
| JSON Schema | Standardní jazyk pro popis struktury JSON dokumentů |
| JSON-LD | Formát pro propojená data ve formátu JSON (JSON for Linked Data) |
| RDF | Resource Description Framework — model pro popis propojených dat |
| CSV / TSV | Comma/Tab-Separated Values — tabulkové formáty |
| BOM | Byte Order Mark — značka kódování na začátku UTF-8 souboru |
| CORS | Cross-Origin Resource Sharing — mechanismus prohlížeče pro povolení dotazů mezi doménami |
| IRI | Internationalized Resource Identifier — globální identifikátor entity |
| ELI | European Legislation Identifier — standardní identifikátor právních předpisů |
| Jazyková mapa | Objekt typu `{"cs": "...", "en": "..."}` pro vícejazyčný text |
| Podřízený záznam (sub-record) | Pole objektů uvnitř hlavního záznamu — zobrazí se jako samostatná podtabulka v detailu |
| Číselník (coded value) | Kódovaná hodnota ve tvaru `prefix/KÓD` rozpoznaná jako odznak |

---

*Dokumentace odpovídá stavu aplikace Prohlížeč otevřených dat ke dni vydání. Nástroj je vyvíjen v rámci iniciativy eGdílna.*
