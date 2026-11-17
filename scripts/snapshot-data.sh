#!/bin/sh
# Zach Lieberman のスプレッドシートの現在の内容を data/booklet/ に取り込み直す。
# 注意: data/booklet/ の CSV をこのリポジトリで直接直していた場合、その修正は上書きされる。
# 実行後に git diff で差分を確かめてからコミットすること。
set -eu
cd "$(dirname "$0")/.."
BASE="https://docs.google.com/spreadsheets/d/1BtHFvXhsUyDKANK-F2c1jDNItOld6_j4lve8Nahudk0/gviz/tq?tqx=out:csv&headers=1"
mkdir -p data/booklet
curl -fsSL "$BASE&sheet=All%20picks" -o data/booklet/all-picks.csv
curl -fsSL "$BASE&sheet=Participants" -o data/booklet/participants.csv
wc -l data/booklet/all-picks.csv data/booklet/participants.csv
