wiki-evolution
==============

Visualize evolution of your MediaWiki based site

## Genesis

Port of [WikiEvolution extension](https://github.com/Wikia/app/tree/dev/extensions/wikia/hacks/WikiEvolution)
developed during [Wikia 2012 internship programme](http://community.wikia.com/wiki/User_blog:Macbre/Awesome_Projects_from_our_Interns)
by [@drzejzi](https://github.com/Drzejzi). It's meant to be run standalone (i.e. outside MediaWiki stack) and generate
[wonderful videos](https://www.youtube.com/watch?v=QE32HghV8-I) of how your site evolved from its very beginning.

## Requirements

* MediaWiki-based wiki
* [gource](https://github.com/acaudwell/Gource) for visualizing the history (will create a set of images)
* [ffmpeg](http://www.ffmpeg.org/) or [avconv](http://libav.org/avconv.html) to convert a set of images to a video file
* [xvfb](http://www.x.org/releases/X11R7.6/doc/man/man1/Xvfb.1.xhtml) to run gource in a virtual X server environment

Running

```
sudo apt-get install gource ffmpeg xvfb
```

should be enough on Debian-powered machines

## Examples

* [Poznań Wiki](http://www.youtube.com/watch?v=QE32HghV8-I)
* [Inciclopedia](http://www.youtube.com/watch?v=-AsGVA3HlSU)
* [German GTA Wiki](http://www.youtube.com/watch?v=a3NbIf3i36g)
* [Muppet Wiki](http://www.youtube.com/watch?v=P-ciO2CcIq0)
* [Kill Bill Wiki](http://www.youtube.com/watch?v=Xbhg1NDIQMs)
* [Marvel Database](http://www.youtube.com/watch?v=l6tggAc8aVM)

## Read more

* [gource - recording Videos](http://code.google.com/p/gource/wiki/Videos)
