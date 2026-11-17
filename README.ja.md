# 12 favorite short animated films

[English](README.md) | **日本語**

作家たちが選んだ短編アニメーションを、選んだ人と出典の情報とともに順番に流し続ける静的サイト。

## クレジット

このサイトの土台は、**[Zach Lieberman](https://x.com/zachlieberman) が作成したスプレッドシート
「[12 favorite short animated films](https://docs.google.com/spreadsheets/d/1BtHFvXhsUyDKANK-F2c1jDNItOld6_j4lve8Nahudk0/edit)」**
（[公開時のポスト](https://x.com/zachlieberman/status/2122023218701586705)）。
冊子をスキャンして書き起こし、どの作品がオンラインで観られるかを調べてまとめたもので、作品・推薦者・リンクのデータはすべてこのシートによる。サイト名もシートの名前をそのまま借りている。

- **選んだ人たち**: ひろしまアニメーションシーズン2026 の冊子「Your Favorite 12 Animated Short Films From the Past 120 Years (1906–2026)」に寄稿した68名。各人のリストの一次ソースは[映画祭ジャーナル](https://animation.hiroshimafest.org/journal/)。
- **作品**: 権利は各作者・権利者のもの。動画は YouTube の埋め込みで再生しており、ファイルは保存していない。

Zach 本人が書いているとおり、シートのすべてが検証済みではない。タイトル等は OCR、YouTube リンクの多くは自動検索によるもので、サイト上では動画ごとにその区別を表示している。

## データ

すべてこのリポジトリにある。

| 場所 | 中身 |
| --- | --- |
| [`data/booklet/`](data/booklet/) | Zach Lieberman のスプレッドシートのコピー（CSV）。68名・808ピック・593作品 |
| [`data/lists/`](data/lists/) | それ以外の人のリスト。1人1ファイルの JSON |

## 自分のリストを追加する

1. [`data/lists/_template.json`](data/lists/_template.json) をコピーして `data/lists/自分の名前.json` を作る（ファイル名は英小文字・数字・ハイフン）。
2. 中身を書き換えてプルリクエストを出す。
3. マージされると数分でサイトに載る。

### 書き方

必須は `name` と `picks`（各作品の `title`）だけ。

```json
{
  "name": "名前",
  "handle": "@handle",
  "source": { "label": "X のポスト", "url": "https://x.com/..." },
  "picks": [
    { "title": "Tango", "director": "Zbigniew Rybczyński" },
    { "title": "Hedgehog in the Fog", "director": "Yuri Norstein" }
  ]
}
```

他人が公開したリストを代わりに追加する場合は、必ず `source` に元の場所を書くこと。

### フィールド一覧

型が **文章** の項目は、ただの文字列でも、`{ "en": "...", "ja": "..." }` として両方の言語を書いてもよい。文字列だけの場合は、どちらの言語表示でも同じ文が出る。

#### リスト全体

| フィールド | 必須 | 型 | 内容 |
| --- | --- | --- | --- |
| *（ファイル名）* | 必須 | — | `your-name.json`。英小文字・数字・`.`・`_`・`-` のみ。これがリストの ID になり、あなただけが選んだ作品の URL にも含まれるので、あとから変えないほうがよい。`_` で始まるファイルは無視される。 |
| `name` | 必須 | 文字列 | 表示する名前。 |
| `handle` | 任意 | 文字列 | 名前の横に出すハンドル。例: `@handle`。 |
| `role` | 任意 | 文章 | 肩書き、所属、短い自己紹介。名前の下に出る。 |
| `note` | 任意 | 文章 | このリストについてのひとこと（選び方など）。リストを選んだときに出る。 |
| `source` | 任意 | オブジェクト | リストを最初に公開した場所。あなたが選んだすべての作品で、名前の横に「出典」リンクとして出る。省略すると「このサイトへの投稿」と表示される。 |
| `source.url` | 任意 | URL | 元のポストやページへのリンク。`http://` か `https://` で始まること。 |
| `source.label` | 任意 | 文章 | そのリンクの文言。例: `X のポスト`。省略すると「出典」。 |
| `links` | 任意 | オブジェクト | 自分のリンク。`{ "ラベル": "URL" }` の形。ラベルは自由（`Website`、`X`、`Instagram`、`YouTube`、`Vimeo` など）。リストを選んだときに出る。 |
| `picks` | 必須 | 配列 | 選んだ作品。書いた順に一覧に並び、その順に上映される。1件以上。 |

#### 作品（picks の各要素）

| フィールド | 必須 | 型 | 内容 |
| --- | --- | --- | --- |
| `title` | 必須 | 文字列 | 作品のタイトル。表示と、すでに載っている作品との照合に使う。 |
| `aliases` | 任意 | 文字列の配列 | 別のタイトル（原題、別の訳題）。照合にだけ使う。最初に一致したものが採用される。 |
| `director` | 任意（推奨） | 文字列 | 監督。複数なら ` / ` で区切る。表示と、照合の確認に使う。 |
| `year` | 任意 | 数値 | 公開年。年表と年代順の並びでの位置が決まる。 |
| `country` | 任意 | 文字列 | 製作国。英語表記で。 |
| `jpTitle` | 任意 | 文字列 | 日本語題。日本語表示のとき、タイトルの下に出る。 |
| `youtube` | 任意 | URL、または URL の配列 | 上映する動画。`https://www.youtube.com/watch?v=…` か `https://youtu.be/…`。書かなければ一覧には載るが、上映では飛ばされる。 |
| `youtubeKind` | 任意 | 文字列 | 動画の表示ラベル。下の表を参照。省略すると `"auto"`。 |
| `official` | 任意 | 文字列 | 公式または最良の視聴先。リンクとして出る。URL だけ、または `ラベル: URL`。複数なら ` \| ` で区切る。 |
| `notes` | 任意 | 文章 | 作品や動画についての補足。 |

`youtubeKind` の値:

| 値 | サイトでの表示 | 使う場面 |
| --- | --- | --- |
| `"manual"` | リスト作成者が指定した動画 | 自分で観て、その作品だと確かめた動画。 |
| `"auto"`（既定） | 検索でマッチした動画（未確認） | 検索で見つけただけで、確かめていない動画。 |
| `"clip"` | 予告編・抜粋 | 本編ではない動画。「予告編・抜粋も流す」を切ると飛ばされる。 |
| `"doubt"` | 自動マッチ・不確か | その作品か自信がない動画。「不確かなマッチも流す」を入れないと飛ばされる。 |

動画はできるだけ作者本人や配給元の公式アップロードを選んでほしい。

#### すでに載っている作品との照合

- `title` か `aliases` のどれかが、載っている作品のタイトル（英題または日本語題）と一致し、**かつ**監督名に4文字以上の同じ単語が1つでもあれば、その作品にまとめられる。`director` を省略した場合はタイトルだけで決まる。
- 比較では、大文字小文字、アクセント記号、句読点、空白、先頭の “The” “A” “An” を無視する。`the snails` は `The Snails` に、`Svankmajer` は `Švankmajer` に一致する。
- まとめられた場合、その作品の「この作品を選んだ人」にあなたが加わり、**作品の情報と動画は既存のものが使われる**。その作品に書いた `year`、`country`、`jpTitle`、`youtube`、`youtubeKind`、`official`、`notes` は無視される。
- どれにも一致しなければ、書いた内容で新しい作品として追加される。
- 既存の作品の情報や動画を直したいときは、[`data/booklet/all-picks.csv`](data/booklet/all-picks.csv) を編集する。

## 手元で動かす

YouTube の埋め込みは `file://` では動かないので、HTTP サーバーで開く。

```bash
python3 -m http.server 4173
```

プルリクエストと同じ検証を手元で走らせる（`jq` が必要）:

```bash
sh scripts/build-index.sh
```

## 公開のしくみ

[`.github/workflows/site.yml`](.github/workflows/site.yml) が `main` への push で動く。

1. `data/lists/*.json` を検証し、一覧 `data/lists/index.json` を作る。
2. GitHub Pages に公開する。

プルリクエストでは 1 の検証だけが走る。

初回だけ、リポジトリの Settings → Pages → Source を「GitHub Actions」にする。

### シートの更新を取り込む

Zach のシートが更新されたら、次を実行して差分を確かめてからコミットする。`data/booklet/` の CSV を直接直していた場合、その修正は上書きされるので注意。

```bash
sh scripts/snapshot-data.sh
```
