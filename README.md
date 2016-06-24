# UK TV Guide Widget

This was a dashboard widget that I first created back in 2005 when OS X Tiger was released with the shiny new Dashboard feature. Since then I've made some minor modifications to it to keep it running, but I haven't touched it since about 2010.

Unfortunately, the Radio Times TV listing data (http://xmltv.radiotimes.com/xmltv/channels.dat) has been taken offline and the widget no longer has a data source for fetching listings. So for now, it's broken. 😢 This is more of a historical archive in case I ever want to go back and see what my code was like in 2005 before I had my first development job!

The widget includes a native plugin for performing most of the data retrieval tasks while the rest of the functionality was implemented in JavaScript. My memory is hazy, but I don't think Dashboard had an API for writing files to disk in JavaScript, so I used Objective-C to save TV listings to disk. Development on the Mac was new to me at the time, so it was quite a learning experience! I also remember being frustrated at trying to build a GUI using HTML and CSS and wished for a nice GUI editor like native Cocoa apps. In retrospect, that design decision in Dashboard was actually far ahead of its time and now entire applications are built using HTML and CSS GUIs.

Sometimes it's fun to look back. 😉

If you're just looking to download a compiled version of the widget, there's an old webpage for the widget here: http://danielphil.github.io/uktvguidewidget/
