#!/bin/bash

wikiname=$1
echo "Generating wiki evolution for $wikiname..."
echo

gource --help | head -n 1
avconv -V 2>&1 | head -n 2

echo

# settings
resolution=1360x720
seconds_per_day=0.04
auto_skip_seconds=0.05
elasticity=0.01
fps=25
bitrate=5000K
extension=webm

# environment
dir=`dirname $0`

echo "My directory: $dir"

# set up the environment
workdir="/tmp/wiki-evolution/output/$wikiname"
mkdir -p $workdir

input=$workdir"/log.gource"
output=$workdir"/movie.$extension"

echo "Input:        $input"
echo "Rendering to: $output"
echo

# call wiki2gource
if [ ! -f $input ]; then
	echo "Calling wiki2gource..."
	/usr/bin/env node $dir/wiki2gource.js $wikiname | sort > $input
else
	echo "$input exists, remove to regenerate"
fi

echo
echo "Rendering $extension at $resolution @ $fps fps to $output..."
echo

# TODO: fetch custom backgrounds and logos

# call gource
nice -n 20 xvfb-run -a -s "-screen 0 $resolution""x16" gource \
	--log-format custom \
	--stop-at-end \
	--seconds-per-day $seconds_per_day \
	--auto-skip-seconds $auto_skip_seconds \
	--elasticity $elasticity \
	--highlight-users \
	-b 000000 \
	--hide dirnames,progress,mouse \
	--user-friction .2 \
	--font-size 16 \
	--title "wiki-evolution for $wikiname" \
	-$resolution \
	--output-ppm-stream - \
	--output-framerate $fps \
	$input | avconv -y -r $fps -f image2pipe -vcodec ppm -i - -b $bitrate $output

echo
echo "Done, enjoy!"
