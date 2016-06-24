//
//  Main.m
//  TVPlugin
//
//  Created by Daniel Phillips on 08/12/2007.
//  Copyright 2007 __MyCompanyName__. All rights reserved.
//

#import "Utilities.h"
#import "Channels.h"
#import "FaveXMLGenerator.h"
#import "ListingFetcher.h"
#import "ListingXMLGenerator.h"
#import "XMLChannelGenerator.h"

int main() {
    NSAutoreleasePool* autorelease_pool = [[NSAutoreleasePool alloc] init];
    NSLog([Utilities getWidgetDataDirectory]);
    
    NSData* data = [ListingFetcher getChannelListData];
    XMLChannelGenerator* channelGenerator = [[XMLChannelGenerator alloc] initWithChannelData:data];
    [channelGenerator autorelease];

    Channels* channels = [[Channels alloc] init];
    [channels autorelease];
    int retval = [channels loadChannelList];
    NSLog(@"loadChannelList returned %i", retval);
    NSLog(@"Channel 22 is %@", [channels getChannelNameForNumber:45]);
    
    /* Favourites test code */
    /*
     FaveXMLGenerator* fave_generator = [[FaveXMLGenerator alloc] initWithChannelNumbers:@"24 25 26 "];
    [fave_generator autorelease];
    NSLog([Utilities writeXmlDocumentAsString:[fave_generator xmlDocument]]);
    */
    /* Listing fetch test code */
    NSData* listingData = [ListingFetcher getListingDataForChannel:45];
    ListingXMLGenerator* listingGenerator = [[ListingXMLGenerator alloc] initWithListingData:listingData];
    [listingGenerator autorelease];
    NSLog([Utilities writeXmlDocumentAsString:[listingGenerator xmlDocument]]);
    
    /*
    NSData* channelData = [ListingFetcher getChannelListData];
    XMLChannelGenerator* channelListGenerator = [[XMLChannelGenerator alloc] initWithChannelData:channelData];
    [channelListGenerator autorelease];
    NSLog([Utilities writeXmlDocumentAsString:[channelListGenerator xmlDocument]]);
    */
    
    NSString* filename = [[Utilities getWidgetDataDirectory] stringByAppendingString:@"/faveChannels.xml"];
    BOOL file_exists = [Utilities doesFileExist:filename];
    NSLog(@"Does file %@ exist? %i", filename, file_exists);
    [autorelease_pool release];
    return 0;
}
