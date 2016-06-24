//
//  ListingXMLGenerator.h
//  PageLoadTest
//
//  Created by Daniel Phillips on 05/05/2005.
//  Copyright 2005 __MyCompanyName__. All rights reserved.
//

@interface ListingXMLGenerator : NSObject {
    @private
    NSXMLDocument* m_XmlDocument;
}
- (id) initWithListingData:(NSData*) listingData;
- (NSXMLDocument*) xmlDocument;
@end
