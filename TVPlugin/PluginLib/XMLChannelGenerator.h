//
//  XMLChannelGenerator.h
//  PageLoadTest
//
//  Created by Daniel Phillips on 10/05/2005.
//  Copyright 2005 __MyCompanyName__. All rights reserved.
//

@interface XMLChannelGenerator : NSObject {
@private
    NSXMLDocument* m_XmlDocument;
}
- (id) initWithChannelData:(NSData*) data;
- (NSXMLDocument*) xmlDocument;
@end
