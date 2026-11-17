#!/bin/sh
# Zach Lieberman のスプレッドシートを取得し、問題がなければ data/booklet/ に取り込む。
#
#   sh scripts/snapshot-data.sh           取得して確認し、内容が変わっていれば data/booklet/ を更新
#   sh scripts/snapshot-data.sh --force   行数が大きく減っていても取り込む（意図した削除のとき）
#
# シートが読めない・空になった・別物になった場合は data/booklet/ に触らず、終了コード 2 で止まる。
# 注意: data/booklet/ の CSV をこのリポジトリで直接直していた場合、その修正は上書きされる。
# 実行後に git diff で差分を確かめてからコミットすること。
#
# 結果は標準出力と、GitHub Actions では $GITHUB_OUTPUT にも書く:
#   result=unchanged | changed | problem
set -eu
cd "$(dirname "$0")/.."

SHEET_BASE="${SHEET_BASE:-https://docs.google.com/spreadsheets/d/1BtHFvXhsUyDKANK-F2c1jDNItOld6_j4lve8Nahudk0/gviz/tq?tqx=out:csv&headers=1}"
MIN_PERCENT=80   # 行数がいまの 80% を下回ったら「消された」とみなして止める
FORCE=0
[ "${1:-}" = "--force" ] && FORCE=1

DEST=data/booklet
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

finish() { # finish <result> <message>
  echo "$1: $2"
  if [ -n "${GITHUB_OUTPUT:-}" ]; then
    { echo "result=$1"; echo "message=$2"; } >> "$GITHUB_OUTPUT"
  fi
  [ "$1" = "problem" ] && exit 2
  exit 0
}

rows() { wc -l < "$1" | tr -d ' '; }

# check <file> <sheet tab> <words that must appear in the header row...>
check() {
  file=$1; tab=$2; shift 2
  if ! curl -fsSL "$SHEET_BASE&sheet=$tab" -o "$TMP/$file"; then
    finish problem "could not download the '$tab' sheet (deleted, private, or network error)"
  fi
  # 非公開のシートは、エラーではなくログイン画面の HTML を返す
  if [ ! -s "$TMP/$file" ] || head -c 1 "$TMP/$file" | grep -q '<'; then
    finish problem "the '$tab' sheet did not return CSV (it is probably private or deleted)"
  fi
  header=$(head -n 1 "$TMP/$file")
  for word in "$@"; do
    case "$header" in
      *"\"$word"*) ;;
      *) finish problem "the '$tab' sheet no longer has a '$word' column (its layout changed)" ;;
    esac
  done
  new=$(rows "$TMP/$file")
  if [ -f "$DEST/$file" ] && [ "$FORCE" -eq 0 ]; then
    old=$(rows "$DEST/$file")
    if [ $((new * 100)) -lt $((old * MIN_PERCENT)) ]; then
      finish problem "the '$tab' sheet shrank from $old to $new lines (rerun with --force if this is intended)"
    fi
  fi
}

check all-picks.csv "All%20picks" Participant Title "Director" "YouTube links" "Film ID"
check participants.csv "Participants" Name "Festival website page"

if cmp -s "$TMP/all-picks.csv" "$DEST/all-picks.csv" 2>/dev/null &&
   cmp -s "$TMP/participants.csv" "$DEST/participants.csv" 2>/dev/null; then
  finish unchanged "data/booklet already matches the spreadsheet"
fi

old_picks=0; [ -f "$DEST/all-picks.csv" ] && old_picks=$(rows "$DEST/all-picks.csv")
old_people=0; [ -f "$DEST/participants.csv" ] && old_people=$(rows "$DEST/participants.csv")
mkdir -p "$DEST"
cp "$TMP/all-picks.csv" "$TMP/participants.csv" "$DEST/"
finish changed "all-picks.csv $old_picks -> $(rows "$DEST/all-picks.csv") lines, participants.csv $old_people -> $(rows "$DEST/participants.csv") lines"
