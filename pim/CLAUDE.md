# CLAUDE.md — PIM (osobní znalostní báze)

## Co to je
Největší nástroj repozitáře: jednosouborová **osobní znalostní báze / manažer informací**
(`index.html`, **~41 860 řádků, ~2 MB, přes 900 top-level funkcí**). Entity s aspekty, vazby,
Markdown obsah s wiki odkazy a includy, úkoly, projekty a plány, deník, databáze, dokumenty,
přílohy, šifrované atributy, statický prohlížeč, publikace webu a synchronizace s GitHubem.

Autor tímto nástrojem **spravuje a pushuje i tento web** (`website.md`, `sidebar.md`,
`cs.json`, `index.html` v kořeni repozitáře). Změna v PIM se tedy může projevit i na provozu
webu EGdílny.

Uživatelská dokumentace: `docs-cs.md` (31 kB) a `docs-en.md` — aktualizuj je se změnou chování.

## Než začneš: v souboru je i šablona offline prohlížeče
PIM umí ze svých dat vygenerovat **samostatný offline prohlížeč** — jednosouborovou HTML
stránku, kterou lze rozdat nebo publikovat a která data jen zobrazuje (needituje, neukládá,
nesynchronizuje). Předloha tohoto prohlížeče je uložená přímo v souboru jako konstanta
`STATIC_VIEWER_TEMPLATE`:

| Rozsah | Co to je |
|---|---|
| ř. 1643–27670 | živá aplikace — **sem patří změny funkčnosti** |
| ř. 27671–36266 | `STATIC_VIEWER_TEMPLATE` — šablona generovaného prohlížeče (template literál) s místy `__VIEWER_EXTRA__` a `__PIM_DATA_PLACEHOLDER__` |
| ř. 36268+ | `sanitizeDbForStaticViewer()` a zbytek aplikace |
| ř. 36342+ | `VIEWER_EXTRA_JS` — doplňkový kód prohlížeče jako **escapovaný řetězec** |

Prohlížeč **není celá aplikace**: editační cesty, ukládání, GitHub modul i další funkce jsou
v něm vypuštěné (`GITHUB MODUL (stripped in viewer)`, `window.__VIEWER_MODE = true`, `save()`
přepsané na no-op). Je to samostatná, zjednodušená zobrazovací vrstva nad stejnými daty.

Prakticky to ale znamená, že **zobrazovací kód existuje na dvou místech** a leccos se musí
upravit v obou. Týká se to všeho, co prohlížeč umí taky ukázat — render Markdownu, wiki odkazy,
status chipy, database includy, pohledy nad daty (Úkoly, Kalendář, Hledání, Vazby, Tagy,
Vlastní pohledy, Šablony, Detail, Outline), definice v `ASPECTS`, `GLOBAL_FIELDS` a podobné
konstanty. Proto grep na `const ASPECTS`, `VIEW: ÚKOLY` a spol. vrací **dva výskyty** —
vždy si ověř, ve které části jsi, a u sdílené funkčnosti uprav obě. Jinak se vygenerovaný
prohlížeč rozejde s aplikací a data se v něm zobrazí jinak (nebo vůbec).

Naopak čistě editační funkce do šablony nepatří — nepřenášej je tam jen kvůli symetrii.
Živý příklad obojího: přechod nadpisů v řádcích entit z `h5` na `h6` (`.entity-row-heading`)
se musel udělat na **13 místech v aplikaci i 5 místech v šabloně**, zatímco pohled
Připomenutí (viz níže) zůstal jen v aplikaci.

Řádková čísla v tabulce jsou orientační — soubor roste. Hranice si vždy ověř
(`grep -n "const STATIC_VIEWER_TEMPLATE\|const VIEWER_EXTRA_JS\|sanitizeDbForStaticViewer" pim/index.html`).

Uvnitř šablony platí zvláštní zápis: `</script>` se píše jako `<\/script>`, zpětné apostrofy
a `${` se musí escapovat a ve `VIEWER_EXTRA_JS` (běžný řetězec, ne template literál) jsou
zdvojená zpětná lomítka. Chyba v escapování se projeví až ve vygenerovaném souboru, ne při
načtení PIM — proto je generování prohlížeče povinný test.

`sanitizeDbForStaticViewer(filterTags, opts)` připravuje data pro prohlížeč: dělá hlubokou
kopii, odstraňuje GitHub metadata a citlivé věci a umí filtrovat podle tagů. **Při přidání
nového pole do dat rozhodni, zda do prohlížeče patří** — všechno, co tudy projde, se dostane
ven k příjemci vygenerovaného souboru.

## Paleta příkazů
Paleta (`F1`, `Ctrl+Shift+P`, tlačítko `#btn-palette`) je v aplikaci **jediné místo, kde se
příkazy sbíhají**. Žije v bloku `==== PALETA PŘÍKAZŮ ====` hned nad `buildMenuModel()`.

Dvě pravidla, která se nesmí porušit:

1. **Seznam příkazů se staví až při otevření** (`paletaSestavPrikazy()`), ne jako konstanta.
   Je kontextový — v detailu nabízí akce nad entitou, v seznamu nad seznamem, a skrývá to,
   co nedává smysl (GitHub bez konfigurace, AI bez klíče). Nová akce v aplikaci patří
   i sem; paleta je to, kde ji uživatel bude hledat.
2. **Vykresluje se nejvýš `PALETA_MAX_VYSLEDKU` položek.** Entit můžou být tisíce
   a `paletaSestavEntity()` je proto normalizuje jednou při otevření, ne při každém stisku.

Hledání je bez diakritiky a velikosti písmen (`paletaNorm`), víc slov je AND. Předpony
`>` (příkazy), `@` (entity), `#` (tagy) zúží rozsah. Při shodném skóre rozhoduje `_poradi`,
tedy pořadí deklarace — labely začínají emoji, takže abecední řazení dává nesmysly.

Prázdná paleta schválně nevypisuje celý katalog, jen `zakladni: true` pohledy, kontextové
akce a posledních `PALETA_NEDAVNYCH` změněných entit.

Paleta je **jen v aplikaci, ne v šabloně prohlížeče** — většina jejích příkazů edituje.

## Jeden parser dat a pravidlo úkol / událost

`natlangParseDateInText(text)` je **jediný parser dat v aplikaci**. `parseTaskDateFromTitle()`
je jen tenký obal nad ním (vrátí datum bez času). Dřív to byly dvě nezávislé
implementace, které se lišily: jedna uměla holý den v týdnu a neuměla čas, druhá
chtěla předložku — a „ve středu" neuměla ani jedna, takže „schůzka ve středu ráno"
tiše naplánovala na **dnešek**. Třetí parser nepiš.

Parser vrací `{ datum, cas, casKonec, casNepresny, iso, cleaned, cleanedDatum, popis }`.
Dvě pole na čištění názvu schválně: **kdo čas neukládá, nesmí ho z názvu vyříznout**
(`cleanedDatum`), jinak se informace ztratí. Termín úkolu je typu `date`, takže
úkol používá `cleanedDatum`.

Pravidlo, podle kterého se při zakládání z názvu rozhoduje typ entity, žije na
jednom místě — v `createQuickTaskFromText()`:

| Rozpoznáno | Vznikne |
|---|---|
| jen den | `Task`, `deadline` = datum |
| den + `cas` | `Event`, `start`, `end` = start + `VYCHOZI_DELKA_UDALOSTI` |
| den + `cas` + `casKonec` | `Event` s tím rozsahem |

Platí to **jen tam, kde aspekt nevybírá uživatel**. Kde si aspekt vybral (+ Nová entita v navigaci, u projektu i u schůzky), doplní datum `doplnDatumZNazvuPodleAspektu()` podle zvoleného aspektu: Úkol → `deadline`, Událost → `start`/`end`, ostatní nic a název zůstane celý. Zapisuje **jen do prázdného pole**, takže se dá volat opakovaně a entitě, která termín už má, nic nepřepíše.

**Nová cesta, kterou jde založit entitu, musí jednu z těch dvou funkcí zavolat.**
Dvakrát se na tom uklouzlo: nejdřív „+ Nová entita" u projektu a schůzky parser
vůbec nevolala, potom se ukázalo, že **tlačítko Hotovo mělo vlastní kopii pravidla**,
která umí jen Úkol a `deadline` — událost s časem v názvu tudy projela bez začátku
a konce. Kopie pravidla je horší než žádná: vypadá, že to funguje. U „+ Nová entita"
se název píše do editoru, takže datum doplní až ukončení editace — tlačítko Hotovo
i `ukonciEditaciEntity()` (Escape, klávesa U) volají tutéž funkci.

Rychlé přidání úkolu u projektu i u schůzky jede přes týž
`createQuickTaskFromText()` — jedno místo, jedno pravidlo.

### Víc řádků v názvu = víc položek

`zalozZKazdehoRadku(text, zaloz)` zavolá `zaloz(radek, tiche)` pro každý
neprázdný řádek (`radkyNazvu()`). Používá to **všech pět formulářů rychlého
zakládání**: dialog Rychlý úkol, + Nový úkol a + Nová entita u projektu,
+ Přidat úkol a + Nová entita u schůzky. Entitu se zvoleným aspektem staví
`vytvorEntituZNazvu()` — jedna funkce místo dvou dřívějších kopií.

Tři věci, které to drží:

1. **Pole názvu musí být `<textarea>`, ne `<input type="text">`.** Input konce
   řádků zahazuje už při zápisu hodnoty (value sanitization v HTML), takže
   vložený víceřádkový text se v něm slije do jednoho a o víc řádcích by se
   nikdo nedozvěděl. Ověřeno měřením, ne odhadem.
2. **Jeden řádek se chová přesně jako dřív**, i s původní hláškou. Teprve u víc
   řádků se hlášky potlačí (`opts.tiche` u `createQuickTaskFromText()`) a dá se
   jeden souhrn (`hlaskaHromadne()`) — jinak by se po vložení deseti řádků přes
   sebe přelilo deset toastů a deset pípnutí.
3. **Vazby a tagy se každé entitě kopírují** (`links.map(l => ({...l}))`,
   `tags.slice()`). Sdílené pole mezi dvěma entitami je tichá chyba, která se
   projeví až při úpravě jedné z nich.

Řádek ještě projde `ocistiRadekNazvu()`: trim na obou koncích a dolů se značkou
seznamu (`- * + •`, `1.`, `2)`, `[ ]`, `[x]`), aby se vložený markdownový seznam
nemusel předem uklízet. Tři věci, které v té funkci nejsou libovolné:

- **Odrážka musí mít za sebou mezeru**, jinak by `-5 °C` přišlo o minus
  a `*tučně*` o hvězdičku.
- **Pořadové číslo se sundá jen tehdy, když za ním není datum.** `1. října`
  i `15. 3. 2027` jsou taky „číslo s tečkou" — bez té podmínky by se z `1. října
  odevzdat` stalo `října odevzdat` a termín by se tiše ztratil. Seznam měsíců je
  v `MESICE_PO_CISLE` **natvrdo, ne z `JOURNAL_MONTHS`**: ta konstanta se
  deklaruje o patnáct set řádků níž, takže by se regulární výraz vyhodnotil
  v její temporální mrtvé zóně a **celá aplikace by se nenačetla**. Na tom se
  jednou uklouzlo.
- **Odrážka se odřezává před zaškrtávátkem** — `- [ ] zavolat` je obojí najednou.

Název, který opravdu začíná pořadovým číslem (`2. kolo jednání`), o něj přijde;
je to zaplacená cena za vkládání seznamů a je tak popsaná i v dokumentaci.
Zaškrtnutí `[x]` se **nepřenáší do stavu** — vzniká úkol `todo` jako z každého
jiného řádku.

**Enter odesílá přes `napojEnterOdeslani(pole, odeslat)`** — jedno místo pro všech
pět formulářů. Dvě cesty schválně, každá chytá jinou klávesnici:

- `keydown` s `key === 'Enter'` je fyzická klávesnice. Shift se tam pozná, takže
  Shift+Enter řádek opravdu vloží.
- `beforeinput` s `insertLineBreak` / `insertParagraph` je softwarová klávesnice
  telefonu a tabletu, která u `<textarea>` **žádný `keydown` s Enter neposílá**.
  Dokud tu byl jen `keydown`, Enter na mobilu jen přidal řádek — u `<input>` přitom
  dřív formulář odesílal, takže přechod na textarea tuhle cestu tiše zrušil.

Shift+Enter se přes `beforeinput` nepozná (nemá `shiftKey`), proto si ho `keydown`
označí dopředu (`pole._zlomPovolen`) a `beforeinput` ten jeden zlom propustí.
`insertFromPaste` se nechytá — vkládání víc řádků ze schránky je celý smysl věci.
A protože Enter odesílá, **musí to být napsané u políčka**; je to v `<label>`
u všech pěti.

Hlídá to `pim/testy/vice-radku.mjs` (kanárek na entitu mimo hru).

Úplný seznam cest, kudy entita vzniká, a co u ní platí (vznikl auditem všech
volání `addEntity()` v aplikaci — hádat se to nedá):

| Cesta | Doplňuje datum | Čím |
|---|---|---|
| ✓ Rychlý úkol (dialog) | ano | `createQuickTaskFromText()` |
| + Nový úkol u projektu, ✓ Nový úkol u schůzky | ano | `createQuickTaskFromText()` |
| + Nová entita (navigace, paleta, menu, klávesa `n`) | ano, při ukončení editace | tlačítko Hotovo / `ukonciEditaciEntity()` |
| + Nová entita u projektu i u schůzky | ano | `doplnDatumZNazvuPodleAspektu()` |
| Vytvořit související entitu (`doCreateRelated`) | ano | `doplnDatumZNazvuPodleAspektu()` |
| Entita z vybraného textu (`doMdExtract`) | ano | `doplnDatumZNazvuPodleAspektu()` |
| → Entita z md úkolu (`attachMarkdownTaskHandlers`) | ano, vždy Task | `doplnDatumZNazvuPodleAspektu()` |
| Entita ze šablony (`instantiateTemplate`) | ano | `doplnDatumZNazvuPodleAspektu()` |
| Rychlé zachycení do Inboxu | **ne** — Poznámka nemá kam | — |
| Entita z wiki odkazu `[[Název]]` | ne — bez aspektu | — |
| Odpověď na otázku (aspekt Answer) | ne — aspekt termín nemá | — |
| AI „Jako nová entita" | ne — bez aspektu | — |
| Duplikace entity | ne — atributy se kopírují, pole nejsou prázdná | — |

**Cesty, které vkládají do textu wiki odkaz** (→ Entita z md úkolu, entita
z vybraného textu), musí datum doplnit **před** složením odkazu a odkaz postavit
z `e.title`, ne z původního názvu. Jinak odkaz míří na entitu, která se tak
nejmenuje — uklidili jsme jí název.

Dvě pasti:

- **Čas se počítá v místním čase.** `pricticMinut()` skládá výsledek z lokálních
  složek. `toISOString()` by posunul všechny události o posun zóny.
- **`casNepresny`** („ráno", „večer") **není začátek času.** Událost z něj nevzniká
  a z názvu se nevyřezává, protože se nikam neukládá.

Volnější vzory jen v kontextu: holý rozsah hodin (`10-12`) se bere **jen když už je
rozpoznaný den**, jinak by to chytalo „verze 2-3". Stejná logika u holé hodiny:
`v 9`, `ve 14`, `od 9` ano, samotné `9` ne — **předložka je podmínka**, bez ní by
čas vznikal z každého počtu v názvu („Kapitola 10 dopsat"). A koncová tečka čas
vylučuje, jinak by `v 1. kapitole` bylo 1:00.

Co parser umí, se rozhoduje podle toho, jak lidi termíny opravdu píšou. Druhý pád
dne v týdnu (`do pátku`, `od středy`) je nejčastější tvar vůbec a **dlouho chyběl**:
úkol zůstal bez termínu a u `udělat do pátku 10:00` se rozpoznal jen čas, takže
termín tiše sedl na **dnešek** — tatáž třída chyby jako dřív u „ve středu ráno".
Proto má tabulka `DNY` u každého dne i genitiv a prefix `PREDLOZKA` (`do|od|k|ke|na|v|ve`
plus volitelné `nejpozději`) je součástí vzoru, ne jen ozdoba: **vyřezává se spolu
s datem**, jinak v názvu zůstane viset „do".

Dál parser zná jména měsíců (`1. října`, `15. března 2027`), `do zítřka`,
`za týden` / `za 2 týdny` / `za měsíc`, `do konce týdne` (= nejbližší pátek)
a `do konce měsíce` (= poslední den měsíce).

Falešné nálezy jsou dražší než chybějící: `Revize smlouvy 2024`, `Verze 2-3`,
`Rozpočet na rok 2026` ani `Objednat 3 ks` nesmí dát datum. Na to je v sadě
vlastní blok a každý nový vzor jím musí projít.

Hlídá to `pim/testy/udalost-z-nazvu.mjs` a `pim/testy/termin-vsemi-cestami.mjs`.

## Samostatné okno: data se předávají mezi okny, nestahují znovu

Samostatné okno entity (`openEntityInStandaloneWindow`) je **plnohodnotná druhá
instance aplikace** — `window.open()` na týž `index.html` s `?detail=…&standalone=1`.
Data žijí jen v paměti a na GitHubu (`load()` z localStorage schválně nečte, `save()`
tam schválně nezapisuje — limit ~5 MB), takže nová instance neměla odkud vzít data
než ze sítě: stahovala celý soubor znovu a při nedostupné síti zůstala prázdná.

Teď si je vezme od okna, které ji otevřelo:

| Kde | Čím |
|---|---|
| start samostatného okna | `prevezmiDataZOtviracihoOkna()` ← `window.opener.__pimDejData()` |
| další změny v obou směrech | `BroadcastChannel`, zprávy `zmena` / `zadost` / `data` |

Pravidla, která se nesmí porušit:

1. **Předává se hluboká kopie, ne živý objekt.** Realm zavřeného okna umírá s ním
   a sdílené objekty by se staly nepoužitelnými.
2. **`syncPrevezmiData()` nesmí zavolat `save()`.** Přepsalo by `updated_at`
   a ohlásilo zpátky změnu, která žádná není — nekonečné ping-pong.
3. **Kanál se otevírá v `init()`, ne líně při prvním odeslání.** Okno, které zatím
   nic nezměnilo, musí zprávy druhého okna slyšet. Na tomhle to stálo: lazy kanál
   znamenal, že čerstvě otevřené samostatné okno neslyšelo nic.
4. **`getProjectKey()` normalizuje padding base64.** `updateUrlForState()` ukládá
   `?id=` bez `=` na konci, takže okno otevřené z ručně složeného odkazu drželo
   jiný klíč než okno po prvním překreslení — dvě jména téhož projektu a okna si
   nerozuměla. Klíč je zároveň jméno kanálu, takže na jeho stabilitě všechno visí.
5. **Okno v editaci data samo nepřevezme** (`syncMuzePrevzit()`: edit mód detailu,
   editace sekce, otevřený `<dialog>`). Ukáže pruh `showCrossTabBanner()`
   s tlačítkem, které převezme na výslovné přání (`_syncVynucenePrevzeti`).

Co to **neumí**: slučovat souběžné změny. Dvě změny ve dvou oknech během jedné
sekundy = vyhrává pozdější. Entitní merge by byl jiný řád práce; dokud není,
patří to do dokumentace jako mez, ne do kódu jako tichý předpoklad.

Na `file://` nefunguje ani `opener`, ani kanál (neprůhledný původ) — tam se okno
bez řečí vrátí k načtení z GitHubu. Proto sada `pim/testy/samostatne-okno.mjs`
jako jediná jezdí přes vlastní `http://` server.

Rozšifrovaný obsah zabezpečených entit v `db` není (žije v `_unlockedSecured`),
takže se předáním nepřenáší — nové okno si o heslo řekne samo. Kdo začne držet
citlivé věci v `db`, rozbije i tohle.

## Pojistka proti přepsání dat na GitHubu

`ghDataNactena()` je příznak „data v tomhle okně opravdu přišla z GitHubu".
Dokud je `false`, `GH.upload()` nenahraje **nic** (ani přílohy — kontrola je
schválně před jejich nahráním). Odemkne ho úspěšné načtení, 404 (soubor neexistuje,
není co ztratit), převzetí dat z druhého okna, nebo výslovné potvrzení uživatele.

Bez toho stačilo jedno neúspěšné načtení: okno zůstalo prázdné a autosave tím
prázdnem přepsal celý soubor. `GH.upload()` si navíc před zápisem vždycky dotáhne
aktuální `sha`, takže **žádná ochrana proti souběhu tu není** — kdo nahrává jako
druhý, prostě přepíše. Příznak je to jediné, co mezi tím stojí.

`upload(opts)` rozlišuje `opts.autosave`: autosave se nesmí ptát dialogem,
jen se zastaví a důvod napíše do **běžného stavového řádku** (`statusMsg`),
ne do nastavení GitHubu, které může být zavřené.

Hlídá to `pim/testy/samostatne-okno.mjs`.

## Dva lidé na jednom souboru: sloučení místo přepsání

`GH.upload()` posílá **`db.ghMeta.sha`, tedy verzi, ze které jsme vyšli** — ne tu
nejčerstvější. Právě tím GitHub pozná cizí zápis a odmítne ho (409, u chybějící sha 422).
Dřív se sha načítala těsně před zápisem, takže se ta ochrana zahazovala a poslední
uložení tiše přepsalo cizí práci. **Nikdy si sha nenačítej znovu jen proto, aby zápis
prošel** — tím se celá věc vypne.

Konflikt řeší `slucDb(zaklad, moje, jejich)` a zápis se zkusí znovu, nejvýš třikrát.
Základ drží `ghZaklad()` a **nastavuje se výhradně ze vzdáleného stavu**: po načtení,
po vlastním uložení (= co jsme odeslali), po sloučení (= `jejich`) a z okna, které data
předalo. Kdyby se do základu dostaly neodeslané lokální změny, sloučení by je vyhodnotilo
jako „tohle druhý smazal" a tiše je zahodilo.

Pravidla, která se nesmí porušit:

1. **Vazba se pozná dvojicí `(type, to)`**, ne indexem ani id — dvě různé nové vazby téže
   entity by se jinak hlásily jako spor. Proto `slucEntitu` vazby řeší sám a `slucObjekt`
   dostává `['links']` do `vynech`: generickou cestou by se zapsaly jako „pole bez
   identity", tedy falešný spor ještě předtím, než se dostanou ke svému slučovači.
2. **Smazat smí jen ten, koho se druhý nedotkl.** Úprava přebíjí smazání; opačné pořadí
   by zahodilo cizí práci. Vrácená entita jde do pruhu, ne do toastu.
3. **`updated_at` není změna, jen razítko** — bere se novější a spor z něj nevzniká.
   Jinak by každé sloučení hlásilo spor na každé entitě.
4. **Porovnává se stabilním JSONem** (`stabilniJson`, řazené klíče, výsledky ve WeakMapě).
   Dva klienti vyrobí stejný obsah s jiným pořadím klíčů a bez řazení by z toho byl
   falešný spor; bez mezipaměti by se každá entita serializovala třikrát.
5. **Po sloučení běží `uklidOdkazyPoSlouceni`** — vazba na entitu, kterou druhý smazal,
   nesmí zůstat.
6. **`numericId` se u příchozích entit přečísluje** (`srovnejCislaEntit`). Je to `max + 1`,
   takže dva lidé offline dostanou stejné číslo, a `#42` je odkazovací syntaxe v textu.
   Přečíslují se **cizí**, aby odkazy v mém rozepsaném textu platily dál.
7. **Řádky databází nesou `_rid`** (`doplnIdRadkumDatabazi` při načtení i při sloučení).
   Bez identity by se slučovaly podle pozice a při sporu by zmizela celá tabulka. Starší
   verze aplikace klíč ignoruje, protože sloupce se berou z `db_fields`. Když má část
   řádků `_rid` a část ne, `klicPole` vrátí `null` a tabulka se bere jako jedna hodnota —
   bezpečný ústup, ne tichá chyba.
8. **Pole bez identity prvků se neslučuje po pozici.** Zapíše se spor a vyhraje
   ukládající; míchání podle indexu by řádky rozjelo.

### Sloučení běží samo; ptát se je výjimka

Cizí commit se slučuje automaticky (`zkontrolujVzdalene` → `slucSVzdalenym({tiche:true})`).
**Otázka, na kterou se vždycky odpovídá stejně, není otázka** — a sloučení nikdy nesebere
rozdělanou práci, jen přidává.

- **Nic rozdělaného (`!_ghNeodeslaneZmeny`) → převzít `jejich` vcelku.** Spor tam nemůže
  vzniknout. `_ghNeodeslaneZmeny` zvedá `save()` (jediná cesta, kudy změny tečou) a shazuje
  ho úspěšné nahrání nebo načtení. **`syncPrevezmiData()` ho zvedá taky**: data z druhého
  okna mohou obsahovat změny, které na GitHubu ještě nejsou, a převzetí cizí verze vcelku
  by je zahodilo.
- **Vlastní commit se nesmí tvářit jako cizí** — `upload()` si sha commitu bere rovnou
  z odpovědi (`res.commit.sha` → `ghZapamatujCommit`). Bez toho se aplikace sloučí sama
  se sebou.
- **Odkládá se jen to, co by překáželo.** Otevřený dialog → `_ghSlouceniPoDialogu`
  a dohoní to tick kontroly (`ghDokonciOdlozeneSlouceni` porovnává sha **souboru**, ne
  commitu, takže se odložené sloučení dohojí i po zapamatování cizího commitu). Otevřený
  editor překážka není: slučuje se, ale nepřekresluje (`syncMuzePrevzit`).
- **Jediná otázka, která zbyla, je jiný soubor na té cestě** (`jeJinyProjekt`: ani jedno
  společné id entity). Hlásí se **jednou na danou sha**, jinak by to při tempu 20 s psalo
  do stavového řádku pořád.
- Tempo: `GH_KONTROLA_CILA_MS` (20 s) při práci, `GH_KONTROLA_KLID_MS` (120 s) v klidu,
  na skryté stránce vůbec. 180 dotazů za hodinu proti limitu 5000 je zanedbatelné.

**Sloučit je čtení, ne zápis.** `slucitZGithubuRucne()` (tlačítko `btn-gh-slucit`, taky
v paletě) stáhne a sloučí, ale neukládá — co jde ven, si má uživatel říct sám.

Hlídá to `pim/testy/slouceni.mjs` (pravidla na čisté `slucDb()`, celé kolečko přes
podvrženou `GH._api`, kanárci na obsah entit).

## Zvuky: krátké a tiché, protože zní pořád

Ukládání se po zkrácení autosave děje každé čtyři sekundy a sloučení přitéká samo, takže
někdejší `_modem()` (0,8 s) a `_fanfare()` (2 s) by z nástroje udělaly orchestr. Pravidlo:
**do 120 ms, hlasitost do 0,06, žádné sweepy ani akordy** (`_pip()` a nad ním
`_zvukUlozeno` / `_zvukSync` / `_zvukChyba`). Náběh i doznění veď exponenciálou, skoková
hlasitost lupe. Fanfára zůstává jen u dokončeného úkolu — tam si o ni uživatel řekl sám.

`playSound('sync')` je nový druh pro „něco přišlo zvenčí" (dva tóny vzhůru). Zvuky
v šabloně prohlížeče se **neměnily** — prohlížeč neukládá ani neslučuje.

Autosave čeká **4 s** (dřív 15). Kratší nemá smysl: v edit modu detailu autosave
schválně neběží a každé uložení je celý soubor.

## Ukončení editace vede přes jedno místo

`ukonciEditaciEntity({ pred, hlaska, zvuk })` dělá pořadí **datum z názvu →
detekce jmen → read mód → `save()` → `render()`**. Jde tudy Escape a klávesa U.

**Tlačítko Hotovo tudy nejde** — má vlastní, delší průběh (historie trackeru,
přejmenování a aktualizace odkazů, migrace anotací, zašifrování u aspektu Secured,
přepočet diagramu) a ten se sem zatím nesložil. Jediné, co mají společné, je
`doplnDatumZNazvuPodleAspektu()` a `detectAndOfferNamedEntities()`. **Důsledek,
který je potřeba znát: Escape a klávesa U nepropisují přejmenování do odkazů**
v ostatních entitách, protože blok s `state._editTitleOriginal` je jen u tlačítka
Hotovo. Kdo tyhle cesty slučuje, ať začne odtud.

Dřív volalo `detectAndOfferNamedEntities()` jen tlačítko „Hotovo". Escape a U
uložily a vrátily do read módu, ale detekci tiše přeskočily — kdo z editace
odchází Escapem, nabídku wiki odkazů nedostal **nikdy** a vypadalo to, že
detekce nefunguje vůbec. **Nová cesta ven z editace musí jít přes
`ukonciEditaciEntity()`.**

Pořadí je závazné: `state.detailMode = 'read'` **před** `save()`, protože autosave
guard v edit modu plánování uploadu přeskakuje.

Detekce běží i při uložení komentáře (`scope: 'commentOnly'`) a sekce — ty cesty
byly v pořádku. Naopak odchod na jiný pohled a „Uložit verzi" editaci neukončují,
takže detekci schválně nespouštějí.

Hlídá to `pim/testy/detekce-pri-odchodu.mjs`.

## Nabídka tagů při zakládání entity

`tagyNabidkaHtml(e, trida, jakoDetails)` + `napojTagyNabidku(root, trida)` +
`vybraneTagy(trida)` jsou zaškrtávátka tagů do formulářů „nový úkol / nová entita"
u schůzky a u projektu. Kandidáty dává `tagyZOkoliEntity(e)`: tagy entity samotné
(předzaškrtnuté) a tagy všeho, co na ni má vazbu, přes **týž** `tmSousedniEntity()`
jako tagová matice — jedno místo, jedna definice okolí.

Dvě věci, které musí platit:

- **Nepředzaškrtávej nic z okolí.** Předzaškrtnuté jsou jen vlastní tagy té entity;
  zbytek je nabídka. Jinak by nová entita tiše dostávala tagy, které jí nepatří.
- **Počet zaškrtnutých musí být vidět i u sbaleného bloku** (`data-tag-pocet-pro`,
  přepočítává `napojTagyNabidku`). U projektu je blok `<details>` a sbalený —
  bez živého počtu v hlavičce by se tagy přidávaly, aniž by o nich uživatel věděl.

Nový formulář, který tohle chce, potřebuje vlastní `trida`, aby se zaškrtávátka
nepletla s jiným formulářem na téže stránce.

Je to **jen v aplikaci**, ne v šabloně prohlížeče.

Hlídá to `pim/testy/tagy-pri-zalozeni.mjs`.

## Tabulka entit: tlačítko panelu u názvu

`renderEntityTableHtml()` (pohled Vše a uložené pohledy) má v buňce s názvem
hned za nadpisem `openInPanelBtnHtml(e.id)`. Obsluhu nic nového nepotřebuje —
`attachEntityRowHandlers()` váže `button[data-open-new-panel]` univerzálně.

Dvě věci, na kterých to stojí:

- **Tlačítko je ZA nadpisem, ne uvnitř něj.** Do přístupného názvu nadpisu patří
  jen název entity a odznaky (hledání po písmenech odečítačem — viz „Přístupnost:
  název první").
- **Do šablony prohlížeče nepatří.** Panely jsou jen v aplikaci, takže kopie
  `renderEntityTableHtml()` v `STATIC_VIEWER_TEMPLATE` zůstává bez něj. Hlídá to
  test, který se dívá přímo do šablony.

Hlídá to `pim/testy/odznak-a-seznam.mjs`.

## Panel úkolu v detailu

`renderTaskPanel(e)` je proužek nad `<dl class="read-attrs">` se stavem, termínem
a tlačítkem na přeplánování. Vzniklo proto, že se stavem a termínem se pracuje
pořád a kvůli tomu nemá smysl otevírat editaci celé entity.

Dřív byl v **hlavičce detailu mezi akčními tlačítky** jen select stavu
(`.task-quick-toggle`) a termín se dal měnit jen v editaci nebo v pohledu Úkoly.

Tři věci, které musí platit:

1. **Jediný zdroj stavů je `ASPECTS.Task.fields.status`** (`taskStatusChoices()` /
   `taskStatusOptionsHtml()`). Kopie seznamu se už jednou rozešly („Zrušeno" vs
   „Zrušené") a kdo přidá stav do `ASPECTS`, nesmí ho dopisovat ještě do UI.
   Pohled Úkoly bere options odtud taky.
2. **Termín se ukazuje i prázdný.** Jinak není vidět, že žádný není — a hlavně by
   nebylo kam kliknout, aby šel poprvé nastavit.
3. **Stav a termín se v atributech neopakují.** `renderAttributesReadOnly(e, opts)`
   dostane `opts.vynechat`. Vynechává se **jen v aplikaci**: šablona prohlížeče má
   vlastní kopii té funkce a panel v ní není, takže tam stav i termín musí zůstat
   mezi atributy. Kdo bude `opts` protahovat dál, ať to drží.

Přeplánování jde přes `openQuickReminderEditorForDeadline()` — tentýž dialog
(a tedy tentýž parser) jako ⏰ Termín v pohledu Úkoly a přeplánování
v Připomenutích. Tlačítko proto nese i `data-task-reschedule`, aby ho ta funkce
našla při vracení fokusu po překreslení.

Panel je **jen v aplikaci**, ne v šabloně prohlížeče.

Hlídá to `pim/testy/ukol-panel.mjs` (kanárci na ostatní entity).

## Rychlý výběr ze seznamu: tagy (L) a aspekty (K)

`otevriRychlyVyber(opts)` je **jeden** dialog „zaškrtej, co k entitě patří".
Staví na něm `openQuickTagEditor()` (klávesa `l`, `#btn-tags`) i
`openQuickAspectEditor()` (klávesa `k`, `#btn-aspects`); obojí navíc z palety
a z tabulky entit (`l` / `a` nad označeným řádkem). Dvě kopie téhož seznamu by
se dřív nebo později rozešly.

Volající dodá `prirazene` a `ostatni` **už seřazené** a řekne, jestli jde zakládat
nové položky (`umoznitNove`). U tagů ano (`normalizuj: normalizeTag`), u aspektů
ne — vlastní aspekt se zakládá v Nastavení, kde se mu dají pole.

Dřív to byla dvě textová pole: u tagů čárkami oddělený seznam, u aspektů
zaškrtávátka bez filtru a bez pořadí. Oboje dostupné **jen** z tabulky entit.

**Volba kláves není libovolná.** `a` je v detailu anotační režim a `Shift+A`
navigace na pohled Vše (`shiftNavMap` v `setupKeyboard()` — ta mapa spolkne
**každé** Shift+písmeno, které v ní je, takže se do ní musí sáhnout, kdo chce
Shift+něco jinde). Proto aspekty na `k`: volné, ve slově „aspekt", hned vedle `l`.

Tři pravidla:

1. **Do `db` se nesahá, dokud se nezmáčkne Uložit** — stejně jako u tagové matice.
   A uloží se **jen když se něco opravdu změnilo**; beze změn se nezvedne ani
   `e.updated_at`.
2. **Pořadí se spočítá jednou při otevření** (přiřazené abecedně, zbytek podle
   četnosti) a zaškrtáváním se **nepřeskládává**. Kdyby se přerovnávalo, položky
   by ujížděly pod kurzorem a druhý klik by trefil něco jiného.
3. **Řadí se podle četnosti, ne abecedně.** Při stovce tagů je hledaný skoro vždy
   z těch častých; abecední pořadí tam nikomu nepomůže.

Escape si dialog odchytává sám (`stopPropagation`), aby se zeptal na zahození
rozdělané práce — globální handler v `setupKeyboard()` jinak zavře každý otevřený
`<dialog>` rovnou. Po uložení se vrací fokus na tlačítko, které dialog otevřelo
(`opts.fokusPo`), protože `render()` z něj udělá nový prvek a fokus by spadl
na `<body>`.

Filtr jede přes `paletaNorm()` (bez diakritiky, bez velikosti písmen) — druhou
normalizaci nepiš. Nové tagy jdou přes `normalizeTag()`, takže se ukládají malými.

Odebrání aspektu **nemaže hodnoty jeho polí** — jen se přestanou zobrazovat.
Dialog to říká nahlas; bez té věty to vypadá jako ztráta dat.

Je to **jen v aplikaci**, ne v šabloně prohlížeče.

Hlídá to `pim/testy/rychle-tagy.mjs` a `pim/testy/rychle-aspekty.mjs`
(kanárci na ostatní entity).

## Dialog Vybrat entitu: hledá se podle toho, co je v řádku vidět

`openRelationPicker(opts)` je **jediný** dialog na výběr entity — cíl vazby, wiki odkaz,
include, status chip, účastníci i úkoly schůzky. `pickerEntityExtraLabel(e, najdi)` k názvu
dopisuje popisek navíc: **organizaci u osoby** (vazba `worksAt`) a **stav u úkolu**.

**Filtr musí hledat ve všem, co řádek ukazuje.** Dřív se hledalo jen v názvu, tazích
a aspektu, zatímco organizace se vypisovala — v seznamu bylo napsané, kdo pracuje ve
firmě XY, ale `xy` nenašlo nikoho. Zvenčí to nevypadá jako chybějící pravidlo, ale jako
rozbité hledání. Kdo do řádku přidá další údaj, přidá ho i do shody.

Dvě věci k výkonu, které nejsou kosmetika:

- **Popisek se počítá jednou za otevření dialogu** (mapa `popiskyNavic` s textem
  i normalizovaným tvarem), ne při každém stisku klávesy. Filtrování jde přes **všechny**
  entity při každém znaku.
- **`pickerEntityExtraLabel` bere `najdi` zvenčí.** `findEntity()` je lineární průchod
  `db.entities`, takže dohledávat organizaci každé osoby přes něj znamená n² porovnání.
  Dialog si proto postaví rejstřík `id → entita` a předá ho.

Popisek navíc je **jen v aplikaci**: kopie dialogu ve `STATIC_VIEWER_TEMPLATE`
`pickerEntityExtraLabel` nemá, takže v prohlížeči žádný popisek není a není co hledat.

Hlídá to `pim/testy/vyber-entity.mjs`.

## Tagová matice: rozdělaná práce stranou od dat

`otevriTagovouMatici(entityId)` je tabulka tagů nad okolím jedné entity. Dvě věci,
které se nesmí porušit:

1. **Do `db` se nesahá, dokud se nezmáčkne Uložit.** Rozdělaná práce žije
   v `stav` (id → Set tagů) proti `puvodni`; teprve Uložit přepíše `e.tags`
   a `updated_at`, a to **jen u entit, které se opravdu liší**. Zbytečně zvednuté
   `updated_at` je tichá změna dat jako každá jiná.
2. **Sloupce jsou jen tagy z tohohle okolí**, ne `getAllTags()`. V reálné bázi
   jsou tagů stovky a matice přes všechny je nepoužitelná — to byl důvod, proč
   vznikla takhle a ne jako obecná matice nad libovolným výběrem.

Řádky staví `tmSousedniEntity(e)`: strukturované vazby, relace v atributech
i odkazy v textu (wiki/include), **oběma směry**, bez archivovaných a bez
duplicit — tedy totéž, co ukazuje sekce Vazby v detailu. Entita sama je první
řádek a její tagy se počítají do sloupců; bez toho by nešlo rozšířit tag
z projektu na jeho části, což je ten hlavní případ užití.

**Není to vyskakovací okno prohlížeče.** `openEntityInStandaloneWindow()` otevírá
novou instanci aplikace s vlastním `db` načteným zvlášť z GitHubu — zápis tagů
odtamtud by byl druhá, nesesynchronizovaná kopie dat. Proto modální `<dialog>`
přes celou obrazovku ve stejné instanci. Escape je odchycený, aby nezahodil
rozdělanou práci bez zeptání.

**Filtr „jen bez" v hlavičce sloupce se schválně nepřepočítává průběžně.**
Zaškrtávátko `data-tm-filtr` nechá v tabulce jen entity, které ten tag nemají,
a stav se spočítá **v okamžiku zapnutí** (nebo tlačítkem Přepočítat). Kdyby se
filtr aplikoval po každé změněné buňce, řádek by zmizel přesně ve chvíli, kdy
mu tag přidáte — tedy když v něm chcete pokračovat. Víc zapnutých sloupců = AND
(entita nemá ani jeden z nich). Entita, ze které matice vychází, zůstává vidět
vždycky; je to kotva, ze které se tag rozšiřuje.

Dvě pasti, na které se při tom naráží: selektor buněk musí být `input[data-tm-r]`,
ne `input[type="checkbox"]` (jinak se filtrovací zaškrtávátka v hlavičce obsluhují
jako buňky), a **šipky musí skryté řádky přeskakovat**, jinak fokus zmizí do
neviditelného řádku a vypadá to, že se tabulka zasekla.

Hlídá to `pim/testy/tagova-matice.mjs` (kanárci na entity mimo okolí i na
nezměněné řádky).

## Sekce detailu: rozbalení a odškrtávání úkolů

Čtyři sekce pod obsahem jsou **`<details open>`**: Nedokončené položky, Příznaky,
Komentáře v textu (CriticMarkup) a Anotace. `open` v HTML je jen výchozí stav —
`render()` si před překreslením dělá snapshot `details.section-collapsible`
(klíč = `id`, jinak text summary) a po překreslení ho obnoví, takže co uživatel
sbalí, zůstane sbalené. Pozor: summary s počtem („Nedokončené položky (3)") mění
klíč, jakmile se počet změní — pak se snapshot netrefí a platí výchozí `open`.

Zaškrtávátka v Nedokončených položkách zapisují přes `odskrtniMdUkolNaRadku()`:
`collectUnfinishedMdTasks()` vrací u každého úkolu `sourceName` (`body` /
`attr:klíč`, stejné názvosloví jako `mdZdrojText()`/`mdZapisZdroj()`) a `line`,
takže **se nic nehledá podle textu ani se nepočítá N-tý výskyt**. Shoda textu se
jen ověří jako pojistka a při neshodě se **nezapíše nic** — dva stejně znějící
úkoly jsou přesně ta situace, kde počítání pořadím tiše trefí jiný řádek.

Zaškrtávátka mají vlastní třídu `md-sekce-ukol` a atributy `data-mdt-*`, aby se
nepletla s `data-md-task` z `attachMarkdownTaskHandlers()` (ta jedou přes N-tý
výskyt v textu). Kdo přidá další interaktivní seznam nad textem entity, ať drží
stejný princip: **řádek, ne pořadí**.

Seznam je i v šabloně prohlížeče, ale tam **bez zaškrtávátek** — prohlížeč needituje.

Hlídá to `pim/testy/sekce-detailu.mjs`.

## Filtr podle projektu je sdílený stav

`state.projektFiltr` (id projektu, nebo prázdno) platí najednou pro pohledy **Úkoly,
Kalendář, Tagy, Příznaky, Vazby a Komentáře** — schválně, aby šlo projít „všechno
k jednomu projektu" bez opakovaného vybírání. Nový pohled, který má filtr nabídnout,
potřebuje tři věci:

1. `const idsProjektu = idsAktivnihoProjektu();` a vlastní filtrování (`null` = nefiltruje se),
2. `projektFiltrHtml('<jedinečné-id>')` a `projektFiltrPopis()` do HTML,
3. `napojProjektFiltr(main)` po `innerHTML` — select po změně překresluje, takže se
   **vrací fokus** na nový prvek (stejná past jako u Připomenutí).

`idsVProjektu()` je **tranzitivní** přes vazbu `partOf`: projekt sám a všechno pod ním,
i přes mezičlánky. Dashboard projektu naproti tomu bere jen přímé potomky — to je
záměrný rozdíl, ne nedopatření. Ve Vazbách se filtruje na „aspoň jeden konec patří
k projektu", jinak by zmizely právě spojnice projektu s okolím.

`aktivniProjektFiltru()` filtr **sám vypne**, když projekt zmizí nebo se archivuje.
Bez toho by pohledy tiše ukazovaly prázdno a nebylo by z čeho poznat proč.

Ve filtrech pohledu Vše je projekt součástí `state.filter.project` (`''` / `'none'` /
`'any'` / id projektu) a filtruje se **na dvou místech**: v `applyFilters()` a v živém
filtrování seznamu podle DOM (proměnná `spj`). Kdo sáhne na jedno, musí i na druhé.

Filtr je **jen v aplikaci, ne v šabloně prohlížeče**.

Hlídá to `pim/testy/filtr-projektu.mjs`.

## Interaktivní markdown: zdroj textu se musí táhnout s prvkem

Zaškrtávátko úkolu, inline výběr `(!a/|b!)` i tlačítko **→ Entita** zapisují zpátky
do zdrojového textu. Který text to je, říká `ctx.taskSource` při renderu
(`data-md-task-source` / `data-md-source` v DOM) a rozluští `mdZdrojText()` /
`mdZapisZdroj()` v `attachMarkdownTaskHandlers()`:

| Zdroj | Kam se zapisuje |
|---|---|
| chybí / `body` | `entity.body` |
| `attr:klíč` | `entity.attributes[klíč]` |
| `comment:id` | `entity.comments[…].content` (+ jeho `updated_at`) |

**Nový kontext, ve kterém se renderuje markdown entity, musí `taskSource` nastavit.**
Bez něj se dřív spadlo na `entity.body` — a protože komentáře se renderují bez něj,
přepnutí inline výběru v komentáři tiše přepsalo tělo entity a komentáře se
nedotklo. Proto `mdZdrojText()` u neznámého zdroje vrací `null` a nezapisuje se nic.

Prvky se napojují na kořen, který dostane `attachMarkdownTaskHandlers(root, entity)`,
a `entity` musí být ta, které text patří. Komentáře okolních entit (`renderRelatedCommentsFlat`)
se proto vypisují přes `escapeHtml()` jako prostý text — patří cizí entitě a žádné
interaktivní prvky v nich vzniknout nesmí.

Hlídá to `pim/testy/ukoly-v-komentarich.mjs` (kanárci na tělo i na druhý komentář).

## Anotace a obsah nadpisů: indexy odstavců se počítají dvakrát

Inline anotace `(>text)` se do těla zapisují podle **indexu odstavce**, a ten index
vzniká na dvou nezávislých místech, která se musí shodovat:

1. `extractBodyParagraphRanges(body)` — odstavce zdroje i s čísly řádků
   (`{ text, startLine, endLine }`). `extractBodyParagraphs()` je jen jeho texty
   a `paragrafProRadek(rozsahy, radek)` vrací index odstavce pro daný řádek.
2. `setupAnnotations()` — pořadí potomků `#body-rendered` (s `ul/ol → li`
   a `table → tr`), které dostanou `data-paragraph-index` a `id="p-block-N"`.

Rozejdou-li se, anotace tiše skončí u cizího odstavce. Stalo se to tak, že
`renderBlock()` balil do `<p>` i samostatný blokový výstup (blok kódu, transkluze,
tabulka databáze) — prohlížeč neplatné vnoření `<p><pre>…</pre></p>` rozdělí na
`<p></p><pre>…</pre><p></p>` a každý takový blok přidal **dva prázdné odstavce**.
Proto `jeSamostatnyBlokovyVystup()` v `renderBlock()` (v aplikaci **i v šabloně
prohlížeče**) a proti stejné chybě i filtr prázdných obalů v `setupAnnotations()`.

Další pravidla, která musí platit:

- **Cílový řádek se nehledá podle textu.** Zápis jde přes `radekProAnotaciOdstavce()`
  (poslední řádek odstavce) a `radekSAnotaci()`. Hledání podle textu brávalo poslední
  shodu, takže u dvou stejných odstavců trefilo ten druhý a u nenalezeného textu
  spadla anotace na konec dokumentu.
- **Anotace nesmí rozbít Markdown.** V řádku tabulky jde do poslední buňky (za koncové
  svislítko by řádek přestal být řádkem tabulky); ohradník bloku kódu, vodorovná linka
  a oddělovač hlavičky ji nenesou vůbec — `radekUneseAnotaci()` je odmítne a tlačítko
  **+ Anotace** se u nich nezobrazí.
- `stripInlineAnnotations()` je **řádkově zachovávající** (dělí na `\n`, mapuje, spojuje),
  takže řádek *i* očištěného textu je pořád řádek *i* zdroje. Kdo to poruší, rozbije
  všechno výše.

`setupObsahNadpisu()` (sekce **Nadpisy** nad sekcí Obsah) staví obsah dokumentu z DOM
a musí běžet **až po `setupAnnotations()`**: nadpisy tam dostávají `id="p-block-N"`
a obsah na ně odkazuje. V obráceném pořadí si obě funkce `id` přepíšou a odkazy
nikam nevedou. Sekce je i v šabloně prohlížeče.

Sada `pim/testy/anotace-umisteni.mjs` porovnává počty odstavců a anchorů a kontroluje,
kam přesně anotace spadla; `pim/testy/obsah-nadpisu.mjs` hlídá cíle odkazů v obsahu.

## Archivace: co kam patří
Archivované entity (`e.archived`) se **nezobrazují v běžných sekcích detailu** — ve Vazbách,
v dashboardu projektu (kanban, cíle, lidé a organizace) ani v úkolech a účastnících schůzky.
Sesbírá je `renderDetailArchiveSection(e)` do jedné sbalené sekce „🗄 Archiv" na konci detailu,
nad sekcí Meta. Zdroj dat jsou `buildOutgoingLinkItems(e)` a `buildInverseLinkItems(e)`:
každá vrací položky i s protější entitou, takže se týmiž renderery vykreslí aktivní i archivovaná
část (`renderLinksReadOnly(e, {archived:true})`). Buildery drží **původní index vazby** v `e.links`,
protože na něj míří tlačítko odebrání vazby — při filtrování ho nikdy nepřepočítávej.

Nová sekce detailu, která vypisuje související entity, tedy musí archivované vynechat; pokud mají
zůstat dohledatelné, patří do sekce Archiv, ne do vlastní vedlejší sekce. Celý mechanismus je
zobrazovací, takže je **v aplikaci i v šabloně prohlížeče** (šablona nemá `openInPanelBtnHtml`
ani `invText.databaseFrom` — její kopie je o ně kratší).

## Datový model
`SCHEMA_VERSION = 2`, data v `localStorage["pim_db_v1"]` (`STORAGE_KEY`).
Entita má aspekty; `ASPECTS` (ř. 1653) definuje vestavěné (`Person`, `Organization`, `Place`,
`Event`, `Task`, `Project`, `Note`, `Document`, …) s poli a ikonami (`BUILTIN_ASPECT_ICONS`).
Dále `GLOBAL_FIELDS` (priorita, připomenutí), `RELATION_TYPES`, `CONFIDENCE_LEVELS`,
`BUILTIN_TEMPLATES`, `PLAN_STATUSES`.

**Interní atributy** poznáš podle prefixů `INTERNAL_ATTR_PREFIXES = ['tt_','journal_',
'tracker_','secured_','topic_','obj_']` a podle `INTERNAL_ATTR_KEYS`; `isInternalAttrKey()`
je jediné správné rozhodovací místo — nové interní pole zaveď se stejným prefixem, jinak se
uživateli objeví v editoru atributů.

## Přílohy — dvě cesty podle velikosti
Soubory do `EMBED_THRESHOLD_BYTES` (256 kB) se vkládají do dat; větší jdou do **IndexedDB**
(`pim_files` / `FILE_STORE`, `openFileDb`, `putFileBlob`, `getFileBlob`, `deleteFileBlob`).
Export do souboru má přepínač `includeFiles`. Při mazání entity nezapomeň na blob v IndexedDB.
`localStorage` má limit ~5 MB (`LIMIT`) — kód s tím počítá a hlídá to; nezvyšuj objem
ukládaných dat bez rozmyslu.

## Šifrované atributy (aspekt Secured)
`deriveKey` = **PBKDF2, `SECURED_ITERATIONS = 100000`, SHA-256**, s náhodnou solí;
`encryptPayload`/`decryptPayload`, stav odemčení drží `isSecuredUnlocked` /
`getUnlockedSecured` / `lockSecuredEntity` / `lockAllSecured`.
Pravidla: heslo se nikde neukládá, odemčený obsah nesmí skončit v exportu, ve statickém
prohlížeči, v publikovaném webu ani v logu. Počet iterací a algoritmus neměň bez migrace —
starší data se ukládají i s `secured_iterations`, aby šla dešifrovat.

## Markdown, wiki odkazy a includy
Vlastní renderer (`renderMarkdown`, `renderBlock`, `renderInline`, `renderListBlock`) plus:
- `[[Entita]]` / aliasy — `resolveWikiLink`,
- `{{status:Název}}` — stavový chip (`buildStatusChipHtml`),
- `{{database:Entita?columns=…&filter=…&sort=…}}` a `{{databasetext:…}}` — vkládání databází
  s parametry (`parseDatabaseIncludeParams`, `dbIncludeMatch`, `renderDatabaseIncludeAsMarkdown`),
- obecné `resolveInclude` s hlídáním hloubky.
Vkládání rich-textu ze schránky prochází konverzí **HTML → Markdown** (`htmlToMarkdown`,
`mdRenderNode`, `pasteHtmlAsMarkdown`) — ne přímým vložením HTML.

Úkol zapsaný v Markdownu lze povýšit na samostatnou entitu; nová entita se propojí vazbou
`partOf` a navíc **zdědí projekty rodičovské entity** (`getEntityParentProjects`), stejně jako
entita vzniklá z wiki odkazu. Zděděné vazby se nesmí duplikovat — kontroluj existující
`partOf` před přidáním.

## Include srovnává úrovně nadpisů

Vložená entita je **podúroveň místa, kam se vkládá**: její nejvyšší nadpis dostane
úroveň o jednu hlubší, než je nejbližší nadpis nad includem, a ostatní si proti němu
udrží rozestupy. Posun se počítá **z toho, co ve vložené entitě opravdu je**
(`nejvyssiUrovenNadpisu()`), ne z pevného čísla — jinak by dokument sestavený z částí,
které někdo psal od `#` a jiný od `####`, měl rozsypané úrovně.

Celé pravidlo je v pěti funkcích nad `renderMarkdown()`: `proKazdyNadpisVTextu()`,
`nejvyssiUrovenNadpisu()`, `urovenPoslednihoNadpisu()` / `zakladUrovneProMisto()`,
`posunNadpisuProInclude()` a dvě aplikace posunu — `urovenNadpisuSPosunem()` pro render
a `posunNadpisuVTextu()` pro Markdown.

**Platí na obou cestách, kterými include prochází, a ty se nesmí rozejít:**

| Cesta | Kde | Jak |
|---|---|---|
| render na obrazovku | `resolveInclude()` → `ctx.posunNadpisu` → `renderBlock()` | úroveň se posune při vykreslení `<hN>` |
| rozbalení do Markdownu | `expandMarkdownIncludes()` | přepíšou se křížky ve vloženém textu |

Druhá cesta jde do **exportu, tisku, kopie zdroje, podkladů pro umělou inteligenci
a pushe na GitHub** (tedy i na web EGdílny), a DOCX ji dědí přes `model.body`. Kdo
sáhne na jednu, musí na druhou — jinak vypadá export jinak než obrazovka.

Čtyři věci, které nejsou libovolné:

1. **Základ dává `ctx._posledniUroven`, a to v už posunutých úrovních.** Zapisuje ho
   `renderBlock()` u každého nadpisu. Každý include dostává **vlastní ctx**, takže se
   nadpisy z jednoho includu nepropíšou do základu toho dalšího: dva includy pod jedním
   nadpisem začnou **oba** na téže úrovni. Kdyby se `_posledniUroven` dědilo zpátky
   nahoru, druhý include by se zanořil pod první.
2. **Posun se počítá z vlastního těla cíle, ne z rozbaleného výsledku.** V Markdownové
   cestě je to podstatné: nadpisy, které do výsledku přinesl vnořený include, jsou vůči
   svému místu srovnané už teď a posunou se s ním. Díky tomu vyjde vnoření stejně jako
   při renderu — ověřeno v testu na obou cestách proti témuž očekávání.
3. **Bloky kódu se přeskakují.** `# poznámka` uvnitř ohradníků není nadpis a přepsat ji
   by znamenalo sahat autorovi do kódu.
4. **Bez nadpisu nad includem se neposouvá nic.** Není pod čím být podúrovní. Je to
   zároveň to, co nechává existující dokumenty s includem nad prvním nadpisem beze změny.

Zaráží se na 1 a 6 — hlubší nadpis HTML nemá, takže se přetečené úrovně slijí do šesté;
mez formátu, ne chyba. **Do dat se nezapisuje nic**, je to čistě zobrazovací: hlídají to
kanárci na těla vkládaných entit.

Zobrazovací kód znamená **i šablonu prohlížeče** — ta má vlastní kopii
`renderMarkdown()`/`renderBlock()`/`resolveInclude()`, takže tam jsou i čtyři z těch
funkcí (bez Markdownové cesty, kterou prohlížeč nemá). Ověřuje se na **vygenerovaném
souboru**, ne v šabloně: sada `staticky-prohlizec.mjs` má na to vlastní entitu s includem.

Hlídá to `pim/testy/includ-nadpisy.mjs` (35 kontrol, obě cesty proti témuž očekávání)
a `pim/testy/staticky-prohlizec.mjs`.

## České jazykové funkce
- `parseNaturalDate(text)` / `natlangParseDateInText` — přirozené datum v češtině
  („zítra“, „v pátek“, „za 3 dny“) s `dayDelta`/`applyDelta` a zachováním času
  (`combineDateWithOriginalTime`).
- `JOURNAL_DAYS` / `JOURNAL_MONTHS` (genitivy) pro deník.
- **Kontrola pravopisu** přes externí služby: `SPELL_CORRECT_API`
  (LINDAT Korektor, MFF UK) a vlastní slovník `SPELL_CUSTOM_DICT_URL` z GitHubu.
  Jsou to volání třetí strany — musí zůstat volitelná, nesmí posílat citlivý obsah bez
  vědomí uživatele a jejich výpadek nesmí shodit editor.

## Umělá inteligence: v GUI bez značky
Modul `AI` (konstanty `AI_KEY_STORAGE`, `AI_MODEL_STORAGE`, `AI_DEFAULT_MODEL`, `AI_ENDPOINT_BASE`)
volá jazykový model přímo z prohlížeče — služba povoluje CORS, takže **není potřeba proxy**
jako u Toggl. V uživatelském rozhraní se o tom mluví vždycky jen jako o **„umělé inteligenci"**;
název poskytovatele nesmí být vidět nikde v GUI, v nápovědě ani v dokumentaci — jen v komentáři
u modulu a v konstantě s modelem. Platí to i pro chybové hlášky: uživateli jde česká věta,
syrová odpověď služby jde do `debug()`.

Vstup vždycky prochází `aiOcistiVstup()` (vyřízne bloky `~~~private`) a `aiEntitaPovolena()`
(zabezpečené entity se neodesílají ani odemčené). Okno před odesláním ukazuje přesný text.
Klíč žije v `localStorage` mimo `db`, takže se nedostane do exportu ani do synchronizace —
při přidávání nového úložiště klíčů to musí zůstat tak.

Celý modul, dialog `#dialog-ai` i sekce v Nastavení jsou **jen v aplikaci**, ne ve
`STATIC_VIEWER_TEMPLATE` — prohlížeč needituje a klíč do něj nepatří.

Pohled `aiChat` (`renderAiChatView`, stav `_aiChat`) je chat nad vybranými entitami; otevírá
se z lišty hromadného výběru. Podklady se přikládají **jen k první otázce**, další kola jedou
na historii — v `_aiChat.zpravy` proto zpráva nese jak `text` (co vidí uživatel), tak volitelně
`proSluzbu` (co se opravdu odeslalo). Konverzace **se neukládá do `db`**; kdo si ji chce nechat,
uloží ji tlačítkem jako entitu. Zabezpečené entity se do podkladů nepustí už při otevření, aby
na ně neodkazovala ani uložená konverzace.

Okno umí i **návrh hodnot atributů**: `aiPolePro(entity)` posbírá pole z aspektů,
`GLOBAL_FIELDS` i `entity.customFields` a přes `AI_POUZITELNE_TYPY` odfiltruje, co nedává
smysl (composed, hidden, relace, interní prefixy). `AI.navrhniAtributy()` posílá
`generationConfig` s `responseMimeType: application/json` a `responseSchema`, takže odpověď
nejde dolovat z volného textu; u `select` se do schématu dá `enum` s povolenými hodnotami.
Zpátky na hodnotu pole se text převádí přes `aiPreved()`. **Do entity se nezapisuje nic,
dokud uživatel nepotvrdí**, a nic se nepředzaškrtává — u aspektu s deseti poli by se model
jinak ptal na všechna prázdná.

Odpověď chatu se čte streamovaně (`AI.askChat` → `_ctiStream`, koncový bod `:streamGenerateContent?alt=sse`).
Během psaní se do bubliny sype **prostý text**; Markdown se vykreslí až po dopsání, aby se
neblikaly rozepsané značky.

## Integrace
- **GitHub** (`GH_API`, token v `localStorage["pim_gh_token"]`, modul od ř. 23696) včetně
  **autosave na GitHub** (`scheduleAutosaveGh`, `toggleAutosaveGh`, `updateAutosaveButton`).
- **Toggl Track** — `pim_toggl_token`, `pim_toggl_workspace`, `pim_toggl_proxy`
  (proxy kvůli CORS). Token ani proxy URL nikam neloguj.
- **SheetJS** se načítá **líně** z CDN (`SHEETJS_CDN`) pro XLSX; jinak nástroj běží bez sítě.
- Nahrávání zvuku (`MediaRecorder`, `getUserMedia`) a rozsáhlá zvuková zpětná vazba
  (`playSound(kind)` a spol. — `_fanfare`, `_modem`, `_bell`, …).

## Nastavení a další klíče
`pim_settings_v1` (`SETTINGS_KEY`), `pim_sticky_v1` (rychlá textarea),
`pim_detect_ignored_v1` (ignorované návrhy detekce). Nastavení se ukládá lokálně
(`saveSettingsLocal` / `loadSettingsLocal`), data přes `save()` / `saveDebounced()`.

## Pohled Připomenutí (`reminders`)
Přehled všech entit s atributem `reminder_at`, seřazený podle data — `renderRemindersView(main)`,
tlačítko `data-view="reminders"` v navigaci, větev `case 'reminders':` v render routeru.
Stav se počítá proti `localDayKey(new Date())` a barví se třídami `.rem-overdue` / `.rem-today` /
`.rem-future` (mají i variantu pro tmavý motiv — nové stavové barvy dělej stejně).
V tabulce je datum **jen vypsané** (`<time datetime>`), ne jako `<input type="date">`.
Inline pole tam bylo a nefungovalo: každá změna hned uložila a překreslila celý pohled,
řádek se kvůli řazení podle data přesunul jinam, fokus spadl na `<body>` a vyprázdnění pole
připomenutí tiše smazalo. Přeplánování má proto vlastní dialog (`otevriDialogData`) a v akcích
je vedle Odstranit i Přeplánovat. Obě akce nastaví `updated_at`, zavolají `save()`, překreslí
**a vrátí fokus** — po překreslení se na nic nespoléhej, řádek už může být jinde.

`otevriDialogData({ titul, popis, hodnota, onOk, onVymazat, onZavreni })` je obecný dialog na
zadání data — používá ho přeplánování v Připomenutích, tlačítko ⏰ Termín v pohledu Úkoly
i tlačítko 🔔 Připomenutí v liště detailu entity (`otevriPripomenutiProEntitu()`).
Má pole pro **termín slovy**, které vyhodnocuje `parseNaturalDate()` a `combineDateWithOriginalTime()`,
tedy tentýž parser jako přeplánování v Kalendáři. **Druhý parser dat nepiš** — když má něco
rozumět „zítra" nebo „za 3 dny", vede cesta přes `parseNaturalDate`.

Nativní kalendář neotevírej sám přes `showPicker()` — spolkne první Escape a dialog pak nejde
zrušit jedním stiskem.
Pohled je **jen v aplikaci, ne v šabloně prohlížeče** — `reminder_at` je ale v `GLOBAL_FIELDS`
na obou místech.

## Orientace v kódu
Sekční bannery, v tomto pořadí: `KONSTANTY (1652) / STAV (1999) / ŠIFROVÁNÍ (2014) /
PERSISTENCE (2117) / AUTOSAVE NA GITHUB (2143) / UTILITY (2417) / HTML→Markdown (2467) /
Přirozený parser data (2776) / MARKDOWN (3336) / STATUS CHIP (3718) / databasetext (4014) /
database include (4227) / ENTITY API (4476) / STICKY (5624) / POKROČILÉ FILTRY (5859) /
COMPOSED ATTRIBUTES (6106) / PŘÍZNAKOVÁ EMOJI (6252) / SEARCH (6513) / SAVED VIEWS (6566) /
TEMPLATES (6745) / ATTACHMENTS (6780) / ROUTING (6893) / RENDER ROUTER (6992) /
HISTORIE NAVIGACE (7007) / PANELY (7157) / KLÁVESOVÁ NAVIGACE (7378) /
VIEW: NÁSTĚNKA (7915) / PŘIPOMENUTÍ (7441) / ÚKOLY (9227) / HLEDÁNÍ (9718) / VAZBY (9740) /
TAGY (9939) / PŘÍZNAKY (10820) / VLASTNÍ POHLEDY (11476) / ŠABLONY (11562) /
NASTAVENÍ (11622) / DETAIL (12311) / GITHUB MODUL (23832)`.
Čísla jsou orientační a s každou změnou se posouvají — ber je jako vodítko, ne jako adresu.
Nová obrazovka = nový `VIEW:` blok + zapojení do routeru (`ROUTING`, `RENDER ROUTER`) a panelů.

## Limity, které jsou tam schválně
`MAX_DEPTH = 3` a `MAX_PER_LEVEL = 15` u grafu souvislostí, `MAX = 20` u výběrů,
`WORDS_PER_PAGE = 350` / `CHARS_PER_PAGE = 2400` u odhadu rozsahu. Jsou to výkonové
a čitelnostní pojistky — neruš je, případně zpřístupni v nastavení.

## Konvence
- Vše česky, texty natvrdo (nemá i18n vrstvu jako DKM).
- `escapeHtml(s)` všude, kde jde uživatelský text do HTML; renderuje se hodně přes řetězce.
- Hlášky: `statusMsg` / `toast` / `alertMsg`, ladění `debug(msg)`.
- Vanilla JS, `'use strict'`, žádný build krok. Jediná stálá externí závislost je GitHub API
  (+ volitelně Toggl, LINDAT a SheetJS).

## Přístupnost: název první
Aplikaci ovládá i odečítač obrazovky a hledání po písmenech v seznamech. **Přístupný
název položky seznamu musí začínat tím, co uživatel hledá** — názvem entity, ne značkou
výběru, číslem ani ikonou. Vizuální značky patří do elementu s `aria-hidden="true"`
(viz `.rp-znacka` v dialogu Vybrat entitu).

V `role="listbox"` znamená `aria-selected` **vybráno**, ne „zvýrazněno". Zvýraznění
šipkami se hlásí přes `aria-activedescendant` a kreslí se třídou (`.rp-aktivni`).
Záměna obojího je tichá chyba: odečítač pak hlásí vybráno u všeho, přes co se projede.

## Testy: `pim/testy/`
V repozitáři je sada automatických testů proti skutečnému `index.html` v bezhlavém
Chromiu. **Spouštěj ji u každé změny**, která sahá na obsah entit, editory nebo
zobrazovací kód:

```bash
node pim/testy/spustit.mjs
```

Podrobnosti a jak psát novou sadu jsou v `pim/testy/README.md`. Dvě věci, které
musí zůstat platit:

1. **Pravidlo kanárků.** Když nová funkce sahá na text entity, musí k ní přibýt
   test, který do každé sekce dá unikátní značku a po operaci ověří, že žijí
   všechny, kterých se operace neměla dotknout. Tohle chytá tichá přepsání —
   jediná třída chyb, která uživateli sežere data a nedá o sobě vědět.
2. **Nástroj nad výřezem nesmí zapisovat do celku.** Kdo dostane `targetId`
   a `fieldKey: 'body'`, musí počítat s tím, že `targetId` může být
   `sec-edit-ta`, tedy jen jedna sekce. Zápis `entity.body = text` je v takové
   funkci chyba; text patří zpátky do editoru sekce (`obnovEditorSekce`).
   Celoobrazovkové nástroje (Revize, Korektor, Lint) si proto pamatují
   `navratSekce`.

Konce řádků: aplikace počítá s `\n`. Data zvenčí (GitHub, import JSON i ZIP)
procházejí `normalizujKonceRadkuVDb()` — s `\r\n` se markdown nezpracuje vůbec.

## Ověření změny
Entity s různými aspekty → vazby a graf souvislostí → Markdown s wiki odkazem, statusem
a database includem → úkoly, projekt s plánem, deník → databáze (filtry, řazení, import TSV/CSV) →
pohled Připomenutí (změna data v tabulce, odstranění, stavy po termínu/dnes/budoucí) →
příloha pod i nad 256 kB (ověř IndexedDB) → šifrovaný atribut: zamknout, odemknout, export
(nesmí obsahovat plaintext) → uložení a načtení souboru → **offline prohlížeč** (vygeneruj
a otevři — hlavní test toho, že šablona odpovídá aplikaci a že escapování v ní sedí;
zkontroluj i filtrování podle tagů a že se ven nedostalo nic citlivého) →
GitHub uložení i autosave →
přirozené datum v textu → kontrola pravopisu (a chování při nedostupné službě) →
klávesová navigace v tabulce entit → reload a ověření všech `localStorage` klíčů.
