# MarkDown editor — hierarchický editor Markdown souborů s náhledem, prezentací a exporty

**Online verze nástroje:** [https://egdilna.github.io/nastroje/markdown](https://egdilna.github.io/nastroje/markdown)
**Stránka nástroje:** [https://egdilna.github.io/nastroje/#markdown](https://egdilna.github.io/nastroje/#markdown)

Nástroj je dostupný také jako samostatný soubor HTML ke stažení a provozování lokálně bez připojení k internetu.

---

## Přehled funkcí

**MarkDown editor** je univerzální webová aplikace pro tvorbu a úpravu Markdown souborů. Pracuje s dokumentem jako se **stromem sekcí** odvozeným od nadpisů `#`, `##`, `###`… Každou sekci lze editovat samostatně, přesouvat ji v hierarchii, sbalovat, izolovat a zobrazovat jako prezentaci.

Vše běží v jednom HTML souboru — žádný server, žádná instalace. Soubor `.md` zůstává na vašem disku, do prohlížeče se nic neukládá kromě volby jazyka.

### Klíčové funkce

- **Hierarchický editor** — dokument se automaticky parsuje na strom sekcí podle úrovní nadpisů `#` až `######`; každou sekci lze samostatně editovat, mazat, přesouvat nahoru/dolů, zanořovat a vynořovat.
- **Náhled dokumentu** — celostránkový HTML náhled vygenerovaný knihovnou marked.js (GitHub Flavored Markdown s podporou tabulek a zalamování řádků).
- **Otevření souboru** — načtení `.md`, `.markdown` nebo `.txt` z disku, vložení Markdownu ze schránky přes dialog, nebo načtení z URL parametru `?md=…` (Base64).
- **Uložení** — uložení jako `.md` přes nativní dialog `showSaveFilePicker` (Chrome, Edge), s fallbackem pro starší prohlížeče.
- **Export DOCX** — export aktuálně viditelných sekcí do souboru Microsoft Word `.docx` (knihovna html-docx-js).
- **Sdílení odkazem** — tlačítko *Zkopírovat URL* zakóduje celý dokument do URL (`?md=Base64`) a vloží ji do schránky; příjemce po otevření URL uvidí dokument bez jakéhokoli serveru.
- **Prezentační režim** — libovolnou sekci s podsekcemi lze spustit jako slideshow s časomírou, navigací šipkami a přehledem snímků.
- **CriticMarkup** — barevné označení vložení, mazání, náhrad, zvýraznění a komentářů (`{++…++}`, `{--…--}`, `{~~old~>new~~}`, `{==…==}`, `{>>…<<}`).
- **DokuWiki tabulky** — kromě standardních Markdown tabulek umí vykreslit i DokuWiki syntaxi `^ záhlaví ^` a `| buňka |`.
- **Hashtagy** — text uvozený `#` (např. `#urgent`) je automaticky rozpoznán jako tag, zobrazen jako odkaz a slouží k filtrování sekcí. Podporuje české znaky.
- **Úkoly (task list)** — `- [ ]` a `- [x]` se vykreslí jako interaktivní checkboxy; nástroj počítá poměr splněných úkolů a umí najednou odstranit hotové.
- **Fulltextové hledání** — vyhledávání v nadpisech i obsahu sekcí, výsledky jsou filtrovaný strom.
- **Izolace sekce (hoist)** — zobrazení jen jedné sekce a jejích podsekcí s navigační drobečkovou cestou.
- **Sbalování** — sbalit/rozbalit lze podsekce i obsah jednotlivých sekcí; tlačítka *Rozbalit vše* / *Sbalit vše*.
- **Sledování změn** — od posledního uložení/načtení se nové sekce a změněné nadpisy/obsah zvýrazňují (`<ins>`); v každé sekci se počítá kolik znaků a slov bylo přidáno.
- **Statistiky** — pro každou sekci se zobrazuje počet znaků, počet slov, počet podsekcí a procento dokončení (sekce s `✏️` v nadpisu jsou považovány za rozpracované).
- **Editorské odkazy** — odkazy na sousední nástroje (`opml-editor.html`, `markdown-editor.html`, `json-editor.html`) se v náhledu vykreslí jako tlačítka „Otevřít v…".
- **Integrace s DokuWiki** — pokud je nástroj otevřen z DokuWiki přes `window.opener`, dovoluje uložit obsah zpět do wiki přes `postMessage`.
- **Dva jazyky UI** — čeština a angličtina, automatická detekce dle prohlížeče, volba se ukládá v `localStorage`.
- **Režim pouze pro čtení** — parametr `?v` v URL zapne čistý prohlížecí režim bez editačních ovládacích prvků.

### Přístupnost

Aplikace používá sémantické HTML (`<article>`, `<main>`, `<header>`), ARIA atributy (`aria-label`, `aria-expanded`, `aria-live`, `aria-modal`), `accesskey` pro hlavní akce a viditelné focus-outliny (oranžový rámeček). Prezentační režim oznamuje změny snímku přes `aria-live`.

### Uložení dat

- **Dokument** se neukládá nikam automaticky — pracujete s lokálním souborem `.md`, který si sami stáhnete tlačítkem *Uložit soubor*.
- **Volba jazyka** se ukládá v `localStorage` pod klíčem `markdown-editor-language`.
- **Sdílení odkazem** zakóduje celý dokument do URL (klíč `md=Base64`, URL-safe varianta). Data neopouštějí prohlížeč — vše se děje klientsky.

---

## Navigace a rozložení

Aplikace má tři vodorovné pásy:

1. **Záhlaví** — modrý pruh s názvem „📝 Markdown Editor" a přepínačem jazyka (Čeština / English).
2. **Toolbar** — světlá lišta s tlačítky hlavních akcí a vpravo polem pro fulltextové hledání.
3. **Pracovní plocha** — buď úvodní obrazovka „Žádný soubor není načten", nebo strom sekcí dokumentu.

Pod stromem se vykreslí panel **🏷️ TAGY** se všemi tagy z dokumentu a jejich počty; kliknutím na tag se aktivuje filtr.

---

## Toolbar — hlavní akce

V běžném režimu obsahuje toolbar tato tlačítka:

| Tlačítko | Akce | Klávesa |
|---|---|---|
| ➕ Nový soubor | Vytvoří prázdný dokument (s potvrzením při neuložených změnách) | — |
| 📂 Nahrát soubor | Otevře dialog výběru souboru (`.md`, `.markdown`, `.txt`) | — |
| 📋 Vložit ze schránky | Otevře dialog s textareou pro vložení Markdown textu z jiné aplikace | — |
| 💾 Uložit soubor | Uloží dokument jako `.md` (nativní dialog `showSaveFilePicker` / stažení) | `Alt+S` |
| 📄 Kopírovat Markdown | Zkopíruje vygenerovaný Markdown do schránky | `Alt+C` |
| 🔗 Zkopírovat URL | Zkopíruje URL s dokumentem zakódovaným v Base64 | — |
| 📝 Export DOCX | Vyexportuje aktuálně viditelný obsah do `.docx` | — |
| ➕ Přidat sekci | Přidá novou kořenovou sekci úrovně 1 a otevře ji k editaci | — |
| ⊞ Rozbalit vše | Rozbalí všechny sekce | `Alt+E` |
| ⊟ Sbalit vše | Sbalí všechny sekce | `Alt+W` |
| 👁️ Náhled dokumentu | Otevře celostránkový HTML náhled | — |

V **režimu pouze pro čtení** (URL parametr `?v`) je toolbar omezen na žluté upozornění „👁️ Režim pouze pro čtení / Read-only mode", tlačítko *Náhled* a pole pro hledání.

### Hledání

Vpravo v toolbaru je pole *Hledat v názvech a obsahu…* a tlačítko **🔍 Filtrovat**. Hledání lze potvrdit klávesou `Enter`. Při aktivním hledání se v horní části stromu zobrazí zelený proužek s počtem nalezených sekcí a tlačítkem **❌ Zrušit hledání**. Hledání je necitlivé na velikost písmen a filtruje i nadřazené sekce, aby nalezené podsekce zůstaly v kontextu.

---

## Strom sekcí

Každá sekce je samostatný panel s rámečkem. V náhledovém režimu (mimo editaci) obsahuje:

- **Tlačítka vlevo** — ▶/▼ pro sbalení/rozbalení podsekcí (jen pokud sekce má potomky) a druhé ▶/▼ pro sbalení/rozbalení vlastního obsahu sekce.
- **Indikátor úrovně** — drobný text „Úroveň 2 · Sekce 3 z 5".
- **Nadpis** — vykreslený jako `<h1>`–`<h6>` dle úrovně. Tagy `#tag` jsou v něm klikatelné odkazy s drobnou ikonkou 🗑️ pro odebrání konkrétního tagu.
- **Informační odznaky** — barevné štítky pod nadpisem:
  - 📦 Rozbaleno/Sbaleno + počet podsekcí (šedý)
  - ✏️ X rozpracováno, ✓ Y hotovo (Z %) — oranžový, jen jsou-li podsekce s emoji `✏️` v nadpisu
  - ✓ X/Y splněno (Z %) — zelený, je-li v sekci alespoň jeden task `- [ ]`
  - 📊 Počet znaků a slov; pokud došlo ke změnám, doplní se „➕ X znaků, Y slov přidáno" — modrý
- **Tělo sekce** — vykreslený Markdown obsah s podporou CriticMarkupu, DokuWiki tabulek, klikatelných tagů, interaktivních checkboxů úkolů a tlačítek pro editorské odkazy.
- **Lišta akcí** — viz tabulka níže.

### Akce nad sekcí (náhledový režim)

| Tlačítko | Funkce |
|---|---|
| 🗑️ Odstranit hotové úkoly | Smaže z těla sekce všechny řádky `- [x]` (zobrazí se jen jsou-li hotové úkoly) |
| 🏷️ Odstranit tagy | Odebere všechny hashtagy z nadpisu i těla sekce (zobrazí se jen má-li sekce tagy) |
| ✏️ Editovat | Přepne sekci do editačního režimu |
| 🔍 Izolovat | Zobrazí jen tuto sekci a její podsekce (hoist) |
| 🎬 Prezentovat | Spustí prezentační režim z této sekce (jen má-li podsekce) |
| ➕ Přidat podsekci | Vloží novou podřízenou sekci o úroveň níž |
| ➕ Přidat další sekci | Vloží sourozeneckou sekci na stejné úrovni |
| 🗑️ | Smaže sekci včetně všech podsekcí (s potvrzením) |

### Editační režim

Po stisku **✏️ Editovat** se sekce přepne do edit-mode:

- **Pole nadpisu** — jednořádkový vstup pro název.
- **Textarea obsahu** — monospace pole pro Markdown tělo sekce.
- **✓ Uložit sekci** — opustí edit-mode (změny se průběžně promítají do dat).
- **Stejné akce přesunu/přidání/smazání** plus čtyři ikonová tlačítka:

| Tlačítko | Funkce |
|---|---|
| ⬆️ | Přesunout sekci o jednu výš mezi sourozenci |
| ⬇️ | Přesunout sekci o jednu níž mezi sourozenci |
| ➡️ | Odsadit vpravo — udělá ze sekce poslední podsekci předcházejícího sourozence |
| ⬅️ | Předsadit vlevo — vytáhne sekci o úroveň výš (jen pokud má rodiče) |

Nově přidaná sekce dostane výchozí nadpis `✏️`, čímž se v rodiči započítá jako „rozpracovaná" (oranžový odznak).

### Sledování změn

Po načtení nebo uložení souboru se uloží snímek `originalData`. Dokud se neuloží znovu:

- Nové sekce mají nadpis i tělo obalené `<ins>` — zelený podklad.
- Pouze změněné nadpisy / těla mají vlastní `<ins>` s tooltipem „Změněný název" / „Změněný obsah".
- Pod sekcí se v odznaku 📊 ukazuje, kolik znaků a slov bylo přidáno.

Po stisku 💾 Uložit soubor nebo 🔗 Zkopírovat URL se snímek aktualizuje a značení se vynuluje.

### Izolace sekce (hoist)

Tlačítko **🔍 Izolovat** zobrazí jen vybranou sekci a její podsekce. Nahoře se objeví oranžový panel:

- *„Zobrazeno: «název» a podsekce"* s tlačítkem **↩️ Zobrazit vše**
- 📍 drobečková navigace přes všechny rodiče (klikatelnou) až k aktuální izolované sekci.

Kliknutí na předka v drobečce ho izoluje místo aktuální sekce. Export DOCX a kopie URL respektují izolaci — vyexportuje se jen viditelná podstrom.

---

## Markdown a rozšíření

Renderer marked.js je nakonfigurován s `breaks: true` (jednoduchý `Enter` = `<br>`) a `gfm: true` (GitHub Flavored Markdown). Odkazy se otevírají v novém okně (`target="_blank" rel="noopener noreferrer"`).

### Podporovaná syntaxe

| Konstrukce | Příklad | Výsledek |
|---|---|---|
| Nadpisy | `# Nadpis 1` až `###### Nadpis 6` | Strukturuje strom sekcí |
| Tučně / kurzíva | `**tučně**`, `*kurzíva*` | Standardní |
| Odkaz | `[text](https://…)` | Otevírá se v novém okně |
| Obrázek | `![alt](url)` | Vloží `<img>` |
| Kód inline | `` `kód` `` | Monospace blok |
| Kódový blok | ` ```jazyk … ``` ` | Předformátovaný blok |
| Seznam | `- položka`, `1. položka` | Standardní |
| Citace | `> citace` | Levý okraj s pruhem |
| Tabulka GFM | `\| a \| b \|` + `\|---\|---\|` | Standardní tabulka |
| Tabulka DokuWiki | `^ záhlaví ^` / `\| buňka \|` | Tabulka s modrým záhlavím |
| Úkol | `- [ ] otevřený`, `- [x] splněný` | Interaktivní checkbox |
| Tag | `#urgent`, `#česky` | Klikatelný filtr |
| Editor link | URL končící na `opml-editor.html`, `markdown-editor.html`, `json-editor.html` | Tlačítko „Otevřít v…" |

### CriticMarkup

Pro recenze a sledování návrhů změn nástroj podporuje syntaxi [CriticMarkup](http://criticmarkup.com/):

| Syntaxe | Význam | Zobrazení |
|---|---|---|
| `{++ přidaný text ++}` | Vložení | Zelený podklad, podtrženo |
| `{-- smazaný text --}` | Smazání | Růžový podklad, přeškrtnuto |
| `{~~ staré ~> nové ~~}` | Náhrada | Smazané + přidané vedle sebe |
| `{== zvýrazněný text ==}` | Zvýraznění | Žlutý podklad |
| `{>> komentář <<}` | Komentář | Modrý štítek s 💬 |

Stejné styly se přenášejí i do exportu DOCX.

### Hashtagy

Hashtag je `#` následované Unicode písmeny, číslicemi a podtržítkem (`#urgent`, `#česky-tag` ne, `#česky_tag` ano). Tagy jsou case-insensitive a sbírají se z nadpisů i těl všech sekcí. Kliknutí na tag aktivuje **filtr** — strom se omezí jen na sekce obsahující daný tag (modrý panel s **❌ Zrušit filtr**). U každého tagu v nadpisu/těle je drobné 🗑️ pro odstranění jen toho konkrétního výskytu.

### Úkoly (task lists)

Checkboxy `- [ ]` / `- [x]` jsou interaktivní — kliknutím se přepíná stav v původním Markdownu. Nástroj sám počítá souhrn všech úkolů v sekci a jejích potomcích a ukazuje zelený odznak s procentem. Tlačítko **🗑️ Odstranit hotové úkoly** vyřadí z těla všechny řádky se splněnými úkoly.

---

## Náhled dokumentu

Stiskem **👁️ Náhled dokumentu** se přes celou obrazovku otevře čistý HTML render celého dokumentu (postupně po sekcích, dle úrovní). Náhled respektuje CriticMarkup, DokuWiki tabulky a klikatelné odkazy. Zavírá se tlačítkem **✕ Zavřít** nebo klávesou `Escape`.

---

## Prezentační režim

Spouští se tlačítkem **🎬 Prezentovat** u libovolné sekce, která má alespoň jednu podsekci. Sekce sama se stane *úvodním snímkem*, podsekce a jejich potomci jsou další snímky.

- **Sekce bez obsahu, ale s podsekcemi** se zobrazí jako velký centrovaný oddělovací snímek („section slide").
- **Sekce s obsahem** se vykreslí jako snímek s nadpisem a tělem; přímí potomci se přidají jako bullet list.

### Ovládání

| Klávesa | Akce |
|---|---|
| `→`, `Space`, `PageDown` | Další snímek |
| `←`, `PageUp` | Předchozí snímek |
| `Home` | První snímek |
| `End` | Poslední snímek |
| `O` | Přepnout přehled / snímek |
| `Esc` | Zavřít prezentaci (z přehledu se vrátí do prezentace) |

Horní lišta obsahuje:

- 🕒 **Časomíra** — měří uplynulý čas od startu (formát `m:ss` nebo `h:mm:ss`).
- **← Předchozí / Další →** — navigace tlačítky.
- **N / M** — pořadové číslo snímku.
- **📋 Přehled** — mřížka miniatur snímků; kliknutím na miniaturu se přejde na snímek.
- **✕ Ukončit prezentaci** — návrat do editoru.

---

## Sdílení a vkládání

### Sdílení odkazem (`?md=…`)

Tlačítko **🔗 Zkopírovat URL** vygeneruje URL ve tvaru:

```
https://egdilna.github.io/nastroje/markdown?md=<BASE64-URL-SAFE>
```

Celý Markdown je zakódován do URL pomocí URL-safe Base64 (`+` → `-`, `/` → `_`, bez `=` paddingu) s plnou podporou UTF-8 (TextEncoder). Při otevření URL nástroj dokument automaticky dekóduje a načte. Užitečné pro sdílení malých až středně velkých dokumentů (URL mají v praxi limit cca 8 KB v některých prostředích, většina prohlížečů zvládá podstatně víc).

### Režim pouze pro čtení (`?v`)

Přidáním parametru `&v` (např. `?md=…&v`) se zapne *view-only* režim — toolbar se redukuje na náhled a hledání, sekce nemají editační tlačítka. Vhodné pro sdílení dokumentu jako čistý dokument k přečtení.

### Integrace s DokuWiki

Pokud je nástroj otevřen jako popup z DokuWiki stránky (`window.opener` je dostupné), poslouchá `message` událost typu `loadData` (přijme JSON strom sekcí v Base64) a tlačítko *Uložit do Wiki* (skryté, aktivuje DokuWiki plugin) pošle data zpět přes `postMessage` s `type: 'saveData'`.

---

## Export DOCX

Tlačítko **📝 Export DOCX** sestaví HTML dokument ze všech viditelných sekcí (respektuje izolaci, filtr tagů i hledání) a převede ho do `.docx` knihovnou [html-docx-js](https://github.com/evidenceprime/html-docx-js). Styly:

- Nadpisy `h1`–`h6` mají sestupnou velikost 24–10 pt.
- Tabulky mají černé ohraničení, šedé záhlaví.
- CriticMarkup značky se přenesou jako barevné `<ins>`, `<del>`, `<mark>` a komentáře.
- Soubor se pojmenuje podle původního Markdownu (`*.md` → `*.docx`), případně `document.docx`.

---

## Klávesové zkratky

### Editor (přístupové klávesy `accesskey`)

| Zkratka | Akce |
|---|---|
| `Alt+S` | Uložit soubor |
| `Alt+C` | Kopírovat Markdown do schránky |
| `Alt+E` | Rozbalit vše |
| `Alt+W` | Sbalit vše |

> Na různých prohlížečích se prefix pro `accesskey` liší: v Chrome/Edge na Windows je to `Alt`, na macOS `Control+Option`, ve Firefoxu `Alt+Shift`.

### Dialogy a náhled

| Zkratka | Akce |
|---|---|
| `Enter` v poli hledání | Spustí filtrování |
| `Esc` | Zavře náhled / dialog vložení / prezentaci |

### Prezentace

Viz tabulka v sekci [Prezentační režim](#prezentační-režim) výše.

---

## URL parametry

| Parametr | Význam |
|---|---|
| `?md=<base64>` | Načte dokument zakódovaný v URL-safe Base64 (UTF-8) |
| `?v` | Zapne režim pouze pro čtení (lze kombinovat s `md`, např. `?md=…&v`) |

---

## Technické informace

- **Jediný HTML soubor** — `index.html` (cca 3 871 řádků), bez backendu.
- **Externí závislosti** — knihovny [marked.js](https://marked.js.org/) (Markdown render) a [html-docx-js](https://github.com/evidenceprime/html-docx-js) (export DOCX) se načítají z CDN. Pro offline použití je třeba si je stáhnout vedle souboru.
- **Ukládání souborů** — preferuje moderní `window.showSaveFilePicker` (Chrome, Edge, Opera), s fallbackem na vytvoření `<a download>` a stažení do složky Downloads.
- **Ukládání nastavení** — `localStorage`, klíč `markdown-editor-language` (hodnoty `cs`, `en`).
- **Datová struktura** — vnitřní reprezentace je strom objektů `{id, level, heading, body, collapsed, contentCollapsed, children}`; při uložení se generuje zpět Markdown s `#` prefixy dle `level` a prázdnými řádky mezi nadpisy a tělem.
- **Detekce jazyka** — automaticky podle `navigator.language`, výchozí čeština; volba se ukládá lokálně.
- **Přístupnost** — ARIA atributy na všech interaktivních prvcích, focus-outline 3 px (oranžový), `aria-live` regiony pro dynamické zprávy, semantické `<article>`, `<main>`, `<header>`.
- **Privátnost** — žádná data neopouštějí prohlížeč. Sdílení odkazem je čistě klientské (Base64 v URL), žádný server.
