//
//  ListingXMLGenerator.m
//  PageLoadTest
//
//  Created by Daniel Phillips on 05/05/2005.
//  Copyright 2005 __MyCompanyName__. All rights reserved.
//

#import "ListingXMLGenerator.h"
#import "Programme.h"

@implementation ListingXMLGenerator
- (void) dealloc {
	//release the XML document
	[m_XmlDocument release];
	[super dealloc];
}

- (NSString*) getNextStringwithScanner:(NSScanner *)scanner {
    NSString* string;
	BOOL result = [scanner scanUpToString:@"~" intoString:&string];
	return (result == YES) ? string : nil;
}

- (BOOL)skipNumberOfTilde:(int)number withScanner:(NSScanner *)scanner {
	int i;
    for (i = 0; i < number; i++) {
		[scanner scanUpToString:@"~" intoString:nil];
		[scanner scanString:@"~" intoString:nil];
	}
	return YES;
}

- (NSXMLElement*) makeElementForProgramme:(Programme*)programme {	
	NSXMLElement* programmeElement= [NSXMLElement elementWithName:@"programme"];
	NSXMLNode* dateNode= [NSXMLNode attributeWithName:@"date" stringValue:[programme date]];
	[programmeElement addAttribute:dateNode];
	
	[programmeElement addChild:[NSXMLNode elementWithName:@"name" stringValue:[programme programmeName]]];
	[programmeElement addChild:[NSXMLNode elementWithName:@"startTime" stringValue:[programme startTime]]];
	[programmeElement addChild:[NSXMLNode elementWithName:@"endTime" stringValue:[programme endTime]]];
	[programmeElement addChild:[NSXMLNode elementWithName:@"duration" stringValue:[programme programmeDuration]]];
	
	if ([programme episodeName] != nil) {
		[programmeElement addChild:[NSXMLNode elementWithName:@"episode" stringValue:[programme episodeName]]];
    }
	
	if ([programme category] != nil) {
		[programmeElement addChild:[NSXMLNode elementWithName:@"category" stringValue:[programme category]]];
    }
	
	if ([programme filmReleaseYear] != nil) {
		[programmeElement addChild:[NSXMLNode elementWithName:@"releaseYear" stringValue:[programme filmReleaseYear]]];
    }
	
	if ([programme director] != nil) {
		[programmeElement addChild:[NSXMLNode elementWithName:@"director" stringValue:[programme director]]];
    }
	
	if ([programme cast] != nil) {
		[programmeElement addChild:[NSXMLNode elementWithName:@"cast" stringValue:[programme cast]]];
    }
    
	if ([programme description] != nil) {
		[programmeElement addChild:[NSXMLNode elementWithName:@"description" stringValue:[programme description]]];
    }
	
    return programmeElement;
}

- (Programme*) extractProgrammeFromString:(NSString *)programmeDetails {
	//create a scanner to parse the string
	NSScanner* scanner= [[NSScanner alloc] initWithString:programmeDetails];
    [scanner autorelease];
	[scanner setCaseSensitive:NO];
	
    Programme* programme = [[Programme alloc] init];
    [programme autorelease];
    
	//get programme name
    NSString* programmeName;
	[programme setProgrammeName:[self getNextStringwithScanner:scanner]];
	
	//get episode name (if applicable)
    [self skipNumberOfTilde:2 withScanner:scanner];
    NSString* episodeName = [self getNextStringwithScanner:scanner];
	if (episodeName != nil) {
        [programme setEpisodeName:episodeName];
    }
	
	//get year of release (if applicable)
	[self skipNumberOfTilde:1 withScanner:scanner];
    NSString* filmReleaseYear = [self getNextStringwithScanner:scanner];
	if (filmReleaseYear != nil) {
        [programme setFilmReleaseYear:filmReleaseYear];
    }
    
	//get director (if applicable)
	[self skipNumberOfTilde:1 withScanner:scanner];
    NSString* director = [self getNextStringwithScanner:scanner];
	if (director != nil) {
        [programme setDirector:director];
    }
	
	//get cast (if applicable)
	[self skipNumberOfTilde:1 withScanner:scanner];
    NSString* cast = [self getNextStringwithScanner:scanner];
	if (cast != nil) {
        [programme setCast:cast];
    }
	
	//get category (if applicable)
	[self skipNumberOfTilde:11 withScanner:scanner];
    NSString* category = [self getNextStringwithScanner:scanner];
	if (category != nil) {
        [programme setCategory:category];
    }
	
	//get description (if applicable)
	[self skipNumberOfTilde:1 withScanner:scanner];
    NSString* description = [self getNextStringwithScanner:scanner];
	if (description != nil) {
		NSMutableString *ms= [[NSMutableString alloc] initWithString:description];
		
		unichar c[1];
		c[0]= (unichar) 198;  //weird Æ character- I assume it should be a ' (apostrophe)
		NSString *apReplace= [NSString stringWithCharacters:c length:1];
		
		c[0]= (unichar) 249; //ù- I reckon it should be a hyphen
		NSString *hypReplace= [NSString stringWithCharacters:c length:1];
		[ms replaceOccurrencesOfString:apReplace withString:@"'" options:NSLiteralSearch range:NSMakeRange(0, [ms length])];
		[ms replaceOccurrencesOfString:hypReplace withString:@"--" options:NSLiteralSearch range:NSMakeRange(0, [ms length])];
		description= [NSString stringWithString:ms];
        [programme setDescription:description];
		[ms release];
	}
	
	//get date
	[self skipNumberOfTilde:2 withScanner:scanner];
    NSString* date = [self getNextStringwithScanner:scanner];
	if (date != nil) {
        [programme setDate:date];
    }
	
	//get start time
	[self skipNumberOfTilde:1 withScanner:scanner];
    NSString* startTime = [self getNextStringwithScanner:scanner];
	if (startTime != nil) {
		[programme setStartTime:startTime];
    }
	
	//get end time
	[self skipNumberOfTilde:1 withScanner:scanner];
    NSString* endTime = [self getNextStringwithScanner:scanner];
	if (endTime != nil) {
        [programme setEndTime:endTime];
    }
	
	//get programmeDuration
	[self skipNumberOfTilde:1 withScanner:scanner];
    NSString* programmeDuration = [self getNextStringwithScanner:scanner];
	if (programmeDuration != nil) {
		[programme setProgrammeDuration:programmeDuration];
    }
	
    return programme;
}

- (void) buildTreeFromData:(NSData *)listingData {
	NSString *outputString= [[NSString alloc] initWithData:listingData encoding:NSUTF8StringEncoding];
	NSArray *programmes= [outputString componentsSeparatedByString:@"\n"];
	[outputString release];
	outputString= nil;
	
	NSEnumerator *enumerator = [programmes objectEnumerator];
	NSString* programmeDetails;
	
	while (programmeDetails = [enumerator nextObject]) {
		Programme* programme = [self extractProgrammeFromString:programmeDetails];
		NSXMLElement* programmeElement = [self makeElementForProgramme:programme];
        [[m_XmlDocument rootElement] addChild:programmeElement];
	}
}

- (id) initWithListingData:(NSData*) listingData {
    if ([super init] == nil) {
        return nil;
    }
	
	//build the root of the XML document
	NSXMLElement* root = [NSXMLNode elementWithName:@"listing"];
	m_XmlDocument = [[NSXMLDocument alloc] initWithRootElement:root];
	[m_XmlDocument setVersion:@"1.0"];
	[m_XmlDocument setCharacterEncoding:@"UTF-8"];
    [self buildTreeFromData:listingData];
	return self;
}

- (NSXMLDocument*) xmlDocument {
    return m_XmlDocument;
}
@end
