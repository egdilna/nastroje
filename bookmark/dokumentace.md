# Bookmark — Správce záložek

**Online verze nástroje:** [https://egdilna.github.io/nastroje/bookmark](https://egdilna.github.io/nastroje/bookmark)  
**Stránka nástroje:** [https://egdilna.github.io/nastroje/#bookmark](https://egdilna.github.io/nastroje/#bookmark)

Nástroj je dostupný také jako samostatný soubor HTML ke stažení a provozování lokálně bez připojení k internetu.

---

## Přehled funkcí

**Bookmark** je přístupná webová aplikace pro správu osobních i sdílených kolekcí záložek (bookmarků). Vše běží v jednom souboru HTML — žádný server, žádná instalace. Data se ukládají buď jako lokální soubor JSON, nebo přímo do souboru v repozitáři GitHub (včetně privátních).

### Klíčové funkce

- **Tříúrovňová organizace** — skupiny (záložky v hlavičce), složky (kategorie v rámci skupiny) a samotné záložky
- **Tagy** — barevné štítky napříč celou kolekcí, vícenásobné filtrování
- **Poznámky** — k libovolné záložce lze přidat seznam textových poznámek, samostatný pohled „S poznámkami"
- **Fulltextové hledání** — okamžitě v názvech, URL, popisech, tazích i poznámkách, s barevným zvýrazněním shod
- **GitHub integrace** — načítání i ukládání kolekce do souboru JSON v repozitáři, podpora privátních repozitářů přes Personal Access Token, sdílitelný odkaz s parametrem `?id=`
- **Import a export CSV/TSV** — hromadný import a export záložek včetně automatického rozpoznání oddělovače
- **Export do Markdown** — kopírování složek a tagů ve formátu Markdown do schránky jedním klikem
- **Načítání názvu stránky z URL** — tlačítko „Načíst název" stáhne titulek stránky přes CORS proxy
- **Markdown odkaz v poli Název** — vložení `[text](url)` se po stisku Enter rozdělí do polí Název a URL
- **Sdílitelné odkazy** — kopírování URL na konkrétní skupinu, složku nebo tag (parametr `?view=`)
- **Režim správy** — všechna nedestruktivní akce jsou skryté, dokud uživatel nezapne přepínač Správa
- **Favicony** — automatické načítání favicon stránky přes Google Favicons API
- **Plná přístupnost** — ARIA atributy, klávesová navigace, screen-reader oznamování přes `aria-live`

### Uložení dat

Aplikace ukládá data dvěma způsoby:

- **Soubor JSON v počítači** — stažení tlačítkem „Uložit" / „Stáhnout JSON"; otevření tlačítkem „Načíst JSON"
- **Soubor JSON na GitHubu** — automatické ukládání i čtení přes GitHub REST API

V `localStorage` prohlížeče je uložen **pouze GitHub token** pod klíčem `bm_github_token`. Samotná data záložek (skupiny, složky, záložky, tagy, poznámky) v `localStorage` **nejsou** — kolekce se vždy načítá ze souboru.

---

## Navigace a rozložení

Aplikace má čtyři hlavní oblasti:

### Záhlaví (header)

- **Logo / název kolekce** — vlevo, klikatelný pouze nepřímo (mění se přes „Název" ve správě)
- **Vyhledávací pole** — fulltextové hledání ve všech záložkách (s debounce 250 ms)
- **Přepínač Správa** — zapnutí/vypnutí režimu správy (viz níže)
- **Tlačítka správy** (viditelná jen v režimu Správa):
  - **Název** — otevře dialog nastavení kolekce (název + popis)
  - **Otevřít z GitHub** — načte kolekci ze zadané cesty na GitHubu
  - **GitHub** — nastavení tokenu a cesty k souboru
  - **CSV/TSV** — dialog importu a exportu
  - **Uložit** — uloží data (na GitHub pokud je nastaveno, jinak stáhne soubor)

### Stavový pruh GitHub

Pod záhlavím se v režimu správy zobrazí stav připojení k GitHubu:

- „⬡ GitHub: vlastník/repo/cesta" + tlačítka **↓ Načíst** a **↑ Uložit**
- nebo upozornění „GitHub token nastaven, cesta nenastavena"

### Hlavní navigace

Tři pohledy přepínané tlačítky pod záhlavím:

| Pohled | Popis |
|--------|-------|
| **Skupiny** | Výchozí pohled — záložky v hierarchii skupiny → složky → záložky |
| **Tagy** | Filtrace podle vybraných tagů (logické A), správa tagů |
| **S poznámkami** | Plochý seznam záložek, které mají alespoň jednu poznámku |

### Hlavní obsah

Vykresluje aktuálně zvolený pohled. Při zadání textu do hledacího pole se nahradí pohledem **Výsledky hledání**.

---

## Skupiny

Skupiny jsou nejvyšší organizační úroveň — v UI tvoří záložky (taby) v horní liště pod hlavičkou.

### Seznam skupin

Karta každé skupiny má v záložce popisek `název (N sl., M zál.)` — počet složek a celkový počet záložek.

V režimu správy jsou u každé taby tlačítka **◀** a **▶** pro přesun doleva/doprava a tlačítko **＋** pro přidání nové skupiny.

### Akce skupiny (v režimu správy)

Pod tabami se zobrazí pruh s akcemi pro aktivní skupinu:

| Tlačítko | Akce |
|----------|------|
| **Přejmenovat skupinu** | Otevře dialog s polem názvu |
| **Smazat skupinu** | S potvrzením smaže skupinu včetně všech složek a záložek |
| **Přidat složku** | Otevře dialog pro novou složku |
| **Kopírovat odkaz** | Zkopíruje URL aplikace s parametrem `?view=` ukazujícím na tuto skupinu |

### Klávesová navigace mezi skupinami

| Klávesa | Akce |
|---------|------|
| **←** | Předchozí skupina |
| **→** | Následující skupina |
| **Home** | První skupina |
| **End** | Poslední skupina |

---

## Složky

Složky jsou kategorie záložek v rámci jedné skupiny. Každá složka má svůj nadpis s počtem záložek v závorce.

### Akce složky (v režimu správy)

V hlavičce každé složky se v pravé části zobrazí tlačítka:

| Tlačítko | Akce |
|----------|------|
| **▲ / ▼** | Posun složky nahoru/dolů v rámci skupiny |
| **✎** | Přejmenovat složku |
| **‹›** | Zkopírovat obsah složky jako Markdown do schránky |
| **🔗** | Zkopírovat URL s parametrem `?view=` na tuto složku |
| **🗑** | Smazat složku včetně všech jejích záložek (s potvrzením) |

### Markdown export složky

Tlačítko „Zkopírovat jako Markdown" vytvoří text ve formátu:

```
## Název složky

[Záložka 1](https://...)

Popis záložky.

URL: https://...

* Poznámka 1
* Poznámka 2
```

### Přidání záložky

Na konci seznamu záložek je v režimu správy tlačítko **+ Přidat záložku**, které otevře dialog nové záložky pro aktuální složku.

---

## Záložky

Každá záložka je karta s následujícími prvky:

- **Favicon** — automaticky stažený z Google Favicons API podle domény URL
- **Název** — odkaz, který otevře cíl v aktuální záložce prohlížeče
- **Tlačítka v hlavičce karty:**
  - **↗** — otevřít v novém okně
  - **📋** — zkopírovat URL do schránky
  - **‹›** — zkopírovat jako Markdown odkaz `[název](url)`
- **Popis** — volný text pod tlačítky
- **Doména** — zkrácené zobrazení URL
- **Tagy** — kliknutím na tag se přepne na pohled Tagy s aktivním filtrem
- **Poznámky** — seznam textových poznámek pod záložkou

### Akce záložky (v režimu správy)

V pravé části hlavičky karty se zobrazí další tlačítka:

| Tlačítko | Akce |
|----------|------|
| **▲ / ▼** | Posun záložky nahoru/dolů v rámci složky |
| **✎** | Upravit záložku (dialog) |
| **🗑** | Smazat záložku (s potvrzením) |

### Dialog záložky

Pole dialogu:

| Pole | Popis |
|------|-------|
| **Název** | Povinné. Při zadání řetězce ve tvaru `[text](https://url)` a stisku **Enter** se text rozdělí do polí Název a URL. |
| **URL** | Povinné, musí být platná URL. Vedle pole je tlačítko **Načíst název**, které stáhne titulek stránky z URL přes CORS proxy `api.allorigins.win` (timeout 10 sekund). Pokud je název prázdný, vyplní se automaticky. Pokud je vyplněn, zobrazí se nabídka k přepsání — kliknutí na stavový řádek přepíše. |
| **Popis** | Krátký volný text. |
| **Tagy** | Zaškrtávátka existujících tagů. Přidávání a mazání tagů je v zobrazení **Tagy**. |
| **Přesunout do složky** | (Jen při editaci) Výběr cílové složky napříč všemi skupinami — záložku lze přesunout do jiné složky/skupiny. |

### Poznámky u záložky

Pod každou záložkou je seznam poznámek (odrážky). V režimu správy je u každé poznámky tlačítko **×** ke smazání a pod seznamem řádek s polem **Přidat poznámku…** a tlačítkem **Přidat** (lze potvrdit i klávesou **Enter**).

Poznámky jsou prostý text — žádné HTML, žádné formátování. Slouží k osobním poznámkám k záložce (např. odkud znám, co je v ní zajímavého, atd.).

---

## Tagy

Tagy jsou globální štítky napříč celou kolekcí. Tag se přiřadí záložce zaškrtnutím v dialogu záložky.

### Pohled Tagy

Pohled Tagy obsahuje tři oblasti:

#### Správa tagů (jen v režimu správy)

- Pole **Nový tag…** + tlačítko **Přidat tag** (potvrzení i klávesou Enter) — přidá tag do globálního seznamu, i když není zatím nikomu přiřazen
- Seznam všech existujících tagů s počtem výskytů a tlačítkem **×** pro smazání tagu **ze všech záložek** (s potvrzením)

#### Filtrace podle tagů

Tlačítka všech tagů (s počtem záložek). Kliknutí přidá/odebere tag z aktivního filtru. Filtr je **logické A** — záložka musí mít všechny zvolené tagy.

U každého tagu jsou dvě malé ikonky:

| Tlačítko | Akce |
|----------|------|
| **‹›** | Zkopírovat všechny záložky tagu jako Markdown do schránky |
| **🔗** | Zkopírovat URL s parametrem `?view=` na tento tag |

#### Výsledky filtrace

Pod filtrem se zobrazí seznam záložek, které odpovídají všem aktivním tagům. Bez výběru tagu se zobrazí jen pokyn „Vyberte jeden nebo více tagů pro filtrování záložek."

### Markdown export tagu

Stejný formát jako u složky, ale s nadpisem podle tagu a se všemi záložkami, které tag obsahují (napříč celou kolekcí).

---

## Pohled „S poznámkami"

Jednoduchý plochý seznam **všech záložek, které mají alespoň jednu poznámku**. Slouží k rychlému přehledu, kde máte něco rozpracovaného nebo důležitého. Záložky se zobrazují ve stejné formě jako v hlavním pohledu, včetně všech tlačítek (přesun, úprava, smazání) v režimu správy.

---

## Hledání

Pole **Hledat v záložkách…** v záhlaví spustí vyhledávání po 250 ms od posledního stisku.

Prohledávané atributy záložky:

- Název
- URL
- Popis
- Tagy
- Poznámky

Výsledek zobrazuje:

- Cestu **skupina › složka**
- Název s odkazem (otevírá v novém okně)
- URL, popis a tagy
- Poznámky

Shody se zvýrazňují žlutě (`<mark>`). Pokud je pole prázdné, vrátí se původní pohled (Skupiny / Tagy / Poznámky).

---

## Režim správy

Přepínač **Správa** v záhlaví zapíná a vypíná editační režim. **Bez režimu správy** je aplikace v režimu prohlížení — viditelné jsou pouze záložky a vyhledávání, žádné akce. **V režimu správy** se odhalí:

- Tlačítka v záhlaví: Název, Otevřít z GitHub, GitHub, CSV/TSV, Uložit
- Pruh stavu GitHub (pokud je nastaven token nebo cesta)
- Tlačítko **＋** pro přidání skupiny v liště tabů
- Pruh akcí skupiny (přejmenovat, smazat, přidat složku, kopírovat odkaz)
- Tlačítka u složek (přesun, přejmenovat, smazat, export, …)
- Tlačítka u záložek (přesun, upravit, smazat)
- Smazávání a přidávání poznámek
- Správa tagů v pohledu Tagy

### Automatické ukládání při vypnutí

Pokud je nastaven GitHub token i cesta k souboru a uživatel **vypne** režim správy, aplikace automaticky uloží aktuální stav na GitHub.

---

## GitHub integrace

Aplikace umí číst i zapisovat soubor JSON přímo do repozitáře GitHub přes REST API.

### Nastavení (dialog „GitHub")

| Pole | Popis |
|------|-------|
| **Personal Access Token (fine-grained)** | Token GitHubu s oprávněním zápisu do cílového repozitáře. Tlačítko **Uložit token** uloží do `localStorage` prohlížeče. Hint: „Uloženo pouze v prohlížeči (localStorage). Nikdy v datovém souboru." |
| **Cesta k souboru** | Formát `vlastník/repozitář/cesta/soubor.json` (např. `egdilna/data/zaznamy/zalozky.json`) |
| **Odkaz (záložka/URL parametr)** | Po zadání platné cesty se zobrazí celá URL aplikace s parametrem `?id=` (base64 z cesty) a tlačítko **Kopírovat URL** |
| **Vytvořit token na GitHub ↗** | Odkaz na stránku [github.com/settings/tokens?type=beta](https://github.com/settings/tokens?type=beta) |

Tlačítka v patičce dialogu:
- **Stáhnout JSON** — uloží aktuální data jako soubor do počítače
- **Načíst JSON** — načte soubor JSON z počítače
- **Zavřít** — zavře dialog beze změny
- **Připojit GitHub** — uloží token (pokud je vyplněn) a cestu

### Otevření kolekce z GitHubu (dialog „Otevřít z GitHub")

Samostatný dialog, který zadáním cesty `vlastník/repozitář/cesta/soubor.json` načte kolekci. Pokud není nastaven token, zobrazí se varování, že to bude fungovat **jen pro veřejné repozitáře**.

### Automatické načtení z URL

Pokud má URL aplikace parametr `?id=<base64>` (kódovaná cesta na GitHubu), aplikace se po načtení rovnou pokusí stáhnout odpovídající soubor. Kombinace s parametrem `?view=` (viz níže) umožňuje sdílet odkaz, který se otevře na konkrétní skupině, složce nebo tagu.

### Tlačítka v pruhu stavu GitHub

| Tlačítko | Akce |
|----------|------|
| **↓ Načíst** | Načte aktuální soubor z GitHubu (přepíše stav v paměti) |
| **↑ Uložit** | Uloží aktuální stav do souboru na GitHubu (commit zprava: „Update záložky: YYYY-MM-DD HH:MM:SS") |

### Velké soubory

Pokud soubor přesahuje limit GitHub Contents API, aplikace automaticky padá na Git Blob API (přes SHA získané v první odpovědi). To zaručuje funkčnost i pro privátní repozitáře a velké kolekce.

### Chybové stavy

- **HTTP 404** — soubor nenalezen; doporučí zkontrolovat cestu a u privátních repozitářů nastavit token
- **HTTP 401 / 403** — přístup odepřen; výzva k obnovení tokenu

---

## Sdílitelné odkazy (parametr `view`)

Tlačítka **Kopírovat odkaz** u skupiny, složky a tagu vytvoří URL s parametrem `?view=<base64>`:

| Typ | Obsah po dekódování |
|-----|---------------------|
| Skupina | `group:<id-skupiny>` |
| Složka | `folder:<id-skupiny>:<id-složky>` |
| Tag | `tag:<název-tagu>` |

Při otevření URL s tímto parametrem se aplikace po načtení automaticky přepne na cílový pohled (a u složky odscroluje na hlavičku složky).

Parametr `view` lze kombinovat s `id` (GitHub cesta) — vznikne plně sdílitelný odkaz, např.:

```
https://egdilna.github.io/nastroje/bookmark?id=ZWdkaWxuYS9kYXRhL3Nob3J0LmpzbpL...&view=Z3JvdXA6...
```

---

## Import a export CSV/TSV

Dialog **CSV/TSV** v záhlaví obsahuje dvě sekce: **Import** a **Export**.

### Import

Očekávané sloupce (hlavička v prvním řádku, **velká/malá písmena nezáleží**):

| Sloupec | Synonyma | Popis |
|---------|----------|-------|
| **Název** | `nazev`, `name`, `title` | Název záložky (pokud chybí, použije se URL) |
| **URL** | `adresa`, `link`, `href` | Povinné — bez URL se řádek přeskočí |
| **Popis** | `description`, `desc` | Volitelný popis |
| **Složka** | `slozka`, `folder`, `kategorie`, `category` | Název složky; pokud neexistuje, vytvoří se. Bez hodnoty se použije první existující složka, nebo se vytvoří „Import". |
| **Tagy** | `tags`, `tag`, `štítky` | Oddělené **středníkem** nebo **svislítkem** (`;` nebo `\|`) |

**Oddělovač CSV/TSV** se detekuje automaticky z prvního řádku — tabulátor, středník nebo čárka. Hodnoty mohou být v uvozovkách (`"…"`).

Formulářové prvky:

| Prvek | Význam |
|-------|--------|
| **Soubor (.csv, .tsv)** | Nahrání souboru z disku — obsah se vloží do textarey níže |
| **nebo vložte data přímo** | Textarea pro vložení obsahu ze schránky |
| **Cílová skupina** | Skupina, do které se importované záložky přidají |
| **Duplicitní URL** | **Přeskočit** (výchozí) — duplicitní URL se ignorují; **Přepsat** — existující záložka se aktualizuje (nový název, popis, tagy) |

Po importu se zobrazí přehled: přidáno, přepsáno, přeskočeno, případně počet řádků s chybou (chybějící URL).

### Export

Exportují se **všechny záložky** napříč všemi skupinami a složkami se sloupci **Název, URL, Popis, Složka, Tagy** (tagy oddělené středníkem).

Volby formátu:

| Formát | Oddělovač |
|--------|-----------|
| **CSV** | Čárka — hodnoty obsahující čárku, uvozovku nebo nový řádek se obalí do uvozovek |
| **TSV** | Tabulátor |

Tlačítka:

| Tlačítko | Akce |
|----------|------|
| **Kopírovat do schránky** | Vloží obsah do schránky |
| **Stáhnout soubor** | Stáhne soubor `bookmarks.csv` nebo `bookmarks.tsv` |

---

## Nastavení kolekce

Dialog otevřený tlačítkem **Název** v záhlaví.

| Pole | Popis |
|------|-------|
| **Název kolekce** | Zobrazuje se v záhlaví aplikace a jako titulek záložky prohlížeče |
| **Popis kolekce** | Krátký podtitulek pod názvem v záhlaví |

Hodnoty se ukládají jako součást souboru JSON, takže putují společně s daty (po načtení ze GitHubu se objeví u všech uživatelů).

---

## Klávesové zkratky

| Klávesa | Kontext | Akce |
|---------|---------|------|
| **←** / **→** | Lišta skupin (tabů) | Předchozí / následující skupina |
| **Home** / **End** | Lišta skupin | První / poslední skupina |
| **Esc** | Otevřený dialog | Zavřít dialog |
| **Enter** | Pole „Název" v dialogu záložky | Pokud je obsahem `[text](url)`, rozdělit do polí Název a URL |
| **Enter** | Pole „Nový tag…" | Přidat tag |
| **Enter** | Pole „Přidat poznámku…" | Přidat poznámku |
| **Enter** / **Mezerník** | Stavový řádek po načtení názvu stránky | Přepsat název nově načteným titulkem |
| **Tab** | Celá aplikace | Standardní procházení interaktivních prvků |

---

## Přístupnost

Aplikace je navržena s důrazem na přístupnost:

- **Skip link** „Přeskočit na obsah" pro klávesnicové uživatele
- **`aria-live` region** pro oznamování změn (přidání záložky, načtení ze GitHubu, výsledky hledání, chyby)
- **Role a ARIA atributy** — `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`, `aria-pressed`, `aria-modal`, `aria-labelledby`, `aria-required`
- **Vizuální fokus** — okraj v barvě akcentu (`--accent`) u všech interaktivních prvků
- **Logické pořadí Tab** — záhlaví → navigace → obsah → dialogy
- **Popisné `aria-label`** — u všech ikonových tlačítek
- **Kontrastní téma** — tmavé pozadí, světlý text (kontrast textu výrazně nad 4.5:1)
- **Responzivní layout** — na úzkých obrazovkách (≤ 600 px) jednosloupcové zobrazení záložek

---

## Technické informace

### Datový model

Soubor JSON má následující strukturu:

```json
{
  "title": "Název kolekce",
  "desc": "Popis kolekce",
  "ghPath": "vlastnik/repo/cesta/soubor.json",
  "tags": ["tag1", "tag2"],
  "groups": [
    {
      "id": "...",
      "name": "Skupina",
      "folders": [
        {
          "id": "...",
          "name": "Složka",
          "bookmarks": [
            {
              "id": "...",
              "name": "Záložka",
              "url": "https://...",
              "desc": "Popis",
              "tags": ["tag1"],
              "notes": ["Poznámka 1", "Poznámka 2"]
            }
          ]
        }
      ]
    }
  ]
}
```

Identifikátory (`id`) jsou generovány z aktuálního času (base36) a náhodného řetězce.

### Uložení v prohlížeči

Aplikace v `localStorage` ukládá **jediný klíč**:

| Klíč | Obsah |
|------|-------|
| `bm_github_token` | Personal Access Token pro GitHub. Token **nikdy není** součástí datového souboru. |

### Externí závislosti

- **Google Favicons API** (`https://www.google.com/s2/favicons`) — pro favicony domén
- **AllOrigins** (`https://api.allorigins.win/raw`) — CORS proxy pro načítání titulku stránky
- **GitHub REST API** (`https://api.github.com`) — pro čtení/zápis souboru

Aplikace neobsahuje žádné externí JS knihovny ani CSS frameworky — vše je v jednom HTML souboru (čistý JavaScript, žádný `import`).

### Kompatibilita

Funguje ve všech moderních prohlížečích (Chrome, Firefox, Edge, Safari). Vyžaduje připojení k internetu pouze pro:

- načtení/uložení ze/na GitHub
- načtení titulku stránky tlačítkem „Načíst název"
- zobrazení favicon

Bez internetu aplikace funguje plně lokálně — čtení a zápis souborů JSON do počítače, všechny editační operace.

### URL parametry

| Parametr | Hodnota | Význam |
|----------|---------|--------|
| `id` | base64 cesty `vlastník/repo/cesta/soubor.json` | Automaticky načte kolekci ze GitHubu |
| `view` | base64 jednoho z: `group:<gid>`, `folder:<gid>:<fid>`, `tag:<name>` | Po načtení přepne na cílový pohled |

---

*Dokumentace odpovídá stavu aplikace Bookmark ke dni vydání. Nástroj je vyvíjen v rámci iniciativy eGdilna.*
