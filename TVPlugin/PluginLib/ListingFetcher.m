//
//  Channels.m
//  TVPlugin
//
//  Created by Daniel Phillips on 13/11/2005.
//  Copyright 2005 __MyCompanyName__. All rights reserved.
//

#import "ListingFetcher.h"

@implementation ListingFetcher
- (void) dealloc {
	[super dealloc];
}

+ (NSData*) getListingDataForChannel:(int) channelNumber {
    NSString* url= @"http://xmltv.radiotimes.com/xmltv/";
	url = [url stringByAppendingString:[NSString stringWithFormat:@"%d", channelNumber]];
	url = [url stringByAppendingString:@".dat"];
	
	NSURLRequest *listingRequest=[NSURLRequest  requestWithURL:[NSURL URLWithString:url]
                                                cachePolicy:NSURLRequestUseProtocolCachePolicy 
                                                timeoutInterval:60.0];
	NSHTTPURLResponse* httpResponse;
	NSError* returnedError;
	NSData* receivedListingData = [NSURLConnection sendSynchronousRequest:listingRequest
                                                   returningResponse:&httpResponse
                                                   error:&returnedError];
    
    return ([httpResponse statusCode] == 200) ? receivedListingData : nil;
}

+ (NSData*) getChannelListData {
    NSString* url= @"http://xmltv.radiotimes.com/xmltv/channels.dat";
	NSURLRequest* channelRequest=[NSURLRequest  requestWithURL:[NSURL URLWithString:url]
												cachePolicy:NSURLRequestUseProtocolCachePolicy 
                                                timeoutInterval:60.0];
	NSHTTPURLResponse* httpResponse;
	NSError* returnedError;
	NSData* receivedChannelData = [NSURLConnection  sendSynchronousRequest:channelRequest 
                                                    returningResponse:&httpResponse
                                                    error:&returnedError];
	return ([httpResponse statusCode] == 200) ? receivedChannelData : nil;
}
@end
