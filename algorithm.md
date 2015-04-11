Algorithm
=========

How does `wiki-evolution` generate the visualization.

## Revisions log

#### A. First we ask API for some basic wiki statistics.

[siteinfo](http://nordycka.wikia.com/api.php?action=query&meta=siteinfo&siprop=general|statistics) provides the following metrics:

* sitename
* number of pages
* number of edits

[Mostlinkedcategories](http://nordycka.wikia.com/api.php?action=query&list=querypage&qppage=Mostlinkedcategories&qplimit=500)
will give us the list of the biggest categories. It will be used to generate a "virtual path" for each article in
revision log. `value` field threshold is calculated as `2% * (number of pages)`.

#### B. Get all revisions for all pages

[Pages list API](http://nordycka.wikia.com/api.php?action=query&list=allpages&aplimit=500)

[Page's revisions API](http://nordycka.wikia.com/api.php?action=query&prop=categories|info|revisions&rvprop=ids|timestamp|size|flags|comment|user&titles=Wyspy%20Owcze&rvlimit=500)

Each revision is tagged with:

* **the type of a contribution**: (A)dded, (M)odified or (D)eleted
* **virtual path**: the list of categories the current page is in is taken, using the list of the biggest categories the list of N categories "generates" the virtual path followed by the article name: e.g. Countries/Europe/Nordic Countries/Iceland. The list is kept in order to generate a tree-like structure when visualized.
* **color**: the `max_edits_per_page` value is calculated using site statistics (see point A) = `number of edits / number of pages`. Then the color is calculated using the following formula: `white with alpha( max( 1, max_edits_per_page / current_page_edits_so_far ) )` (with alpha in between 0 and 1). The more active (the more edited) the article is the brighter it appears on the visualization. The new articles are displayed as blue, removed as red.

#### C. Generate the [custom log for gource](https://code.google.com/p/gource/wiki/CustomLogFormat)

```
<UNIX timestamp>|<author>|<(A)dded, (M)odified or (D)eleted>|<"virtual path" + article name>|<color>
```

```
1275543595|andrew|M|Countries/Europe/Nordic Countries/Iceland|FF0000
```

## Visualization

```sh
#!/bin/sh

resolution=1360x720
seconds_per_day=0.01
auto_skip_seconds=0.1
elasticity=0.05
output=gource.mp4

wiki-evolution --wiki <PATH TO api.php> | xvfb-run -a -s "-screen 0 $resolutionx24" gource \
  --log-format custom - \
  --seconds-per-day $seconds_per_day \
  --auto-skip-seconds $auto_skip_seconds \
  --elasticity $elasticity \
  --multi-sampling --stop-at-end -b 000000  --hide filenames,dirnames,progress,mouse --user-friction .2 \
  --background-image background.png --logo  wiki_logo.png --user-image-dir $wikiname/avatars \
  -$resolution \
  -o - | ffmpeg -y -r 60 -f image2pipe -vcodec ppm -i - \
  -vcodec libx264 -preset ultrafast -pix_fmt yuv420p -crf 1 -threads 0 -bf 0 $output
```
