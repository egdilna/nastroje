# Nástroje — pokyny pro práci v repozitáři

Repozitář je sbírka samostatných webových nástrojů; každý má vlastní složku a některé
i svůj `CLAUDE.md` s podrobnostmi k architektuře (například `mros/CLAUDE.md`).

## Nasazování

**Hotovou práci nasazuj rovnou do větve `main`.** Tedy: commit na pracovní větev,
pull request a hned merge — bez čekání na potvrzení. Platí to vždy, pokud uživatel
v zadání výslovně neřekne jinak („zatím nenasazuj“, „nejdřív mi to ukaž“).

Náhled k proklikání (samostatné HTML nebo Artifact) je vítaný tam, kde jde o změnu
vzhledu nebo ovládání a stojí za to si ji osahat. Nasazení tím ale nepodmiňuj —
náhled a merge jdou vedle sebe.

## Ukládání do GitHubu — mez 1 MB a pojistka proti přepsání

Většina nástrojů drží svá data v jednom souboru v repozitáři přes **GitHub Contents
API**. Ten má past, na kterou se už jednou naletělo (`mros`, vložené PDF v dlaždici):

**Contents API vydá obsah souboru jen do 1 MB.** U většího vrátí `content: ""`
a `encoding: "none"`, takže naivní `atob(odpoved.content)` dá prázdný řetězec
a `JSON.parse` spadne. Data přitom v repozitáři jsou celá a nepoškozená — jen
vypadají jako poškozená. Stačí k tomu jeden vložený soubor; base64 ho navíc
nafoukne o třetinu.

Každý nástroj, který čte nebo zapisuje soubor přes GitHub API, proto musí mít:

1. **Záložní čtení přes Git Data API.** Když v odpovědi obsah nedorazí, dotáhni ho
   podle SHA z `/repos/{owner}/{repo}/git/blobs/{sha}` (zvládne až 100 MB).
2. **Zápis nad 1 MB přes blob, strom a commit.** Contents API `PUT` nech pro běžná
   malá uložení; u většího obsahu poskládej commit z Git Data API
   (blob → `git/trees` s `base_tree` → `git/commits` → `PATCH git/refs/heads/{větev}`).
3. **Pojistku proti přepsání.** Drž příznak „soubor jsme opravdu načetli“ a dokud je
   `false`, **neukládej nic**. Bez toho jedno neúspěšné načtení nechá běžet prázdný
   stav a automatické ukládání jím přepíše celá uživatelova data. Příznak nastav po
   úspěšném načtení, když soubor ještě neexistuje (není co ztratit), nebo když
   uživatel přepsání výslovně potvrdí. Důvod zastavení musí být vidět v běžném
   stavovém řádku, ne jen v dialogu nastavení, který může být zavřený.
4. **Cestu zpět.** Každé uložení je commit, takže z `commits?path=…` jde vypsat
   historii souboru a kteroukoli starší verzi načíst. Vzor je `ghHistorieOkno()`
   v `mros`.
5. **base64 po blocích.** `btoa(unescape(encodeURIComponent(text)))` na
   několikamegabajtovém řetězci vyrábí obří mezikopie; použij `TextEncoder`
   a `String.fromCharCode.apply` po blocích (vzor `bytyDoBase64()`).

Při jakékoli práci s GitHub API v nástroji si těchto pět bodů projdi — i když měníš
něco jiného. Hotové vzory jsou v `mros/index.html` (`ghObsahSouboru`, `ghUlozitVelke`,
`ghNacteno`, `ghHistorieOkno`) a v `stor/index.html`.

## Jazyk

Kód, komentáře, názvy funkcí i proměnných, commity, pull requesty i všechny texty
pro uživatele jsou **česky**.
