#!/bin/sh
# data/lists/*.json を検証し、サイトが読む一覧 data/lists/index.json を作る。
# "_" で始まるファイル（テンプレートなど）は対象外。jq が必要。
set -eu
cd "$(dirname "$0")/.."

CHECK='
  (.name | type == "string" and length > 0)
  and (.picks | type == "array" and length > 0)
  and all(.picks[];
    (.title | type == "string" and length > 0)
    and ((.director // "") | type == "string")
    and ((.youtubeKind // "auto") | IN("manual", "auto", "clip", "doubt", "full"))
    and ((.youtube // []) | if type == "array" then . else [.] end
         | all(.[]; type == "string" and test("^https://(www\\.)?(youtube\\.com/watch\\?v=|youtu\\.be/)[A-Za-z0-9_-]{11}"))))
  and ((.source.url // "https://") | test("^https?://"))
'

status=0
names=""
for f in data/lists/*.json; do
  b=$(basename "$f")
  case "$b" in _*|index.json) continue ;; esac
  case "$b" in *[!a-z0-9._-]*) echo "NG $f: file names may only use lowercase letters, digits and hyphens" >&2; status=1; continue ;; esac
  if jq -e "$CHECK" "$f" >/dev/null; then
    echo "OK $f"
    names="$names $b"
  else
    echo "NG $f: needs \"name\" and \"picks\" (each with a \"title\"); \"youtube\" must be a YouTube video URL, \"youtubeKind\" one of manual/auto/clip/doubt, and \"source.url\" an http(s) URL" >&2
    status=1
  fi
done
[ "$status" -eq 0 ] || exit 1

# shellcheck disable=SC2086
printf '%s\n' $names | jq -R 'select(length > 0)' | jq -s . > data/lists/index.json
echo "data/lists/index.json:"; cat data/lists/index.json
