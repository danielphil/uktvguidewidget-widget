//
//  Channels.m
//  TVPlugin
//
//  Created by Daniel Phillips on 13/11/2005.
//  Copyright 2005 __MyCompanyName__. All rights reserved.
//

#import "Channels.h"
#import "Utilities.h"

@implementation Channels
- (id) init {
	if ([super init] == nil) {
        return nil;
    }
    
	m_channels = [[NSMutableDictionary alloc] init];
	return self;
}

- (void) dealloc {
	[m_channels release];
	[super dealloc];
}

- (NSString *) getChannelNameForNumber:(int)channelNumber {
	NSString* channelName = [m_channels objectForKey:[NSNumber numberWithInt:channelNumber]];
	return (channelName == nil) ? @"No such channel" : channelName;
}

- (int) loadChannelList {
	[m_channels removeAllObjects];
	
    NSString *filename = [[Utilities getWidgetDataDirectory] stringByAppendingString:@"/channels.xml"];
	NSData *channelXMLFile = [NSData dataWithContentsOfFile:filename];
	if (channelXMLFile == nil) {
		NSLog(@"Unable to open channels.xml");
		return 1;
	}
	
    NSError *err = nil;
	NSXMLDocument *xmlDoc = 
		[[NSXMLDocument alloc] initWithData:channelXMLFile options:NSXMLNodeOptionsNone error:&err];
	if (xmlDoc == nil) {
		NSLog(@"Couldn't parse channels.xml");
		return 2;
	}
	
	NSArray *channels = [[xmlDoc rootElement] elementsForName:@"channel"];
	
	NSEnumerator *enumerator = [channels objectEnumerator];
	id channel;
	
	while (channel = [enumerator nextObject]) {
		NSString *channelNumberString = [[channel attributeForName:@"number"] objectValue];
		NSString *channelName = [[channel attributeForName:@"name"] objectValue];
        NSNumber *channelNumber = [NSNumber numberWithInt:[channelNumberString intValue]];
		[m_channels setObject:channelName forKey:channelNumber];
	}
	
	[xmlDoc release];
	return 0;
}

@end
