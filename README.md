![Chroma Key](/media/chromakey-cover.png)
![Chroma Key Banner](/media/chromakey-cover-2.png)


# Chroma Key

[![Figma Plugin Link](https://img.shields.io/badge/figma-Chroma%20Key-yellow?cacheSeconds=1800)](https://www.figma.com/community/plugin/1447571557105401360/chroma-key)

Replace a color in your image or make it transparent — it's that easy!

Background removal can often complicate things when all you need is to remove a simple color background, and Photoshop takes too long to load. That's where this plugin comes in!


I made this because I couldn't find anything to do something that simple and I wanted to help others in a similar boat.


This couldn't have been possible without the open-source packages [replace-color](https://github.com/turakvlad/replace-color) and [JIMP](https://jimp-dev.github.io/jimp/).


— Khaleel (updates on [Mastodon](https://social.dino.icu/@thepixelatedonut))

## how

Uses the [replace-color](https://github.com/turakvlad/replace-color) package to do the magic because I am not smart enough to implement my own algorithm. BUT IT WASNT SO STRAIGHT FORWARD BECAUSE I WENT THROUGH A LOT OMG IM NEVER DOING THIS AGAIN - full details on my blog soon!

Apart from directly substituting colors pixel-by-pixel, the replace-color package also uses a JND algorithm to make the color replacement more accurate and less noticeable - that means substituting colors that are similar to the target color. The plugin uses the [Delta E value](http://zschuessler.github.io/DeltaE/learn/) for the JND E 2000 algorithm, which is seemingly the best science has to offer.

Making a Figma plugin is like forming a contract with the devil. There's only a lot of things you can do in such a sandboxed environment, one that lies in the grayness of Node.js and the browser. I had to make a lot of compromises to make this work, but I'm happy with the result. Apparently, there are a lot of third-party tools to improve the DX, but those were overkill. Imagine having to add React to a Figma plugin. I'm not doing that.