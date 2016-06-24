//
//  TVPlugin.h
//  TVPlugin
//
//  Created by Daniel Phillips on 11/05/2005.
//  Copyright 2005 __MyCompanyName__. All rights reserved.
//

#import <Cocoa/Cocoa.h>
#import <WebKit/WebKit.h>

#import "Channels.h"

#define HTTP_RETRIEVE_ERROR 1
#define FILE_SAVE_ERROR 2

@interface TVPlugin : NSObject {
	Channels* m_channelsList;
}
- (int)getChannelList;
- (int)getListing:(int)channelNo;
- (int)saveFavourite:(NSString *)faveList;
- (NSString *)getBasePath;
- (NSString *)devText;
- (NSString *)getChannelName:(int) channelNumber;
- (BOOL)doesFileExist:(NSString*)fileName;
@end
