# CLAUDE.md — List editor

Jednosouborový editor víceúrovňových seznamů (`index.html`, bez externích knihoven), rozhraní CS/EN
(`TEXTY`, volba v hlavičce, uloženo v `localStorage`).

- **Data** jsou strom `{ id, text, deti: [], sbaleno }` pod `koren`; ukládají se jen do `localStorage`
  (`listedit-data`), GitHub API se nepoužívá. Kdyby se přidávalo ukládání do GitHubu, platí pravidla
  z kořenového `CLAUDE.md`.
- **Vstup:** `rozeberText()` — odsazení tabulátory/mezerami (zásobník šířek), odrážky `- * +`,
  číslování `1.` `1)` `a)`, a bez odsazení číslování `1.2.1` (úroveň podle čísla).
- **Výstupy:** `vystupTab`, `vystupMd`, `vystupCislovany`, `vystupHierarchie` — vždy celý seznam,
  i při zúženém pohledu (hoist).
- **Sloučení** (`sloucit`, klávesa J) připojí text k předchozí viditelné položce, podřízené přejdou pod ni.
- **Sémantika:** vzor ARIA tree — `ul role="tree"` / `role="group"`, `li role="treeitem"` s `aria-level`,
  `aria-setsize`, `aria-posinset`, `aria-expanded` a jménem přes `aria-labelledby` (číslo + text).
  Fokus nese `li` s putujícím tabindexem — díky roli stromu přepne odečítač do režimu formuláře,
  takže šipky i písmenkové zkratky dorazí do stránky a položka se přečte.
  Upravit, Smazat a sbalení jsou **tlačítka**, posuny, Sloučit a Jen tato jsou **odkazy** (`a href="#"`)
  — výslovné přání uživatele, neměnit. Ovládací prvky jsou v pořadí Tab jen u vybrané položky
  (`nastavTabulator`). Řádek sám **nesmí** mít `role="button"` — skryl by vnořené prvky.
- **Klávesy v seznamu** řeší `klavesaNaRadku` (fokus na `li.polozka`), `/` skok do seznamu je v globálním `keydown`.
- **Předsazení** (`predsad`) přebírá následující sourozence jako děti (chování outlinerů).
- Každá změna stromu volá před sebou `zapamatuj()` (zpět/znovu) a po sobě `zmena(zprava)`
  (uložení, vykreslení, hlášení do stavového řádku s `aria-live`).
