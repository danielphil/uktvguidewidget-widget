//
//  Channels.h
//  TVPlugin
//
//  Created by Daniel Phillips on 13/11/2005.
//  Copyright 2005 __MyCompanyName__. All rights reserved.
//

@class NSMutableDictionary;

@interface Channels : NSObject {
@private
	NSMutableDictionary* m_channels;
}
- (int) loadChannelList;
- (NSString*) getChannelNameForNumber:(int)channelNumber;
@end
