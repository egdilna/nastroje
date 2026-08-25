# CLAUDE.md — Virtuální pracovní prostředí (EGdílna)

Pokyny pro práci na tomto projektu. Přečti celý soubor před první změnou.

---

## 1. Co to je

Jednosouborová webová aplikace `prostredi.html` — osobní „virtuální operační systém":
plochy s dlaždicemi, plovoucí okna, boční panel, sada nástrojů. Slouží jako jednotné
rozhraní k ostatním aplikacím EGdílny (mrello, DMS, eSSL, PIM, RPP…), které se v něm
otevírají v oknech přes iframe.

**Autor a jediný uživatel:** Michal Rada. Prostředí je osobní nástroj, ne produkt —
upřednostňuj jeho konkrétní pracovní postupy před obecnou univerzálností.

---

## 2. Nepřekročitelná pravidla

Tato pravidla platí pro každou změnu. Porušení = vadné dodání.

1. **Jeden soubor.** Celá aplikace je jediné `.html` — HTML, CSS i JS uvnitř. Žádné
   externí skripty, styly, fonty, CDN ani build. Velikost a složitost nevadí.
2. **Žádné `position: fixed` ani `position: sticky`.** Rozvržení stojí na gridu a flexu;
   okna jsou `position: absolute` uvnitř `#okna`. Toto je tvrdý požadavek na přístupnost.
3. **Ladicí výstup nikdy do konzole.** Používej `log(zprava, detail)` — zobrazuje se
   v nástroji *Ladicí výpis*. `console.log` v kódu nesmí zůstat.
4. **Čeština všude.** UI, komentáře, názvy funkcí i proměnných. Anglicky jsou jen
   jazykové konstrukce a webová API.
5. **`node --check` před každým dodáním** (viz kapitola 12).
6. **Žádný předvyplněný obsah.** Prostředí startuje prázdné. Nevytvářej ukázkové
   dlaždice, poznámky ani „vzorové" plochy.
7. **`H1` je název obsahu, ne aplikace.** `#nazev-plochy` = název aktuální plochy.
8. **`aria-live` jen pro krátká potvrzení** — přes `hlas("Uloženo")`. Nikdy pro obsah,
   seznamy nebo dlouhé texty.
9. **Vizuální funkce mají vždy textovou alternativu.** Plocha má nástroj *Textový režim
   plochy* (vnořené `ul`). Když přidáš vizuální prvek, doplň i jeho textovou podobu.
10. **Nikdy `treeview`.** Hierarchie se dělá vnořenými `ul`/`li`.

---

## 3. Nasazení

Soubor patří na **`https://nastroje.egdilna.cz`**, vedle ostatních aplikací EGdílny.

Důvod je zásadní: aplikace otevřené v oknech běží ve `<iframe>`. Když prostředí běží
na stejné doméně jako ony, je iframe first-party a **sdílí jejich `localStorage`
i přihlášení**. Když poběží odjinud (`file://`, `egdilna.github.io`, jiná doména),
Safari (ITP) i Chrome (Storage Partitioning) přidělí vloženému webu oddělené prázdné
úložiště a aplikace se budou ptát znovu. Přesměrování nestačí — rozhoduje adresa
v adresním řádku.

---

## 4. Struktura souboru

Pořadí sekcí v `prostredi.html`:

```
<style>        CSS proměnné → kostra → panel → plocha → dlaždice → okna →
               formuláře → paleta → oznámení → media queries
<body>         #os > nav#sidebar + main#plocha (+ #paleta, #oznameni)
<script>
  pomůcky              $ $$ id esc el dnes cas bezDiakritiky
  nabídky a lišty      ozivitMenu ozivitListu nabidkaTlacitko polozkaMenu
  ladicí výpis         LOG log hlas
  výchozí stav         VYCHOZI_BARVY POPISY_BAREV MOTIVY novyStav S
  typy objektů         TYPY SKUPINY RYCHLE_TVORBA VYCHOZI_NASTROJE zapnuty
  úložiště             KLIC ulozitKonfiguraci ulozit nacist prevzitStav
  vzhled               pouzitVzhled
  markdown             md
  štítky               klicStitku seznamStitku pridatStitek … editorStitku
  objekty              objekt naPlose vsePlose deti vytvorit smazat zmena nahled
  plocha               kreslitPlochu sousedniDlazdice prepnoutFokus seznamPloch
  panel                kreslitPanel
  okna                 otevritOkno zavritOkno doPredu minimalizovat maximalizovat
                       izolovatMaximalizovane ukotvit tahat
  editory              otevritObjekt oknoObjektu zobrazeni editor hlavicka
                       akceDlazdice maZobrazeni prepnoutRezimOkna
  dialogy              stahnout prejmenovat nabidkaDlazdice vzhledDlazdice
                       presunNaPlochu otevritSlozku spustitSezeni upravitPlochu
                       zalozit novaAplikace nastaveniAplikace novaDlazdice
  podpora nástrojů     PRAMENY PREDPISY citace* | SIF_* sif* | tab* | GLOSAR_UKAZKA
                       text* (textTypografie textZPdf textExtrahuj …) | QR_* qr*
  nástroje             NASTROJE = { … } + Object.assign(NASTROJE, { … })
  nastavení            nastaveniOkno novaPlocha spravaStitku
  GitHub               stav* gh* kUlozeni githubOkno
  paleta               prikazy otevritPaletu filtrPalety kreslitPaletu
  systém               rozlozitOkna prepnoutPanel dalsiOkno dalsiPlocha otevritNabidku
  klávesnice + start
```

---

## 5. Datový model

Celý stav je jediný objekt `S` (viz `novyStav()`):

```js
S = {
  verze, nazvy{}, vzhled{barvy{}, radius*, pismo, velikost, mezera, radaVyska,
  vzorTecek, panelStav}, chovani{…, otviratKeCteni}, nastroje{klic:bool}|null, stitkyBarvy{},
  github{repo,vetev,cesta,token,autoUlozit}, plochy[], aktivni,
  objekty[], kos[], schranka[], pripominky[], zapisnik, navyky[],
  mereni{zaznamy[],bezi}, sablony[], glosar[], citace[], zmeneno
}

`glosar[]` a `citace[]` jsou **jen pozůstatek po starším uspořádání**. Obojí dnes žije
v dlaždicích (typy `slovnik` a `sbirka`); `prenestSbirkyDoDlazdic()` obsah při načtení
prostředí přesype do dlaždic a pole vyprázdní. Nová data se do nich nikdy nezapisují.
```

Objekt (dlaždice):

```js
{ id, typ, nazev, ikona, barva, plocha, rodic, poradi, w, h,
  stitky[], obsah{}, vytvoreno, zmeneno }
```

- `rodic` = id složky, nebo `null` pro dlaždici ležící přímo na ploše.
  `naPlose(p)` vrací jen kořenové dlaždice, `deti(id)` obsah složky,
  `vsePlose(p)` všechno včetně obsahu složek.
- Tvar `obsah` určuje `vychoziObsah(typ)`. Typy jsou v `TYPY`
  (`{n, i, b, sk}` = název, ikona, barva, skupina).

### Sbírky v dlaždicích

Dlaždice `sbirka` (citace) a `slovnik` (pojmy) mají obsah `{ polozky: [] }`:

| Typ | Položka |
|---|---|
| `sbirka` | `{ id, typ, cislo, nazev, jednotka, cast, odst, pism, bod, veta, priloha, zneni, text, poznamka, zmeneno }` — celý formulář nástroje *Citace a odkazy*; `text` je doslovné znění ustanovení |
| `slovnik` | `{ id, pojem, vyklad, oblast, odkaz, zmeneno }` |

Citace se nikdy neukládá odvozená — skládá se až při vykreslení (`citaceVarianty()`),
takže změna sazby citací se projeví i zpětně na starých záznamech.

Nástroje *Citace a odkazy* a *Glosář pojmů* nad těmito dlaždicemi pracují **napříč
všemi** (`polozkyTypu(typ)` vrací `{o, p}`, tedy dlaždici a položku) a nové položky
ukládají do dlaždice zvolené v `vyberDlazdice()`; když žádná neexistuje, první uložení
ji založí (`cilovaDlazdice()`). Nástroj je tedy nad daty, ne jejich vlastníkem —
jediné úložiště je plocha.

Import a export mají obě sbírky společný: `citaceDoTabulky` / `citaceZTabulky`
a `slovnikDoTabulky` / `slovnikZTabulky` převádějí mezi položkami a mřížkou,
`tabDoCsv()` z tabulkového převodníku z ní udělá CSV i TSV, `nactiZeSouboru()`
přečte JSON, CSV i TSV a formát pozná sám. Sloupce citací jsou navržené tak,
aby přežily kolečko export → import; sloupec *Citace* je jen pro čtení,
data nesou strukturované sloupce.

---

## 6. Úložiště — jen GitHub

**Do `localStorage` se ukládá výhradně přístup k repozitáři** (`{github:{…}}` pod
klíčem `prostredi-konfigurace-v1`). Žádná uživatelská data. Nezaváděj zpět ukládání
stavu do prohlížeče — bylo odstraněno kvůli kvótě a limitům na velikost souborů.

Tok:

- `ulozit()` — označí stav jako nesynchronizovaný, uloží konfiguraci, naplánuje commit.
  Volej po **každé** změně dat.
- `naplanovatSync()` — commit 8 s po poslední změně; dále při skrytí karty,
  při zavření a pojistkou každé 2 minuty.
- `ghUlozit(tise)` / `ghNacist()` — Contents API, `ghSha` se drží v paměti.
- `kUlozeni()` — serializace **bez sekce `github`**. Token se do repozitáře nesmí
  dostat: GitHub takový commit odmítne ochranou proti únikům údajů a soubor pak vůbec
  nevznikne (tato chyba už jednou byla, nezaveď ji znovu).
- `prevzitStav(d)` — převezme data z GitHubu, ponechá místní přístupové údaje,
  provede migrace (sjednocení štítků, `rodic` u složek).
- 404 při načtení = soubor zatím neexistuje, **není to chyba nastavení**.

Ukazatel stavu je na dvou místech (`#stav-ulozeni` v patičce panelu,
`#stav-plocha` nad plochou), čas posledního uložení je relativní
(`relativne()`, `Intl.RelativeTimeFormat`), překresluje se **jednou za minutu**.

---

## 6b. Dlaždice: zobrazení a úpravy

Okno dlaždice staví `oknoObjektu()`. Nahoře je lišta (`role="toolbar"`) s přepínačem
režimu a nabídkou *Další akce*, pod ní obsah v jednom ze dvou režimů:

- **Zobrazení** (`zobrazeni()`) — výchozí. Obsah je sazba, ne formulář: text v odstavcích,
  Markdown vykreslený, kód v `<pre>`, tabulka jako tabulka, odkazy jako odkazy.
  **Činné zůstává to, co je práce s obsahem, ne jeho úprava** — zaškrtávátka
  v kontrolním seznamu a úkolech, otevírání odkazů, tlačítka počítadla. Vše ostatní
  (přejmenování, mazání položek, termíny, priority) je až v úpravách.
- **Úpravy** (`editor()`) — dosavadní editor se všemi poli včetně názvu a štítků.

Přepíná se tlačítkem v liště, klávesou **F4** nebo příkazem v paletě
(`prepnoutRezimOkna()` hledá `[data-prepinac-rezimu]` v aktivním okně).
Výchozí režim řídí `S.chovani.otviratKeCteni` (*Nastavení → Chování*).
`BEZ_ZOBRAZENI` vyjmenovává typy, které režim nemají: aplikace a odkaz jsou samy
o sobě zobrazením, složka a sezení se do editoru vůbec nedostanou.

Nový typ dlaždice proto potřebuje **tři** větve: `case` v `editor()`, `case`
v `zobrazeni()` a `case` v `nahled()` pro náhled na ploše. Když větev v zobrazení
chybí, ukáže se hláška o režimu úprav.

---

## 7. Okna

```js
otevritOkno({ klic, nazev, ikona, sirka, vyska, bezokraje, escZavre, obsah })
```

- `klic` je jedinečný identifikátor; druhé volání se stejným klíčem okno jen vytáhne
  do popředí. Konvence: `obj-<id>`, `n-<nastroj>`, `nastaveni-app-<id>`.
- `obsah` je funkce `(telo, okno) => {}`.
- Okno je `<article>` s `aria-labelledby` na vlastní `<h5>` — **není to `role="dialog"`**.
  `h5` je zvolené záměrně, aby šlo mezi okny skákat klávesou pro nadpisy a nekolidovalo
  to s `h1` plochy, `h2` sekcí panelu a `h3` uvnitř nástrojů.
- Pod 620 px šířky se okna otevírají přes celou plochu.
- **Escape v okně okno minimalizuje**, nezavírá ho — obsah i rozdělaná práce zůstávají
  a okno se vrátí kliknutím v bočním panelu (sekce *Okna*) nebo příkazem
  *Zobrazit skrytá okna*. Zavírá se jen křížkem v liště okna.
- `escZavre:true` je výjimka pro nabídky a krátké dialogy (`nabidka-*`, `nova`,
  `presun-*`, `vzhled-*`, `plocha-*`, `nastaveni-app-*`, `seznam-ploch`), kde Escape
  znamená „zrušit" — ty se zavírají. Nové okno s trvalým obsahem příznak nedostává.
- Protože `.okno.min` je `display:none`, `minimalizovat()` odvede fokus ven
  (`fokusPoMinimalizaci()`: položka okna v panelu → jiné otevřené okno → dlaždice).

**Maximalizace = režim jednoho okna.** `maximalizovat()` + `izolovatMaximalizovane()`
nastaví bočnímu panelu, liště, mřížce dlaždic i ostatním oknům `inert` a `aria-hidden`
a přidá `#os.jenokno`. Pro odečítač i tabulátor zbyde jen to jedno okno. Režim se ruší
obnovením velikosti, minimalizací, zavřením, uspořádáním oken i otevřením nového okna.
**Když měníš cokoli kolem oken, volej `izolovatMaximalizovane()`.**

`#sidebar` a `#plocha` mají v mřížce `#os` napevno `grid-column:1` a `grid-column:2`.
Bez toho by se plocha při skrytém panelu (`sidebar.hidden`, i režim jednoho okna) přesunula
do sloupce `auto`, zúžila se na šířku obsahu a maximalizované okno by byl jen pruh vlevo.

---

## 8. Nástroje

Registr `NASTROJE` — položka `{ n, i, b, w, v, f, skryt }` (název, ikona, barva,
šířka, výška, render funkce, skrytí ze seznamu). Nový nástroj:

1. Přidej do `Object.assign(NASTROJE, { … })` v sekci rozšiřujících nástrojů.
2. `f: (telo, okno) => { … }` staví obsah přes `el()`.
3. Nezapisuj do `VYCHOZI_NASTROJE`, pokud nejde o jádrovou funkci — uživatel si nástroj
   zapne v *Nastavení → Nástroje* (`zapnuty(klic)`).
4. Vypnuté nástroje se neukazují v panelu ani v paletě.

`nastaveni` a `napoveda` mají `skryt: true` — jsou trvale v patičce panelu.

### Podpora nástrojů

Delší logika nástrojů žije v samostatných funkcích nad registrem, ne v `f()`:

| Oblast | Funkce | Poznámka |
|---|---|---|
| Citace | `citacePrazdna` `citaceUstanoveni` `citacePramen` `citaceVarianty` `citaceOdkaz` `citaceNormalizuj` `citaceNajdi` | `PRAMENY` = typy pramenů se skloňováním, `PREDPISY` = našeptávání názvů; `citaceVarianty` vrací dvojice [popis, text] a přidává šablony se zněním, pokud je vyplněné |
| Šifrování | `sifKlic` `sifZasifruj` `sifDesifruj` | AES-256-GCM, PBKDF2 (210 000 iterací), formát `MROS-AES-GCM-1:` + base64(sůl 16 B \| IV 12 B \| šifra) |
| Tabulky | `tabNacti` `tabZCsv` `tabZMarkdownu` `tabZJson` `tabZHtml` `tabDo*` `tabTransponuj` | `tabNacti` rozpozná formát vstupu sám |
| Text | `textTypografie` `textZPdf` `textNeviditelne` `textZalomit` `textExtrahuj` `textFrekvence` `textCtivost` `textMnozina` `textVety` `textSpojitOdstavce` | čisté funkce text → text, jdou použít i jinde |
| QR | `qrMatice` `qrSvg` `qrIban` | vlastní kodér podle ISO/IEC 18004 |

**QR kodér** umí režim bajtů (UTF-8), verze 1–40 a všechny čtyři úrovně opravy.
`QR_ECC` a `QR_BLOKY` jsou tabulky ze standardu, zbytek se počítá:
`qrSurove()` (počet datových modulů), `qrZarovnani()` (zarovnávací značky),
Reed–Solomon nad GF(256) s generátorem 0x11D, výběr masky podle penalizace.
Výstup je bit po bitu shodný s knihovnou `qrcode` — při zásahu do kodéru se to dá
znovu ověřit porovnáním matic. `qrIban()` skládá IBAN z tuzemského čísla účtu
(kontrolní číslice mod 97), používá ho šablona QR platby (SPAYD).

**Nezlomitelné mezery a jiné neviditelné znaky** patří do zdrojového kódu jen jako
`\u00a0`, nikdy doslova — jinak se nedají v kódu odlišit od obyčejné mezery a tiše
rozbijí regulární výrazy.

---

## 9. Přístupnost — použité vzory

| Prvek | Sémantika |
|---|---|
| Boční panel | `nav` > sekce s `h2` + `ul`/`li` |
| Hlavní nabídka (Ctrl+F10), nabídka dlaždice, „Další akce ▾" | `role="menu"` + `menuitem`, `ozivitMenu()` |
| Lišta okna aplikace, ovládání okna, akce plochy, patička | `role="toolbar"`, `ozivitListu()` |
| Okno | `article` + `aria-labelledby` → `h5` |
| Dlaždice | `div role="button"`, `aria-label` = **typ, pak název**, pak štítky |
| Paleta příkazů | `role="dialog" aria-modal` (jediné modální místo) |
| Přepínače velikosti dlaždice | tlačítka s `aria-pressed` v `role="group"` |

`ozivitMenu()` řeší šipky, Home/End, hledání podle prvního písmene a roving tabindex.
`ozivitListu()` řeší šipky doleva/doprava a jediný vstup tabulátorem.
`nabidkaTlacitko()` je rozbalovací nabídka s `aria-haspopup`/`aria-expanded`,
Escape zavírá jen nabídku a vrací fokus na tlačítko.

Skrytí panelu se dělá atributem `hidden` (ne `width:0`) — jinak zůstane v přístupnostním
stromu. Fokus se před skrytím přesune na tlačítko pro zobrazení.

Šipky na ploše hledají nejbližší dlaždici geometricky (`sousedniDlazdice()`), ne podle
pořadí v DOM, kvůli různě velkým dlaždicím.

---

## 10. Klávesové zkratky

Zásada: **jen funkční klávesy**, žádné kombinace kolidující s prohlížečem, žádné
Alt+číslo ani Ctrl+písmeno. Vše ostatní jde přes paletu a nabídku.

| Klávesa | Akce |
|---|---|
| F1 | paleta příkazů (druhá zkratka Ctrl+Shift+P) |
| Shift+F1 | nápověda a zkratky |
| Ctrl+F10 | hlavní nabídka (samotné F10 zůstává volné pro aplikace v oknech) |
| F9 / Shift+F9 | skok do panelu a zpět / sbalit a rozbalit panel |
| F8 / Shift+F8 | další plocha / seznam ploch |
| Ctrl+F6 / Ctrl+Shift+F6 | další a předchozí otevřené okno (v maximalizovaném režimu přepíná celoobrazovkově) |
| F2 | přejmenovat vybranou dlaždici |
| F4 | přepnout okno dlaždice mezi zobrazením a úpravami |
| šipky, Home, End | pohyb mezi dlaždicemi |
| Enter, mezerník | otevřít dlaždici |
| Alt+Enter | nabídka dlaždice |
| Delete | do koše |
| Ctrl+←/→ | změna pořadí dlaždice |
| Ctrl+Alt+šipky | ukotvení okna k okraji |
| Escape | minimalizovat okno do panelu; v nabídce, dialogu a paletě zavřít |

Novou zkratku přidej na **tři** místa: obsluha v `document.addEventListener("keydown")`,
seznam v nástroji `napoveda`, popisky v `prikazy()` a `otevritNabidku()`.

---

## 11. Vzhled

Všechny barvy a tvary jsou CSS proměnné na `:root`, nastavované v `pouzitVzhled()`
z `S.vzhled`. Uživatel si v *Nastavení → Barvy* mění všech 15 barev jednotlivě nebo
volí z `MOTIVY`. Nikdy nepiš barvu natvrdo do CSS pravidla — použij proměnnou nebo
`color-mix()` nad ní.

Vizuální jazyk: velké zaoblení, kulatá tlačítka, měkké stíny, barevné emoji ikony
v kulatých polích, gradientní pozadí plochy. Držet.

---

## 12. Postup práce a kontrola

```bash
# kontrola syntaxe JS uvnitř HTML — povinná před každým dodáním
sed -n '/^<script>/,/^<\/script>/p' prostredi.html | sed '1d;$d' > /tmp/k.js
node --check /tmp/k.js
```

Dále ověř ručně:

- žádné `position:fixed|sticky`, žádné `console.`
- nové ovládací prvky mají přístupný název i v režimu „jen ikony"
- práce s okny volá `izolovatMaximalizovane()`
- každá změna dat volá `ulozit()`
- v Safari (iPad) se plocha nikde neskrývá a okna jdou otevřít

Preferuj cílené úpravy existujících funkcí před přepisem celých bloků — soubor má přes
2 300 řádků a je hustý.

---

## 13. Chyby, které už jednou byly

Nezaváděj je znovu:

- `sandbox` na iframu aplikací → rozbije jim `localStorage` a přihlášení.
  Sandbox jen když má objekt `obsah.izolovat`.
- Token v souboru ukládaném do GitHubu → commit odmítnut, soubor nevznikne.
- `display:none` na ploše pod 720 px → viditelný byl jen panel a nešlo nic otevřít.
- Skrývání panelu přes `width:0` → odečítač ho dál viděl.
- Porovnávání štítků jako přesných řetězců → duplicity „test" / „Test".
  Vždy přes `klicStitku()`.
- Ukládání celého stavu do `localStorage` → přeplněná kvóta.
- Zkratky kolidující s prohlížečem (Ctrl+K, Ctrl+B, Ctrl+F, Ctrl+S, Alt+číslo, F4).

---

## 14. Kam dál

Neuzavřené nápady z návrhu, které zatím nejsou hotové:

- meziaplikační protokol přes `postMessage` (předání kontextu a tokenu vlastním
  aplikacím EGdílny, „poslat na plochu jako poznámku")
- vlastní odkazy mezi objekty (`mros://open?id=…`) a zpětné odkazy mezi poznámkami
- uživatelské skripty a makra jako objekty, spouštěné z palety nebo časovačem
- chytré složky (uložené filtry nad štítky a typy)
- historie verzí prostředí čtená z commitů GitHubu
- více repozitářů jako samostatné „disky"
