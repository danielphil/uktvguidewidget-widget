//
//  Utilities.m
//  TVPlugin
//
//  Created by Daniel Phillips on 08/12/2007.
//  Copyright 2007 __MyCompanyName__. All rights reserved.
//

#import "Utilities.h"

static NSString* m_data_directory_path = nil;

@implementation Utilities

+ (BOOL) doesFileExist:(NSString*)fileName {
    return [[NSFileManager defaultManager] fileExistsAtPath:fileName];
}

+ (NSString*)getWidgetDataDirectory {
    if (m_data_directory_path == nil) {
        NSArray* paths = NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES);
        NSString* basePath= [paths objectAtIndex:0];
        m_data_directory_path = [basePath stringByAppendingString:@"/UKTVGuideWidget"];
        [m_data_directory_path retain];
    }
	return m_data_directory_path;
}

+ (void) writeXmlDocument:(NSXMLDocument*)xmlDocument toFile:(NSString*)fileName {
    NSData *xmlData = [xmlDocument XMLDataWithOptions:NSXMLNodePrettyPrint];
    if (![xmlData writeToFile:fileName atomically:NO]) {
        NSString* reason = [@"Error writing XML Document to " stringByAppendingString:fileName];
        @throw [NSException exceptionWithName:@"XmlWritingError" reason: reason userInfo:nil];
    }
}

+ (NSString*) writeXmlDocumentAsString:(NSXMLDocument*)xmlDocument {
    NSData* xmlData = [xmlDocument XMLDataWithOptions:NSXMLNodePrettyPrint];
	NSString* outputString= [[NSString alloc] initWithData:xmlData encoding:NSUTF8StringEncoding];
	[outputString autorelease];
	return outputString;
}
@end
