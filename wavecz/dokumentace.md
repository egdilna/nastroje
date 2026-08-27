# Audit přístupnosti webu (WAVE API) — Dokumentace

**Online verze nástroje:** [https://egdilna.github.io/nastroje/wavecz](https://egdilna.github.io/nastroje/wavecz)  
**Stránka nástroje:** [https://egdilna.github.io/nastroje/#wavecz](https://egdilna.github.io/nastroje/#wavecz)

Nástroj je dostupný také jako samostatný soubor HTML ke stažení a provozování lokálně bez připojení k internetu (volání na WAVE API ale internet vyžadují).

---

## Přehled funkcí

**Audit přístupnosti webu** je webová aplikace, která zadanou URL adresu prožene profesionálním nástrojem **WAVE API** od WebAIM (Utah State University) a výsledky zobrazí v přehledné české lokalizaci s vysvětlením, jak jednotlivé problémy opravit. Engine WAVE provádí evaluaci po aplikaci CSS a JavaScriptu, tedy nad skutečně vykresleným DOM stromem.

### Klíčové funkce

- **Spuštění auditu jedné URL** — odeslání adresy do WAVE API a načtení podrobné zprávy včetně CSS selektorů problémových prvků a naměřených kontrastních dat
- **Lokalizovaný katalog problémů** — více než 80 typů zjištění WAVE má český překlad s vysvětlením "Co to znamená" a "Jak to opravit", včetně příkladů špatného a dobrého HTML
- **Reference na WCAG** — u každého typu zjištění je uvedena vazba na konkrétní pravidlo WCAG a jeho úroveň
- **Vizualizace kontrastních chyb** — naměřené kontrastní poměry se zobrazí jako barevné ukázky s hodnocením FAIL/AA/AAA
- **Export reportu** — výsledky lze stáhnout jako Markdown soubor (lokalizovaný) nebo jako surová JSON data z WAVE API
- **Vlastní viewport** — nastavitelná šířka prohlížeče, ve které WAVE stránku vykreslí
- **Podpora vlastní proxy** — možnost obejít CORS omezení WAVE API přes vlastní Cloudflare Worker (vzorový kód je v patičce nástroje)
- **Spuštění přes URL parametry** — `?url=...&viewport=...` umožní načíst stránku rovnou s předvyplněnými hodnotami a (pokud je uložen klíč) automaticky audit spustit
- **AIM Score** — celkové skóre přístupnosti vrácené WAVE API (pokud je k dispozici)
- **Sledování spotřeby kreditů** — po každém auditu se zobrazí zbývající počet kreditů na účtu WAVE

### Přístupnost

Nástroj sám je navržen jako přístupný: skip link na hlavní obsah, semantické HTML, ARIA atributy, viditelný fokus, plná ovladatelnost klávesnicí, respektování `prefers-color-scheme` (světlé i tmavé schéma) a `prefers-reduced-motion`. Použity jsou fonty Atkinson Hyperlegible a JetBrains Mono.

### Uložení dat

API klíč i URL volitelné proxy se ukládají do `localStorage` prohlížeče (klíče `wave-api-key-v1` a `wave-proxy-url-v1`). Žádná jiná data se neukládají, výsledky auditu existují jen po dobu zobrazení stránky. Klíč ani URL se nikam neodesílají s výjimkou samotného volání na WAVE API (nebo na nastavenou proxy).

---

## Navigace a rozložení

Aplikace se skládá ze čtyř hlavních oblastí seřazených pod sebou:

### Záhlaví

Modrý titulek s názvem nástroje a krátkou informací o použitém engine (WAVE API od WebAIM, 100 testů zdarma a poté přibližně 0,025 USD/test).

### Sekce Nastavení WAVE API klíče

Rozbalovací sekce se stavovým odznakem ("klíč nastaven" / "klíč nenastaven"). Pokud klíč chybí, sekce je při startu automaticky otevřená.

### Sekce Pokročilé: proxy URL

Rozbalovací sekce se stavovým odznakem ("proxy: <hostname>" / "přímé volání"). Slouží k nastavení vlastní proxy, pokud přímé volání selhává na CORS.

### Formulář auditu

Karta s polem pro URL ke kontrole, šířkou viewportu a tlačítkem **Spustit WAVE test**. Pod formulářem se zobrazuje stavový panel a posléze výsledky.

### Patička

Informace o WAVE API 3.1 a rozbalitelná instrukce pro nasazení vzorového Cloudflare Worker proxy.

---

## Nastavení WAVE API klíče

WAVE API vyžaduje vlastní klíč. Klíč zdarma s **100 kredity** získáte registrací na [wave.webaim.org/api/register](https://wave.webaim.org/api/register). Klíč pak najdete po přihlášení v účtu.

### Pole a tlačítka

| Prvek | Popis |
|-------|-------|
| API klíč | Pole typu password — zobrazený jako hvězdičky |
| Uložit klíč | Uloží klíč do `localStorage` tohoto prohlížeče |
| Zobrazit / skrýt | Přepne pole mezi `password` a `text` pro vizuální kontrolu |
| Smazat klíč | Po potvrzení vymaže klíč z `localStorage` |

Klíč se ukládá pouze v daném prohlížeči, nikam se neodesílá. Pokud klíč není uložen a uživatel se pokusí spustit audit, formulář ho automaticky přesměruje k nastavení klíče.

---

## Pokročilé: proxy URL kvůli CORS

WAVE API obvykle **nepodporuje CORS** pro klientské volání z prohlížeče. Pokud se volání zastaví na CORS chybě, je nutné nasadit vlastní proxy worker, který WAVE odpověď přepošle a doplní hlavičku `Access-Control-Allow-Origin: *`.

### Pole a tlačítka

| Prvek | Popis |
|-------|-------|
| URL Vaší proxy | Adresa typu `https://wave-proxy.username.workers.dev/` |
| Uložit proxy | Uloží URL proxy do `localStorage` |
| Smazat proxy | Vymaže URL proxy; aplikace pak zkusí WAVE volat přímo |

### Sestavení URL volání

- **Bez placeholderu:** parametry se připojí na konec URL (oddělovač `?` nebo `&` se zvolí podle toho, zda už URL nějaké query obsahuje)
- **S placeholderem `{params}`:** parametry nahradí přesně tento řetězec v URL proxy

### Vzor Cloudflare Worker proxy

Patička nástroje obsahuje rozbalitelný návod krok za krokem:

1. Zaregistrujte si free Cloudflare účet a nainstalujte `wrangler`
2. Vytvořte projekt: `wrangler init wave-proxy` → "Hello World" Worker
3. Obsah `src/index.js` nahraďte vzorovým kódem (10 řádků v patičce nástroje)
4. Deploy: `wrangler deploy` → dostanete URL typu `https://wave-proxy.váš-účet.workers.dev/`
5. Tuto URL vložte do pole "URL Vaší proxy" v aplikaci

Free tier Cloudflare Workers nabízí 100 000 requestů denně. Klíč ani URL se ve workeru neukládají — putují v query parametrech volání.

---

## Spuštění auditu

Formulář auditu obsahuje tato pole:

| Pole | Popis | Výchozí hodnota |
|------|-------|-----------------|
| Adresa URL ke kontrole | Plná adresa včetně `https://` | (prázdné) |
| Šířka viewportu | Šířka prohlížeče, ve které WAVE stránku vykreslí (320–3840) | `1200` |

### Tlačítko Spustit WAVE test

Spustí volání WAVE API s `reporttype=4` (plný detail s CSS selektory a kontrastními daty). Test stojí **3 kredity**. Doba analýzy je obvykle 5–30 sekund. Během testu se tlačítko deaktivuje a zobrazí animaci.

### Spuštění přes URL parametry

Aplikaci lze předvyplnit přes query string:

| Parametr | Význam |
|----------|--------|
| `url` | URL ke kontrole — vyplní pole a (pokud je klíč uložen) automaticky spustí audit |
| `viewport` | Šířka viewportu — vyplní pole |

Příklad: `https://egdilna.github.io/nastroje/wavecz/?url=https://example.com&viewport=1440`

### Chybové stavy

| Situace | Reakce nástroje |
|---------|-----------------|
| Klíč není nastaven | Stavová hláška s odkazem na registraci, sekce klíče se automaticky otevře |
| URL je prázdná nebo neplatná | Stavová hláška, fokus zpět na pole URL |
| Síťová chyba bez proxy | Hláška upozorní na pravděpodobný CORS problém a doporučí nastavit proxy |
| Proxy vrátí ne-JSON | Hláška ukáže začátek odpovědi pro diagnostiku |
| WAVE vrátí `success: false` | Hláška obsahuje chybový text z WAVE API |
| HTTP chyba (4xx/5xx) | Hláška s HTTP kódem a status textem |

---

## Výsledky auditu

Po dokončení auditu se zobrazí karta **Výsledky auditu** s metadaty a statistickými dlaždicemi, následují sekce nálezů.

### Záhlaví reportu

- **URL** zkontrolované stránky
- **Titulek** stránky (pokud WAVE vrátil)
- **Doba analýzy** v sekundách
- **Celkový počet prvků** na stránce
- **Datum a čas** vygenerování reportu

### Souhrnné dlaždice

| Dlaždice | Význam |
|----------|--------|
| Chyby | Počet kategorií chyb (skutečné problémy s přístupností) |
| Kontrast | Počet typů kontrastních chyb |
| Varování | Počet typů varování k ručnímu ověření |
| Features | Počet typů pozitivních zjištění |
| Struktura | Počet strukturálních elementů (nadpisy, landmarky, seznamy) |
| ARIA | Počet ARIA výskytů |
| Zbývá kreditů | Aktuální zůstatek kreditů na účtu WAVE (pokud je vráceno) |
| AIM Score | Celkové skóre přístupnosti (pokud je vráceno) |

### Tlačítka v reportu

| Tlačítko | Akce |
|----------|------|
| Export reportu (Markdown) | Stáhne strukturovaný .md soubor s českou lokalizací |
| Export raw JSON | Stáhne surová data z WAVE API |
| Otevřít plný WAVE report ↗ | Odkaz na webovou verzi reportu na wave.webaim.org |
| Rozbalit vše | Otevře všechny detaily nálezů |
| Sbalit vše | Zavře všechny detaily nálezů |

---

## Sekce výsledků

Nálezy jsou rozděleny do šesti sekcí. Sekce **Chyby** a **Kontrastní chyby** jsou ve výchozím stavu rozbalené, ostatní sbalené.

| Sekce | Význam | Barva |
|-------|--------|-------|
| Chyby | Skutečné chyby přístupnosti k opravě | Červená |
| Kontrastní chyby | Texty s nedostatečným kontrastem po aplikaci CSS | Červená |
| Varování (k ručnímu ověření) | Pravděpodobné chyby, které WAVE neumí potvrdit automaticky | Žlutá |
| Pozitivní zjištění | Prvky, které správně podporují přístupnost | Zelená |
| Strukturální prvky | Landmarky, nadpisy, seznamy, tabulky | Modrá |
| ARIA prvky | Výskyty ARIA atributů na stránce | Modrá |

### Karta nálezu

Každý typ nálezu je rozbalitelná karta. V záhlaví karty:

- **Český název** nálezu
- **Barevný štítek** typu (Chyba, Kontrast, Varování, Feature, Struktura, ARIA)
- **Počet výskytů** na stránce
- **Strojový identifikátor** (např. `alt_missing`)

V rozbaleném detailu:

- **Co to znamená** — vysvětlení dopadu na uživatele
- **Jak to opravit** — číslovaný seznam konkrétních kroků
- **Příklad** — kontrast špatného a dobrého HTML zápisu (pokud je relevantní)
- **WCAG odkaz** — vazba na konkrétní pravidlo WCAG s úrovní (A / AA / AAA)
- **Kontrastní data** — u kontrastních nálezů barevná ukázka a naměřený poměr (viz níže)
- **Nalezené prvky** — seznam CSS selektorů (nebo XPath) všech výskytů na stránce
- **Odkaz na originální WAVE dokumentaci** pro daný identifikátor

### Vizualizace kontrastních chyb

U sekce **Kontrastní chyby** se pro každý výskyt zobrazí ukázková buňka s barvou textu a pozadí ze stránky, doplněná o:

| Hodnocení | Kritérium | Barva výpisu |
|-----------|-----------|--------------|
| AAA | Poměr ≥ 7:1 | Zelená |
| AA | Poměr 4,5–6,99:1 | Žlutá |
| FAIL | Poměr < 4,5:1 | Červená |

Vedle hodnocení je uveden přesný poměr (např. `3.50 : 1`), typ textu (Běžný / Velký) a hex kódy textu a pozadí.

---

## Katalog typů zjištění

Český katalog je zabudován přímo v nástroji a pokrývá hlavní třídy WAVE itemů. Pro každý typ obsahuje název, vysvětlení dopadu, návod na opravu, často i příklad a referenci WCAG.

### Pokryté kategorie

| Skupina | Příklady identifikátorů |
|---------|--------------------------|
| Alternativní texty obrázků | `alt_missing`, `alt_link_missing`, `alt_spacer_missing`, `alt_input_missing`, `alt_area_missing`, `alt_map_missing`, `alt_suspicious`, `alt_redundant`, `alt_long`, `alt_duplicate` |
| Formulářové popisky | `label_missing`, `label_empty`, `label_title`, `select_missing_label`, `fieldset_missing`, `legend_missing` |
| Jazyk stránky | `language_missing`, `language_invalid` |
| Odkazy a tlačítka | `link_empty`, `button_empty`, `link_suspicious`, `link_internal_broken`, `link_redundant`, `link_pdf`, `link_skip`, `link_skip_broken`, `target_blank` |
| Struktura nadpisů | `h1_missing`, `heading_skipped`, `heading_empty`, `heading_possible` |
| Tabulky | `th_empty`, `table_caption_possible`, `table_layout` |
| Rámce | `iframe_missing_title`, `iframe` |
| ARIA | `aria_reference_broken`, `aria_menu_broken`, `aria_hidden`, `aria` |
| Kontrast | `contrast` |
| JavaScript a interakce | `event_handler`, `tabindex`, `accesskey` |
| Vizuální styl | `text_justified`, `text_small`, `column_count` |
| Zastaralé technologie | `flash`, `plugin` |
| Vložená média | `youtube`, `noscript` |
| Pozitivní | `alt`, `alt_link`, `alt_null`, `alt_long_present`, `language`, `label`, `legend`, `fieldset`, `table_caption` |
| Strukturální | `h1`–`h6`, `ol`, `ul`, `dl`, `header`, `footer`, `main`, `nav`, `aside`, `section`, `article`, `region`, `table`, `table_data` |

Pro identifikátory, které v katalogu nejsou, nástroj zobrazí anglický popis přímo z WAVE API a odkaz na originální dokumentaci.

---

## Export reportu

### Export Markdown

Tlačítko **Export reportu (Markdown)** vytvoří soubor `wave-<doména-cesta>.md` se strukturou:

- Záhlaví s URL, datem, AIM Score, dobou analýzy, počtem prvků, zbývajícími kredity a odkazem na plný WAVE report
- Souhrnnou tabulkou počtů dle kategorií
- Sekcemi (Chyby, Kontrastní chyby, Varování, Pozitivní zjištění, Strukturální prvky, ARIA prvky)
- U každého nálezu: identifikátor, počet výskytů, WCAG odkaz, vysvětlení, číslovaný návod k opravě, příklady kódu (HTML codeblock), kontrastní data, seznam selektorů

### Export JSON

Tlačítko **Export raw JSON** stáhne původní odpověď z WAVE API jako soubor `wave-<doména-cesta>.json` (s odsazením 2 mezery).

### Název souboru

Slug v názvu vzniká z hostname a path URL: malá písmena, neabecední znaky nahrazeny pomlčkami, omezeno na 60 znaků. Pokud parser selže, použije se název `audit`.

---

## Technické informace

### Uložení dat

| Klíč v localStorage | Obsah |
|---------------------|-------|
| `wave-api-key-v1` | WAVE API klíč uživatele |
| `wave-proxy-url-v1` | URL volitelné proxy |

Pokud `localStorage` není dostupný (např. v privátním režimu s blokovaným storage), nástroj zobrazí chybovou hlášku a klíč nebude možné uložit.

### Volaný endpoint

| Režim | Endpoint |
|-------|----------|
| Přímé volání | `https://wave.webaim.org/api/request` |
| S proxy | Hodnota uložená v `wave-proxy-url-v1` (s parametry buď nahrazenými na `{params}`, nebo připojenými přes `?` / `&`) |

### Parametry volání WAVE API

| Parametr | Hodnota |
|----------|---------|
| `key` | API klíč uživatele |
| `url` | Testovaná URL |
| `reporttype` | `4` (plný detail s CSS selektory a kontrastními daty) |
| `format` | `json` |
| `viewportwidth` | Hodnota z formuláře (výchozí 1200) |

### Kompatibilita

Nástroj běží v moderních prohlížečích (Chrome, Firefox, Edge, Safari) s podporou `fetch`, `localStorage` a `<details>`. Pro samotný audit je nutné připojení k internetu (volání na WAVE API).

### Cena a kredity

- Registrace na WAVE API: zdarma, **100 kreditů** jako úvodní bonus
- Jeden audit s `reporttype=4`: **3 kredity**
- Po vyčerpání: přibližně **0,025 USD/test** (dle ceníku WebAIM)

### Engine

WAVE API 3.1 od [WebAIM](https://webaim.org/) (Utah State University). WAVE provádí evaluaci po aplikaci CSS a JavaScriptu, tedy nad finálním vykresleným DOM stromem, nikoliv jen nad zdrojovým HTML.

---

## Slovník pojmů

| Pojem | Vysvětlení |
|-------|------------|
| WAVE | Web Accessibility Evaluation Tool — služba WebAIM pro automatizovanou kontrolu přístupnosti |
| WCAG | Web Content Accessibility Guidelines — mezinárodní standard přístupnosti webu (úrovně A, AA, AAA) |
| ARIA | Accessible Rich Internet Applications — sada HTML atributů pro doplnění sémantiky pro asistivní technologie |
| AIM Score | Skóre přístupnosti počítané WebAIM na základě výsledků WAVE |
| Kontrastní poměr | Poměr jasu textu a pozadí (1:1 až 21:1); pro běžný text WCAG AA vyžaduje minimálně 4,5:1 |
| Landmark | Sémantická oblast stránky (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`, `role="region"`) |
| Skip link | Odkaz na začátku stránky, který klávesnicovému uživateli umožní přeskočit hlavičku a navigaci |
| CORS | Cross-Origin Resource Sharing — bezpečnostní mechanismus prohlížečů omezující volání na cizí domény z JavaScriptu |
| Cloudflare Worker | Serverless funkce běžící na edge síti Cloudflare; vhodná pro lehkou proxy s free tier 100 000 requestů/den |
| reporttype | Parametr WAVE API určující úroveň detailu odpovědi (1 = jen počty, 4 = plný detail se selektory a kontrasty) |
| ELI | European Legislation Identifier — standard identifikátorů právních předpisů (zmíněno v některých českých příkladech) |

---

*Dokumentace odpovídá stavu nástroje Audit přístupnosti webu (WAVE API) ke dni vydání. Nástroj je vyvíjen v rámci iniciativy eGdilna.*
