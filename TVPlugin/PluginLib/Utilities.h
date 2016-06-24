//
//  Utilities.h
//  TVPlugin
//
//  Created by Daniel Phillips on 08/12/2007.
//  Copyright 2007 __MyCompanyName__. All rights reserved.
//

@class NSString;

@interface Utilities : NSObject {
}
+ (BOOL) doesFileExist:(NSString*)fileName;
+ (NSString*)getWidgetDataDirectory;
+ (void) writeXmlDocument:(NSXMLDocument*)xmlDocument toFile:(NSString*)fileName;
+ (NSString*) writeXmlDocumentAsString:(NSXMLDocument*)xmlDocument;
@end
