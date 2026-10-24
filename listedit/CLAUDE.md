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
- **Sémantika:** vnořené `ul`/`li` nesou úroveň, fokus je na textu položky (`.text`, putující tabindex),
  úroveň a stav větve přes `aria-describedby`. Tlačítka řádku jsou skutečná tlačítka ve skupině
  (`role="group"`) a v tabulátorovém pořadí jen u vybraného řádku (`nastavTabulator`).
  Řádek sám **nesmí** mít `role="button"` — skryl by vnořená tlačítka.
- **Klávesy v seznamu** řeší `klavesaNaRadku` (fokus na `.text`), `/` skok do seznamu je v globálním `keydown`.
- **Předsazení** (`predsad`) přebírá následující sourozence jako děti (chování outlinerů).
- Každá změna stromu volá před sebou `zapamatuj()` (zpět/znovu) a po sobě `zmena(zprava)`
  (uložení, vykreslení, hlášení do stavového řádku s `aria-live`).
