Algorithm
=========

How does `wiki-evolution` generate the visualization.

## Revisions log

#### A. First we ask API for some basic wiki statistics.

[siteinfo](http://nordycka.wikia.com/api.php?action=query&meta=siteinfo&siprop=general|statistics) provides the following metrics:

* sitename
* number of pages
* number of edits

[allcategories](http://nordycka.wikia.com/api.php?action=query&list=allcategories&acprop=size&acmin=200&aclimit=500)
will give us the list of the biggest categories. It will be used to generate a "virtual path" for each article in
revision log. `acmin` is calculated as `2% * (number of pages)`.

#### B. Get all revisions in chronological order

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

TODO
