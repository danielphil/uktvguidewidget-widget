//
//  XMLChannelGenerator.m
//  PageLoadTest
//
//  Created by Daniel Phillips on 10/05/2005.
//  Copyright 2005 __MyCompanyName__. All rights reserved.
//

#import "XMLChannelGenerator.h"

@implementation XMLChannelGenerator

- (BOOL) extractFromString:(NSString *)channelDetails name:(NSString**)channelName number:(int*)channelNumber {
	NSArray *details= [channelDetails componentsSeparatedByString:@"|"];
	if ([details count] > 1) {
		*channelNumber = [[details objectAtIndex:0] intValue];
		*channelName = [details objectAtIndex:1];
        return YES;
	}
    return NO;
}

- (NSXMLElement*) createChannelElementWithNumber:(int)channelNumber name:(NSString*)channelName {	
	NSXMLElement* channelElement= [NSXMLElement elementWithName:@"channel"];
	NSXMLNode* nameNode= [NSXMLNode attributeWithName:@"name" stringValue:channelName];
    NSString* channelNumberString = [NSString stringWithFormat:@"%i", channelNumber];
	NSXMLNode* numberNode= [NSXMLNode attributeWithName:@"number" stringValue:channelNumberString];
	[channelElement addAttribute:nameNode];
	[channelElement addAttribute:numberNode];
	
    return channelElement;
}

- (void) buildTreeFromData:(NSData *)channelData {
    // Get the blob of data that we've loaded from the website, and split it into different lines
	NSString* outputString = [[NSString alloc] initWithData:channelData encoding:NSUTF8StringEncoding];
	NSArray* channels = [outputString componentsSeparatedByString:@"\n"];
    [outputString release];
	outputString= nil;
    
    // Build a dictionary of channel names to channel numbers
    NSMutableDictionary* namesToIds = [NSMutableDictionary dictionaryWithCapacity:[channels count]];
    
    NSEnumerator *enumerator = [channels objectEnumerator];
    id channelDetails;
    while (channelDetails = [enumerator nextObject]) {
        NSString* channelName;
        int channelNumber;
        if ([self extractFromString:channelDetails name:&channelName number:&channelNumber] == YES) {
            [namesToIds setObject:[NSNumber numberWithInt:channelNumber] forKey:channelName];
        }
	}
    
    // Then get the list of channel names in alphabetical order
    NSArray* sortedChannelNames = [[namesToIds allKeys] sortedArrayUsingSelector:@selector(localizedCaseInsensitiveCompare:)];
    
    // And enumerate each name
    enumerator = [sortedChannelNames objectEnumerator];
    id channelName;
	while (channelName = [enumerator nextObject]) {
        int channelNumber = [[namesToIds objectForKey:channelName] intValue];
        
        NSXMLElement* channelElement = [self createChannelElementWithNumber:channelNumber name:channelName];
        [[m_XmlDocument rootElement] addChild:channelElement];
	}
}

- (id) initWithChannelData:(NSData*) data {
    if ([super init] == nil) {
        return nil;
    }
	
	//build the root of the XML document
	NSXMLElement* root = [NSXMLNode elementWithName:@"channels"];
	m_XmlDocument = [[NSXMLDocument alloc] initWithRootElement:root];
	[m_XmlDocument setVersion:@"1.0"];
	[m_XmlDocument setCharacterEncoding:@"UTF-8"];
    [self buildTreeFromData:data];
	return self;
}

- (void) dealloc {
	//release the XML document
	[m_XmlDocument release];
	[super dealloc];
}

- (NSXMLDocument*) xmlDocument {
    return m_XmlDocument;
}
@end
