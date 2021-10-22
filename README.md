wiki-evolution
==============
[![Node.js CI](https://github.com/macbre/wiki-evolution/actions/workflows/node.js.yml/badge.svg)](https://github.com/macbre/wiki-evolution/actions/workflows/node.js.yml)

Visualize evolution of your [MediaWiki](https://www.mediawiki.org/wiki/MediaWiki) based site

## Docker-based run

The easiest way to use this tool is via Docker:

```
docker pull ghcr.io/macbre/wiki-evolution:latest

docker run --name=wiki-evolution --rm -it -v $(pwd)/data:/tmp/wiki-evolution ghcr.io/macbre/wiki-evolution:latest bash
```

And then inside the container run:

```
nobody@3e68fe7411f8:/opt/wiki-evolution# ./bin/wiki-evolution.sh <wiki domain>
```

Gource log files and the rendered webm movie will be stored in the `data/` directory on your host.

## Requirements

* MediaWiki-based wiki
* [gource](https://github.com/acaudwell/Gource) for visualizing the history (will create a set of images)
* [ffmpeg](https://www.ffmpeg.org/) to convert a set of images to a video file
* [xvfb](http://www.x.org/releases/X11R7.6/doc/man/man1/Xvfb.1.xhtml) to run gource in a virtual X server environment
* [nodejs](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager) with `npm` installed

Running

```
sudo apt-get install gource ffmpeg xvfb
```

should be enough on Debian-powered machines

For MacOS run:

```
brew install gource ffmpeg
```

## How to install and run it?

```
npm install -g wiki-evolution
```

and then run `wiki-evolution <wiki domain>`, for instance:

```
wiki-evolution poznan.wikia.com
wiki-evolution fo.wikipedia.org
```

This will install `wiki-evolution` npm module globally
and render the visualization for [poznan.wikia.com](http://poznan.wikia.com) and [Faroese Wikipedia](http://fo.wikipedia.org).

For large wikis with a long edits history you can include every N-th edit only:

```
EDITS_COMPRESSION=150 wiki-evolution muppet.wikia.com
```

This will include only the first, 150th, 300th, ... edit of each article.

## Debug mode

Run the `wiki-evolution` script with `DEBUG=1` env variable set to enable `nodemw` library debug mode:

```
DEBUG=1 EDITS_COMPRESSION=150 wiki-evolution muppet.wikia.com
...
debug:   API action: query
debug:   GET <http://muppet.wikia.com/api.php?action=query&prop=revisions&rvprop=ids%7Ctimestamp%7Csize%7Cflags%7Ccomment%7Cuser&rvdir=newer&rvlimit=5000&titles=X&continue=&format=json>
...
```

## Genesis

Port of [WikiEvolution extension](https://github.com/Wikia/app/tree/dev/extensions/wikia/hacks/WikiEvolution)
developed during [Wikia 2012 internship programme](http://community.wikia.com/wiki/User_blog:Macbre/Awesome_Projects_from_our_Interns)
by [@drzejzi](https://github.com/Drzejzi). It's meant to be run standalone (i.e. outside MediaWiki stack) and generate
[wonderful videos](https://www.youtube.com/watch?v=QE32HghV8-I) of how your site evolved from its very beginning.

### Examples

[![Poznańska Wiki](http://vignette3.wikia.nocookie.net/poznan/images/6/61/WikiEvolution_-_Pozna%C5%84ska_Wiki_2015/revision/latest?path-prefix=pl)](https://www.youtube.com/watch?v=9Lyk1IxvFaw)



* [Poznań Wiki](https://www.youtube.com/watch?v=QE32HghV8-I)
* [Inciclopedia](https://www.youtube.com/watch?v=-AsGVA3HlSU)
* [German GTA Wiki](https://www.youtube.com/watch?v=a3NbIf3i36g)
* [Muppet Wiki](https://www.youtube.com/watch?v=P-ciO2CcIq0)
* [Kill Bill Wiki](https://www.youtube.com/watch?v=Xbhg1NDIQMs)
* [Marvel Database](https://www.youtube.com/watch?v=l6tggAc8aVM)
* [Polish GTA Wiki](https://www.youtube.com/watch?v=T3hlgdBsX10)

## Read more

* [gource - recording Videos](http://code.google.com/p/gource/wiki/Videos)
