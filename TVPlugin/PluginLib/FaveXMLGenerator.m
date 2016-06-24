//
//  FaveXMLGenerator.m
//  PageLoadTest
//
//  Created by Daniel Phillips on 11/05/2005.
//  Copyright 2005 __MyCompanyName__. All rights reserved.
//

#import "FaveXMLGenerator.h"

@implementation FaveXMLGenerator
- (NSXMLElement*) createElementForChannelNumber:(int)channelNumber {
	NSXMLElement* numberElement = [NSXMLElement elementWithName:@"channel"];
    NSString* channelNumberString = [NSString stringWithFormat:@"%i", channelNumber];
	NSXMLNode* numberAttribute = [NSXMLNode attributeWithName:@"number" stringValue:channelNumberString];
	[numberElement addAttribute:numberAttribute];
	return numberElement;
}

- (void) buildTreeFromString:(NSString *)channelNumbers {
	NSArray *channels= [channelNumbers componentsSeparatedByString:@" "];
	
	NSEnumerator *enumerator = [channels objectEnumerator];
	
    NSString* channel;
	while (channel = [enumerator nextObject]) {
        if ([channel length] == 0) {
            continue;
        }
        int channelNumber = [channel intValue];
		NSXMLElement* new_element = [self createElementForChannelNumber:channelNumber];
        [[m_xml_document rootElement] addChild:new_element];
	}
}

- (id) initWithChannelNumbers:(NSString*)channelNumbers {
    if ([super init] == nil) {
        return nil;
    }
	
	//build the root of the XML document
	NSXMLElement* root_element = [NSXMLNode elementWithName:@"favChannels"];
	m_xml_document = [[NSXMLDocument alloc] initWithRootElement:root_element];
	[m_xml_document setVersion:@"1.0"];
	[m_xml_document setCharacterEncoding:@"UTF-8"];
    [self buildTreeFromString:channelNumbers];
	return self;
}

- (void) dealloc {
	//release the XML document
	[m_xml_document release];
	[super dealloc];
}

- (NSXMLDocument*) xmlDocument {
    return m_xml_document;
}
@end
