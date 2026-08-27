# CLAUDE.md — Šanony (sanony)

## Co to je
Jednosouborový **designový správce souborů nad složkou v GitHub repozitáři**
(`index.html`, ~4292 řádků, ~173 kB, 201 top-level funkcí; `<title>Archiv</title>`).
Nad obyčejnou složkou staví vizuální archiv: kartotéky, police, šanony a desky, do kterých
se zakládají soubory, odkazy na web a propojení. K tomu štítky, lepicí papírky, náhledy
obsahu, hledání, verzování souborů a export celého archivu do offline ZIPu.

**Historie změn je v `changelog.md`** — drží se [Keep a Changelog 1.1.0](https://keepachangelog.com/cs/1.1.0/)
a sémantického verzování. **Každou uživatelsky viditelnou změnu tam zapiš** do sekce pro
nadcházející verzi; je to zavedená praxe tohoto nástroje (aktuální verze 1.2.0).

## Hierarchie archivu
`UROVNE = ["kartotéka", "police", "šanon", "desky"]` — čtyři úrovně struktury, každá s vlastní
vykreslovací funkcí (`vykresliKartoteky`, `vykresliSkrin`, `vykresliSanon`, `vykresliDesky`).
**Police nemá vlastní obrazovku** — proto se mimo jiné nenabízí jako cíl propojení.
Uvnitř leží tři druhy položek:
| Druh | Poznámka |
|---|---|
| soubor | skutečný soubor v repozitáři, s verzemi a zámkem |
| odkaz na web | `TYP_ODKAZ`, jen URL + popis |
| **propojení** | vnitřní odkaz na jinou položku archivu (`IKONA_PROPOJENI`, `PROPOJENI_SLOVA`) |

Propojení **nemá vlastní název** — odvozuje se z druhu cíle („Propojený šanon Nájmy“) přes
`nazevPropojeni` / `druhPropojeni` / `cilNazev`. Nemá ani štítky, takže se nesmí objevit
ve filtru štítků. Cílem může být kartotéka, šanon, desky, soubor i odkaz — ne police.

**Integrita propojení je hlavní věcné pravidlo nástroje.** Přejmenování a přesun podědí
i propojení (přepíše se cíl i místo, kde propojení leží); před smazáním se počítá, kolik
propojení zůstane slepých (`slepaPropojeni`, `propojeniNaUzel`, `propojeniNaPolozku`);
místo archivu nelze smazat, dokud v něm propojení leží. Když saháš na přejmenování, přesun
nebo mazání, projdi všechny tyto cesty — jinak vzniknou slepá propojení.

## Data a GitHub
- Metadata archivu jsou **`folder.json`** ve spravované složce:
  ```js
  { version: 1, folder, title, tags: [], nodes: [], links: [], files: [] }
  ```
  Zakládá ho `zalozMetadata()`, ukládá `ulozMetadata(zprava)`; `nacti()` načítá stav,
  `doplnUzly()` dorovnává chybějící uzly. Při rozšíření modelu drž `version` a čtení starších
  souborů.
- Vrstva GitHub API: `api(cesta, volby)`, `kontrola(potrebaToken)`, `ziskejSoubor(nazev)`,
  `ulozSoubor(nazev, base64, zprava, sha)`. Zápis vždy s `sha`, jinak commit selže.
- Konfigurace (repozitář, složka, token) je v `localStorage["spravce-slozky-github"]` (`KLIC`),
  `nactiCfg()` / `ulozCfgZFormulare()`. **Token zůstává jen v prohlížeči** — nikdy ho nelogguj
  (ani do ladicího výpisu), nedávej do `folder.json`, do sdíleného odkazu ani do offline exportu.
- Stav aplikace se promítá do URL (`zapisAdresu`, `sestavOdkaz`, `otevriCilZUrl`,
  `doB64url`/`zB64url`) — sdílený odkaz musí otevřít konkrétní místo archivu.

## Offline export
`exportZip()` vyrábí **samostatnou kopii archivu v ZIPu**. Funguje to tak, že se hned při startu
uloží snímek nedotčené stránky (`SNIMEK_HEAD`, `SNIMEK_BODY`) a ten se použije jako kostra
offline kopie — tentýž kód i styly, jen s daty předanými přes `window.ARCHIV_OFFLINE`
(`offlineIndex`, `rezimOffline`, konstanta `OFFLINE`).

Důsledek, na který pozor: **snímek se bere z původního HTML, ne z aktuálního DOM.** Když
budeš měnit strukturu stránky, ověř, že offline kopie pořád funguje. A cokoli, co v ní nemá
být (token, nastavení, správcovské akce), do ní nesmí proniknout — `rezimOffline()` je jediné
místo, kde se to omezuje.

ZIP se staví ručně: `zipVytvor`, `crc32` (+ `crcTab`), `u16`/`u32`, `dosCas` a komprese přes
`CompressionStream("deflate-raw")` s **fallbackem na uložení bez komprese**, když API chybí
nebo by výsledek byl větší. Fallback nech být.

## Markdown a náhledy
- Knihovny se načítají **líně a s kontrolou otisku**: `MD_KNIHOVNY` (marked + DOMPurify z jsDelivr)
  má u každé položky `url`, **`otisk` (SRI hash)** a test `hotovo()`; načítá je `nactiSkript(k)`
  přes `zajistiMarkdown()`. Při změně verze knihovny **musíš přepočítat i otisk**, jinak se
  skript odmítne načíst. Bez sítě zůstane nástroj funkční, jen bez renderu Markdownu.
- Vykreslený Markdown jde vždy přes DOMPurify (`markdownDoDom`, `upravNahled`) — nikdy
  nevkládej HTML z obsahu souboru přímo.
- CriticMarkup přidává `nastavCriticMarkup()` / `jednoduche(...)` nad marked; `mdSkryty`
  řeší skrytý text.
- Typy náhledu určuje `NAHLED`: `md`, `obraz`, `zvuk`, `video` (podle přípony).
  Nový typ = položka v `NAHLED` + větev v `nactiDoNahledu`. Blob URL se uklízí
  (`novyBlobUrl`, `uklidBlobUrly`) — každý vytvořený URL musí být uvolněn.

## Barvy a štítky
`BARVY12` / `BARVY6` / `BARVYPOSTIT` jsou pojmenované palety s `id`, českým názvem a CSS
hodnotou; barva se dědí (`barvaUzlu`, `autoBarva`) a kontrast textu se dopočítává
(`kontrastniText`, `ztmav`). **Nikdy nepiš barvu natvrdo** — přidej ji do palety.
Štítky mají vlastní správu (`stitkySeznam`, `najdiStitek`, `ulozStitek`, `smazStitek`)
a používají se ve vyhledávání.

## UI konvence
- **Kód je celý česky** — funkce (`vykresli`, `prejdi`, `zamer`, `posun`, `uzly`, `potomci`),
  proměnné i konstanty. Nové věci pojmenuj stejně, nemíchej angličtinu.
- Styl je ES5-ish (`var`, `function`, `Promise` bez `async/await`). Drž se ho.
- Prvky se staví přes `mkPolozka`, `tlacitko(text, trida, akce, popisek)`, `panel(titulek)`
  a formulářová pole `poleText` / `poleTextarea` / `poleStitky` / `poleBarva` / `poleUmisteni`
  / `poleCil` — používej je místo vlastního HTML.
- Uživatelský text vždy přes `esc(s)`.
- Hlášky: `stav(text, typ)` a `oznam(text)` (živá oblast `#live` pro odečítač), ladění `log(text)`.
- Režim správy (`jeSprava()`) odděluje čtení od úprav — nová editační akce ho musí respektovat.
- Klávesová navigace v mřížce položek: `zamer(i)`, `rady()`, `posun(smer)`, obsluha šipek,
  `Home`/`End`, `Backspace` (o úroveň výš) a `Escape`. Nové obrazovky do ní zapoj.
- České skloňování řeší `pluralCz(n, a, b, c)` a `pocetSlov(n, zaklad)` — počty skládej přes ně.

## Ověření změny
Nastav repozitář, složku a token → založ `folder.json` → kartotéka, police, šanon, desky →
nahraj soubor (i dávkově), založ odkaz a propojení → ověř „Propojeno sem“ →
**přejmenuj a přesuň místo archivu a zkontroluj, že propojení míří správně** → zkus smazat
místo s propojením (musí to odmítnout) → štítky a filtr → lepicí papírky → náhledy md, obrázku,
zvuku i videa → hledání → verze souboru a zámek → přihrádka k zařazení a nesrovnalosti →
export ZIP a otevření offline kopie bez sítě → průchod klávesnicí → zápis do `changelog.md`.
