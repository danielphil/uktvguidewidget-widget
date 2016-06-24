//
//  Channels.h
//  TVPlugin
//
//  Created by Daniel Phillips on 13/11/2005.
//  Copyright 2005 __MyCompanyName__. All rights reserved.
//

@interface ListingFetcher : NSObject {
}
+ (NSData*) getListingDataForChannel:(int) channelNumber;
+ (NSData*) getChannelListData;
@end
