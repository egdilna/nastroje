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
- **Předsazení** (`predsad`) přebírá následující sourozence jako děti (chování outlinerů).
- Každá změna stromu volá před sebou `zapamatuj()` (zpět/znovu) a po sobě `zmena(zprava)`
  (uložení, vykreslení, hlášení do stavového řádku s `aria-live`).
