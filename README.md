# 12 favorite short animated films

**English** | [日本語](README.ja.md)

**▶ https://ubiquitous-o.github.io/12-Favorite-Short-Animated-Films/**

A static site that plays short animated films chosen by filmmakers, one after another, with credit to the people who picked them and to the sources.

## Using the site

- When the page opens it asks whether to start **with sound** or **muted**. If you don't choose, it starts muted after 15 seconds, and then keeps playing one film after another on its own. (Browsers do not allow sound to start without a click.)
- The panel beside the video lists every film and every person. Click a film to play it, or a person to play their list. The order, the filters and the previous/next buttons are at the top of that panel; the strip at the bottom is a timeline from 1906 to today.
- Keyboard controls are the same as YouTube's: `Space` or `K` play/pause, `←` `→` 5 seconds, `J` `L` 10 seconds, `↑` `↓` volume, `M` mute.
- The address changes with each film (for example `…/#f102`), so you can copy it to share a specific film.

## Credits

This site is built on the spreadsheet
**“[12 favorite short animated films](https://docs.google.com/spreadsheets/d/1BtHFvXhsUyDKANK-F2c1jDNItOld6_j4lve8Nahudk0/edit)”
made by [Zach Lieberman](https://x.com/zachlieberman)**
([his post](https://x.com/zachlieberman/status/2122023218701586705)).
He scanned and transcribed the booklet and looked up which films can be watched online. All film, participant and link data comes from that sheet, and the site borrows its name from it.

- **The people who picked**: the 68 contributors to the Hiroshima Animation Season 2026 booklet “Your Favorite 12 Animated Short Films From the Past 120 Years (1906–2026)”. The primary source for each person's list is the [festival's journal](https://animation.hiroshimafest.org/journal/).
- **The films**: all rights belong to their makers and rights holders. Films play through YouTube's embedded player; no video files are stored here.

As Zach notes himself, not everything in the sheet has been verified. Titles were transcribed by OCR and many YouTube links come from automated search. The site shows, for every video, which kind it is.

**Found a mistake or a problem?** If a video is the wrong film, some information is incorrect, or you are a filmmaker or rights holder and would like a film or a video removed, please [open an issue](https://github.com/ubiquitous-o/12-Favorite-Short-Animated-Films/issues).

## Data

Everything lives in this repository.

| Location | Contents |
| --- | --- |
| [`data/booklet/`](data/booklet/) | A copy of Zach Lieberman's spreadsheet as CSV (68 people, 808 picks and 593 films when first imported on 2026-11-17) |
| [`data/lists/`](data/lists/) | Lists from anyone else, one JSON file per person |

## Add your own list

1. Copy [`data/lists/_template.json`](data/lists/_template.json) to `data/lists/your-name.json`. Use only lowercase letters, digits, `.`, `_` and `-` in the file name, and do not start it with `_`.
2. Edit it and open a pull request.
3. Once merged, it appears on the site within a few minutes.

### Check before you open a pull request

[Run the site locally](#run-locally), open the People tab and select your list.

- A pick that was **merged into an existing film** shows the other people who picked it, and a count such as `×3` in the list.
- A pick that was **added as a new film** shows only you. If you expected it to match a film that is already there, the title is probably spelled differently: add the existing spelling to `aliases`. Otherwise the same film ends up listed twice.

The automatic checks on a pull request only verify the format of the file. They do not detect duplicates or wrong videos.

### Format

Only `name` and `picks` (each with a `title`) are required.

```json
{
  "name": "Your name",
  "handle": "@handle",
  "source": { "label": "Post on X", "url": "https://x.com/..." },
  "picks": [
    { "title": "Tango", "director": "Zbigniew Rybczyński" },
    { "title": "Hedgehog in the Fog", "director": "Yuri Norstein" }
  ]
}
```

If you add a list that someone else published, always fill in `source` with the original location.

### Field reference

Fields marked **text** can be a plain string, or `{ "en": "...", "ja": "..." }` to provide both languages. With a plain string, the same text is shown in both.

#### The list

| Field | Required | Type | What it is |
| --- | --- | --- | --- |
| *(file name)* | yes | — | `your-name.json`. Lowercase letters, digits, `.`, `_` and `-` only. It becomes the list's ID and part of the URLs of films only you picked, so avoid renaming it later. Files starting with `_` are ignored. |
| `name` | yes | string | Your name as it should be displayed. |
| `handle` | no | string | A handle shown next to the name, e.g. `@handle`. |
| `role` | no | text | Who you are: a title, affiliation or short description. Shown under the name. |
| `note` | no | text | A line about this list (how you chose, what it is). Shown when your list is selected. |
| `source` | no | object | Where the list was first published. Shown as the “source” link next to your name on every film you picked. If omitted, the list is labelled “Submitted to this site”. |
| `source.url` | no | URL | Link to the original post or page. Must start with `http://` or `https://`. |
| `source.label` | no | text | Text of that link, e.g. `Post on X`. Defaults to “Source”. |
| `links` | no | object | Your own links, as `{ "Label": "URL" }`. Any labels work (`Website`, `X`, `Instagram`, `YouTube`, `Vimeo`…). Shown when your list is selected. |
| `picks` | yes | array | Your films, in the order you want them listed and played. At least one. |

#### Each pick

| Field | Required | Type | What it is |
| --- | --- | --- | --- |
| `title` | yes | string | The film's title. Used for display and for matching against films already on the site. |
| `aliases` | no | array of strings | Other titles (original-language title, alternative translations). Only used for matching; the first one that matches wins. |
| `director` | no, but recommended | string | Director(s). Separate several with ` / `. Used for display and to confirm a match. |
| `year` | no | number | Year of release. Places the film in the timeline and the by-year order. |
| `country` | no | string | Country of production, in English. |
| `jpTitle` | no | string | Japanese title, shown under the main title in the Japanese interface. |
| `youtube` | no | URL, or array of URLs | The video to play: `https://www.youtube.com/watch?v=…` or `https://youtu.be/…`. Without it the film is listed but skipped during playback. |
| `youtubeKind` | no | string | How the video is labelled; see below. Defaults to `"auto"`. |
| `official` | no | string | An official or best place to watch, shown as a link. Either a URL, or `Label: URL`; separate several with ` \| `. |
| `notes` | no | text | Anything worth adding about the film or the video. |

Values for `youtubeKind`:

| Value | Label on the site | Use it when |
| --- | --- | --- |
| `"manual"` | Video chosen by the list's author | You have watched the video and it is the right film. |
| `"auto"` *(default)* | Matched by search (unverified) | The link was found by searching and not checked. |
| `"clip"` | Trailer or clip | It is not the full film. Skipped when “Include trailers & clips” is off. |
| `"doubt"` | Doubtful match | You are not sure it is the right film. Skipped unless “Include doubtful matches” is on. |

Please prefer official uploads by the filmmaker or distributor.

#### How picks are matched to existing films

- A pick is merged into a film already on the site when its `title` or one of its `aliases` equals that film's title (English or Japanese), **and** the directors share at least one name word of four or more letters. If you leave out `director`, the title alone decides.
- Comparison ignores case, accents, punctuation, spaces and a leading “The”, “A” or “An”. So `the snails` matches `The Snails`, and `Svankmajer` matches `Švankmajer`.
- When a pick is merged, you are added to that film's “Picked by” list and **the existing film's details and video are used**. Your `year`, `country`, `jpTitle`, `youtube`, `youtubeKind`, `official` and `notes` for that pick are ignored.
- When nothing matches, the pick is added as a new film using the fields you provided.
- To correct the details or the video of an existing film, edit [`data/booklet/all-picks.csv`](data/booklet/all-picks.csv) instead.

## Run locally

YouTube embeds do not work from `file://`, so serve the folder over HTTP.

```bash
python3 -m http.server 4173
```

To run the same validation as pull requests do (requires `jq`):

```bash
sh scripts/build-index.sh
```

That script also writes `data/lists/index.json`. While that file exists, the local site only loads the lists named in it, so a JSON file you add afterwards will not appear until you run the script again or delete `data/lists/index.json`. (Without the file, the local site picks up every JSON file in the folder. The file is not committed.)

## How it is published

[`.github/workflows/site.yml`](.github/workflows/site.yml) runs on every push to `main`.

1. Validates `data/lists/*.json` and generates the index `data/lists/index.json`.
2. Publishes to GitHub Pages.

On pull requests only step 1 runs.

The first time, set Settings → Pages → Source to “GitHub Actions”.

### Keeping up with the sheet

The site reads the copy in `data/booklet/`, not the sheet itself, so nothing that happens to the sheet can break the site.

[`.github/workflows/sync-sheet.yml`](.github/workflows/sync-sheet.yml) compares the two once a week (and on demand from the Actions tab):

| What it finds | What it does |
| --- | --- |
| No difference | Nothing |
| The sheet was updated | Opens a pull request with the new data. A person decides whether to merge |
| The sheet cannot be read (deleted or made private) | Leaves the data alone and opens an issue |
| The sheet was emptied or lost more than 20% of its rows | Leaves the data alone and opens an issue |
| The sheet's columns changed | Leaves the data alone and opens an issue |

Merging the pull request overwrites any fixes made directly to the CSV files in `data/booklet/`; review the diff and re-apply the ones still needed.

For the workflow to open pull requests, enable Settings → Actions → General → “Allow GitHub Actions to create and approve pull requests”.

To do the same by hand:

```bash
sh scripts/snapshot-data.sh
```

If a large deletion in the sheet is intended, add `--force` to accept it.

GitHub pauses scheduled workflows after 60 days without activity in the repository. If the weekly check stops, re-enable it from the Actions tab.
