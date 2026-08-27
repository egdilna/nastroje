# Changelog

Všechny podstatné změny nástroje **Šanony** (designový správce souborů nad repozitářem na GitHubu)
jsou zaznamenány v tomto souboru.

Formát vychází z [Keep a Changelog 1.1.0](https://keepachangelog.com/cs/1.1.0/)
a nástroj se drží [sémantického verzování](https://semver.org/lang/cs/).

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

[1.2.0]: https://github.com/egdilna/nastroje/tree/main/sanony
[1.1.4]: https://github.com/egdilna/nastroje/tree/main/sanony
