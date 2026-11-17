# data/booklet

The CSV files in this folder are a copy (taken 2026-11-17) of the spreadsheet
[12 favorite short animated films](https://docs.google.com/spreadsheets/d/1BtHFvXhsUyDKANK-F2c1jDNItOld6_j4lve8Nahudk0/edit)
made by **Zach Lieberman**.

このフォルダの CSV は、**Zach Lieberman** が作成した上記スプレッドシートのコピー（2026-11-17 取得）。

- His post / 公開時のポスト: https://x.com/zachlieberman/status/2122023218701586705
- The booklet / 元になった冊子: Hiroshima Animation Season 2026, “Your Favorite 12 Animated Short Films From the Past 120 Years (1906–2026)”
- Primary source for each participant's list / 各参加者のリストの一次ソース: https://animation.hiroshimafest.org/journal/

| File | Sheet tab | Contents |
| --- | --- | --- |
| `all-picks.csv` | All picks | One row per pick (participant + film), with film details and links |
| `participants.csv` | Participants | The 68 contributors, with affiliations and links |

As Zach notes, not everything has been verified: titles come from OCR and many YouTube links from automated search.
The meaning of the link tags (`(F)`, `(auto)`, …) is explained in the sheet's “About this file” tab.

A weekly workflow (`.github/workflows/sync-sheet.yml`) compares this copy with the sheet and opens a pull request when the sheet has changed. `scripts/snapshot-data.sh` does the same by hand.
