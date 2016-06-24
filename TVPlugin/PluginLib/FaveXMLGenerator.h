//
//  FaveXMLGenerator.h
//  PageLoadTest
//
//  Created by Daniel Phillips on 11/05/2005.
//  Copyright 2005 __MyCompanyName__. All rights reserved.
//

@interface FaveXMLGenerator : NSObject {
    NSXMLDocument* m_xml_document;
}
- (id)initWithChannelNumbers:(NSString *)channelNumbers;
- (NSXMLDocument*)xmlDocument;
@end
