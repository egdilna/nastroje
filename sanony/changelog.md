# Changelog

Všechny podstatné změny nástroje **Šanony** (designový správce souborů nad repozitářem na GitHubu)
jsou zaznamenány v tomto souboru.

Formát vychází z [Keep a Changelog 1.1.0](https://keepachangelog.com/cs/1.1.0/)
a nástroj se drží [sémantického verzování](https://semver.org/lang/cs/).

## [1.6.0] - 2026-09-30

### Opraveno

- **Nadpisy `h6` chyběly ve čtyřech seznamech.** Verze 1.5.0 je doplnila jen na dlaždicích;
  názvy položek ve volných listech, v sekci „Propojeno sem“, ve výsledcích hledání
  a v nesrovnalostech v nastavení zůstaly obyčejnými `div` a `span`. Nyní je nadpisem
  název položky na všech osmi místech, kde se zobrazuje.
- **Výsledky hledání se neskládaly.** `.res` byl `<span>` bez `display:block`, takže se
  název, cesta i popis slévaly do jednoho řádku a nedodržely se rozměry ani odsazení —
  táž vada, jaká se v 1.4.0 opravovala u dlaždic desek a souborů.
- Hlášku o obnovení archivu vzápětí přebíjelo „Archiv načten.“ z následného načtení,
  takže potvrzení nebylo vidět.

### Přidáno

- **Zápis nad 1 MB.** Contents API takový soubor neuloží; větší obsah se nově poskládá
  jako commit z Git Data API (blob → strom nad dosavadním stromem → commit → posun větve).
  Platí pro `folder.json` i pro nahrávané soubory, protože rozhoduje `ulozSoubor()`.
- **Pojistka proti přepsání.** Dokud se `folder.json` opravdu nenačte, nástroj neuloží nic.
  Neúspěšné načtení by jinak nechalo běžet zastaralý stav a zápisem by archiv přepsalo.
  Důvod zastavení je vidět v běžném stavovém řádku a ukládání jde v nastavení vědomě
  povolit — kdyby to nešlo, poškozený archiv by nebylo jak opravit.
- **Historie archivu.** V nastavení jde vypsat posledních 30 commitů souboru `folder.json`
  a kteroukoli starší podobu archivu obnovit. Obnovení se ukládá jako nový commit,
  takže se současný stav neztrácí.

## [1.5.0] - 2026-09-30

### Přidáno

- **Offline kopie jen části archivu.** Dosud šlo uložit jen celý archiv z nastavení;
  nově je v režimu Správy na obrazovce kartotéky, šanonu i desek tlačítko
  „Uložit offline (ZIP)“, které uloží jen to místo a jeho obsah.
  - Cesty zůstávají celé, aby se struktura vykreslila ve správných úrovních, takže se
    k výřezu přibalí i místa nadřazená — jinak by se k němu v kopii nedalo doklikat.
    Sourozenecká místa ani zbytek archivu uvnitř nejsou.
  - Kopie se otevře rovnou na místě, ze kterého byla pořízena, a v hlavičce i titulku
    okna se hlásí jako „offline výřez: Byty“, aby ji nešlo splést s kopií celého archivu.
  - Propojení, která míří mimo výřez, se po uložení spočítají a vypíšou; v kopii pak
    zůstanou slepá.
  - Název souboru nese místo výřezu, například `archiv-Muj-archiv-Byty-2026-09-30.zip`.
- **Popis desek** je vidět v seznamu desek v šanonu a **popis souboru či odkazu**
  na jeho dlaždici v deskách — vizuálně i v popisu pro odečítač. Dlouhý popis se zkrátí
  třemi tečkami (dva řádky u desek, tři u souborů).

### Změněno

- **Štítky se všude vypisují abecedně** podle češtiny a bez ohledu na velikost písmen —
  v editoru položky, ve filtru hledání, ve správě štítků i na samotných položkách,
  kde se dosud držely pořadí, v jakém byly zaškrtnuty.
- **Název položky je nadpis `h6`** u kartotéky, šanonu, desek, souborů, odkazů
  i propojení, takže odečítač je najde procházením nadpisů. Položky zůstávají odkazy,
  nadpis je uvnitř nich. Vzhled se nemění — ověřeno pixelovým srovnáním.

### Opraveno

- `folder.json` větší než 1 MB šel načíst jen zdánlivě: Contents API u takového souboru
  obsah nevydá a archiv se tvářil jako poškozený, ačkoli v repozitáři byl celý. Nově se
  v takovém případě dotáhne podle SHA přes Git Data API. Totéž platí pro stažení
  a zkopírování obsahu velkého souboru, které dosud skončily chybou.

## [1.4.0] - 2026-09-16

### Přidáno

- **Lepicí poznámky na desky.** Papírek šlo dosud přilepit jen na soubor nebo odkaz;
  nově i na desky, tlačítkem „Přilepit poznámku“ na jejich obrazovce. Poznámky se
  ukládají k uzlu do `folder.json`, takže putují i do offline kopie.
- **Hlavička desek** — desky se otevřou jako otevřená složka ve vlastní barvě: jazýček
  navazuje šířkou na dlaždici v šanonu, pod názvem je čárkovaná linka jako na dlaždici
  a uvnitř leží popis, štítky a nalepené papírky.
  - Štítky desek šlo zadat už dřív, ale na obrazovce desek nebyly vidět; stejně tak popis.
    Nyní jsou obojí vypsané a kliknutí na štítek vyhledá vše, co jej nese.
  - Na širší obrazovce se papírky lepí vedle textu, nejvýš dva vedle sebe, aby neukrojily
    šířku popisu. Pod 860 px se zalomí pod text.
- Papírek nalepený na deskách je vidět i na jejich dlaždici v šanonu, stejně jako
  u souborů; počet poznámek se hlásí i v popisu pro odečítač.
- Poznámky desek se prohledávají spolu s názvem a popisem míst archivu.

### Změněno

- Cíl poznámky je nově popsaný samostatně (soubor podle názvu, místo archivu podle cesty),
  takže se poznámka ukládá vždy do čerstvě dohledaného záznamu.

## [1.3.0] - 2026-09-16

### Změněno

- **Položky archivu jsou odkazy, ne tlačítka.** Kartotéky, šanony, desky, soubory, odkazy
  na web, propojení, výsledky hledání i drobečková navigace byly technicky tlačítka;
  odečítač je tak hlásil jako „tlačítko“ a nešly otevřít v novém panelu. Nově jde
  o `<a>` se skutečnou adresou položky.
  - Odečítač je hlásí jako odkaz a dá se procházet seznamem odkazů na stránce.
  - Ctrl, Cmd, Shift nebo prostřední tlačítko otevřou položku v novém panelu či okně,
    adresa jde zkopírovat z kontextové nabídky. Obyčejné kliknutí obsluhuje aplikace
    jako dosud, stránka se nepřenačítá.
  - Adresa je relativní, takže vede i v offline kopii otevřené ze souboru.
  - Totéž platí pro tlačítka „Otevřít“, „Otevřít cíl“ a „Otevřít místo“ v přihrádkách
    volných listů, v sekci „Propojeno sem“ a v nesrovnalostech.
- Ovládací prvky, které nikam nevedou — „Nový soubor“, „Nové propojení“, „Upravit šanon“,
  „Smazat“, filtr štítků, „Otevřít nastavení“ a podobné — zůstávají tlačítky.
- Vzhled se nemění. Ověřeno pixelovým srovnáním pěti obrazovek se zapnutou i vypnutou
  Správou a snímkem ohniska klávesnice: nula změněných pixelů.

## [1.2.0] - 2026-08-26

### Přidáno

- **Propojení** — vnitřní odkaz na jinou položku archivu. Vedle souboru a odkazu na web
  jde nově založit propojení, které po otevření rovnou skočí na svůj cíl.
  - Cílem může být kartotéka, šanon, desky, soubor i odkaz na web. Police se nenabízí,
    protože nemá vlastní obrazovku.
  - Vlastní název se nezadává, odvozuje se z druhu cíle: „Propojená kartotéka Právo“,
    „Propojený šanon Nájmy“, „Propojené desky Byty“, „Propojený soubor smlouva.pdf“,
    „Propojený odkaz Zákony pro lidi“. Volitelně lze doplnit popis.
  - Propojení může ležet kdekoli jako soubor. V deskách se zobrazí jako dlaždice
    s čárkovaným rámečkem, mimo desky mezi volnými listy.
  - Zakládá se tlačítkem „Nové propojení“ na obrazovce kartoték, kartotéky, police,
    šanonu i desek; upravit a smazat jde přímo pod dlaždicí ve Správě.
- Sekce **„Propojeno sem“** ukazuje u položky propojení, která na ni míří — v detailu
  souboru a odkazu i na obrazovce kartotéky, šanonu a desek. Kliknutí otevře místo,
  kde propojení leží.
- Propojení se prohledávají spolu se soubory a strukturou; hledá se v odvozeném názvu,
  v popisu i v umístění cíle. Štítky propojení nemají, proto se při filtru štítků
  nenabízejí.

### Změněno

- Přejmenování a přesun kartotéky, police, šanonu či desek propojení podědí — přepíše se
  jak cíl, tak místo, kde propojení leží. Totéž platí pro přejmenování odkazu na web.
- Před smazáním souboru, odkazu nebo místa archivu se v potvrzovacím dialogu vypíše,
  kolik propojení na ně míří a zůstane po smazání slepých.
- Kartotéku, polici, šanon ani desky nelze smazat, dokud v nich leží propojení; hlášení
  o neprázdné položce jejich počet uvádí.
- Propojení, jehož cíl už v archivu není, se hlásí v Přihrádce k zařazení v nastavení
  (a započítává se do čísla u ozubeného kola). Lze je odtud přesměrovat nebo smazat.
- Propojení se ukládají do `folder.json` do pole `links`, takže putují i do offline kopie.

### Opraveno

- Dlaždice desek a souborů se rozpadaly: jejich obsah se místo pod sebe skládal do jedné
  řádky a nedodržely se rozměry ani odsazení. Chyběl jim `display:block`.

## [1.1.4] - 2026-08-23

### Přidáno

- Do archivu lze nahrát více souborů najednou — v panelu „Nový soubor“ jde ve file dialogu
  označit víc souborů (Ctrl/Shift) a nahrají se jedním zadáním.
  - Při výběru dvou a více souborů se pole název, popis a štítky skryjí: názvy se přebírají
    z vybraných souborů a popis se štítky se doplní později u jednotlivých souborů.
  - Soubory se odesílají postupně, jeden po druhém; `folder.json` se zapisuje až nakonec,
    takže místo dvou commitů na soubor vznikne N+1 commitů na celou dávku.
  - Na názvy, které už v archivu nebo v repozitáři existují, se nástroj ptá jednou souhrnně
    a nabídne jejich nahrání jako nové verze, přeskočení, nebo zrušení celé dávky.
  - Uzamčené soubory, odkazy na web a vyhrazený název `folder.json` se přeskočí a vypíšou.
  - Když se jeden soubor nenahraje, ostatní pokračují; na konci se vypíše souhrn a do archivu
    se zapíšou jen soubory, které skutečně prošly.

### Změněno

- Titulek okna prohlížeče nyní ukazuje, kde se uživatel v archivu nachází, ve tvaru
  `místo · nadřazené místo · název archivu`. Dosud se zobrazoval jen název archivu,
  takže se otevřené záložky nedaly od sebe rozeznat.
  - kartotéka: `Právo · Můj archiv`
  - šanon: `Nájmy · Právo · Můj archiv` (police se neuvádí, protože nemá vlastní obrazovku)
  - desky: `Byty · Nájmy · Můj archiv`
  - soubor: `smlouva.pdf · Nájmy · Můj archiv` (u souboru se uvádí šanon i tehdy,
    když soubor leží v deskách)
  - hledání a nastavení: `Hledání · Můj archiv`, `Nastavení · Můj archiv`
  - úvodní přehled kartoték ponechává samotný název archivu
- Označení offline kopie zůstává zachováno na konci titulku:
  `Byty · Nájmy · Můj archiv (offline kopie)`.

[1.6.0]: https://github.com/egdilna/nastroje/tree/main/sanony
[1.5.0]: https://github.com/egdilna/nastroje/tree/main/sanony
[1.4.0]: https://github.com/egdilna/nastroje/tree/main/sanony
[1.3.0]: https://github.com/egdilna/nastroje/tree/main/sanony
[1.2.0]: https://github.com/egdilna/nastroje/tree/main/sanony
[1.1.4]: https://github.com/egdilna/nastroje/tree/main/sanony
