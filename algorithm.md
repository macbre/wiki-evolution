Algorithm
=========

How does `wiki-evolution` generate the visualization.

## Revisions log

A. First we ask API for some basic wiki statistics.

[siteinfo](http://nordycka.wikia.com/api.php?action=query&meta=siteinfo&siprop=general|statistics) provides the following metrics:

* sitename
* number of pages
* number of edits

[allcategories](http://nordycka.wikia.com/api.php?action=query&list=allcategories&acprop=size&acmin=200&aclimit=500)
will give us the list of the biggest categories. It will be used to generate a "virtual path" for each article in
revision log. `acmin` is calculated as `2% * (number of pages)`.

B. Get all revisions in chronological order

C. Generate the [custom log for gource](https://code.google.com/p/gource/wiki/CustomLogFormat)

```
<UNIX timestamp>|<author>|<(A)dded, (M)odified or (D)eleted>|<"virtual path" + article name>|<color>
```

```
1275543595|andrew|M|Countries/Europe/Nordic Countries/Iceland|FF0000
```

## Visualization

TODO
