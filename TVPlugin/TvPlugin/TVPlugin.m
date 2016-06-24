//
//  TVPlugin.m
//  TVPlugin
//
//  Created by Daniel Phillips on 11/05/2005.
//  Copyright 2005 __MyCompanyName__. All rights reserved.
//

#import "TVPlugin.h"
#import "XMLChannelGenerator.h"
#import "ListingXMLGenerator.h"
#import "FaveXMLGenerator.h"
#import "ListingFetcher.h"
#import "Utilities.h"

@implementation TVPlugin
/*********************************************/
// Methods required by the WidgetPlugin protocol
/*********************************************/

// initWithWebView
//
// This method is called when the widget plugin is first loaded as the
// widget's web view is first initialized
-(id)initWithWebView:(WebView*)w {
    if ([super init] == nil) {
        return nil;
    }
    
    NSString* data_directory = [Utilities getWidgetDataDirectory];

    NSFileManager *mgr = [NSFileManager defaultManager];
	BOOL isDir;
	if (!([mgr fileExistsAtPath:data_directory isDirectory:&isDir] && isDir)) {
		if (![mgr createDirectoryAtPath:data_directory attributes:nil]) {
			NSLog(@"Could not create directory %@", data_directory);
        }
	}
	
	m_channelsList = [[Channels alloc] init];
	
	//catch the return value from loadChannelList as it's needed to see
	//if we should redownload the available channels
	[m_channelsList loadChannelList];
	return self;
}

-(void)dealloc {
	[m_channelsList release];
	[super dealloc];
}

/*********************************************/
// Methods required by the WebScripting protocol
/*********************************************/

// windowScriptObjectAvailable
//
// This method gives you the object that you use to bridge between the
// Obj-C world and the JavaScript world.  Use setValue:forKey: to give
// the object the name it's refered to in the JavaScript side.
-(void)windowScriptObjectAvailable:(WebScriptObject*)wso {
	[wso setValue:self forKey:@"TVPlugin"];
}

// webScriptNameForSelector
//
// This method lets you offer friendly names for methods that normally 
// get mangled when bridged into JavaScript.
+(NSString*)webScriptNameForSelector:(SEL)aSel {
	NSString *retval = nil;
	
	if (aSel == @selector(getChannelList)) {
		retval = @"getChannelList";
	} else if (aSel == @selector(getListing:)) {
		retval = @"getListing";
	} else if (aSel == @selector(saveFavourite:)) {
		retval= @"saveFavourite";
	} else if (aSel == @selector(getBasePath)) {
		retval= @"getBasePath";
	} else if (aSel == @selector(devText)) {
		retval= @"devText";
	} else if (aSel == @selector(getChannelName:)) {
		retval= @"getChannelName";
	} else if (aSel == @selector(doesFileExist:)) {
		retval= @"doesFileExist";
	} else {
		NSLog(@"\tunknown selector");
	}
	
	return retval;
}

// isSelectorExcludedFromWebScript
//
// This method lets you filter which methods in your plugin are accessible 
// to the JavaScript side.
+(BOOL)isSelectorExcludedFromWebScript:(SEL)aSel {	
	if (aSel == @selector(getChannelList) || 
		aSel == @selector(getListing:) || 
		aSel == @selector(saveFavourite:) || 
		aSel == @selector(getBasePath) || 
		aSel == @selector(devText) ||
        aSel == @selector(doesFileExist:) ||
		aSel == @selector(getChannelName:)) {
		return NO;
	}
	return YES;
}

// isKeyExcludedFromWebScript
//
// Prevents direct key access from JavaScript.
+(BOOL)isKeyExcludedFromWebScript:(const char*)k {
	return YES;
}

- (int)getChannelList {
    NSData* receivedChannelData = [ListingFetcher getChannelListData];
	
	if ((receivedChannelData == nil) || ([receivedChannelData length] == 0)) {
        return HTTP_RETRIEVE_ERROR;
    }
    
    XMLChannelGenerator* xmlGen= [[XMLChannelGenerator alloc] initWithChannelData:receivedChannelData];
    [xmlGen autorelease];

    NSString* path= [[Utilities getWidgetDataDirectory] stringByAppendingString:@"/channels.xml"];
    [Utilities writeXmlDocument:[xmlGen xmlDocument] toFile:path];
    
    // If we have downloaded a new channel list then we need to update the list held in memory by
    // the plugin
    [m_channelsList loadChannelList];
    
	return 0;
}

- (int)getListing:(int)channelNo {
	NSData* listingData = [ListingFetcher getListingDataForChannel:channelNo];
    
	if ((listingData == nil) || ([listingData length] == 0)) {
        return HTTP_RETRIEVE_ERROR;
    }
    
    ListingXMLGenerator *xmlGen= [[ListingXMLGenerator alloc] initWithListingData:listingData];
    [xmlGen autorelease];
    
    NSString* filename= [[Utilities getWidgetDataDirectory] stringByAppendingString:@"/"];
    filename= [filename stringByAppendingString:[NSString stringWithFormat:@"%d", channelNo]];
    filename= [filename stringByAppendingString:@".xml"];
    
    [Utilities writeXmlDocument:[xmlGen xmlDocument] toFile:filename];

	return 0;
}

- (int)saveFavourite:(NSString *)faveList {
	FaveXMLGenerator *xmlGen= [[FaveXMLGenerator alloc] initWithChannelNumbers:faveList];
    [xmlGen autorelease];

	NSString* filename = [[Utilities getWidgetDataDirectory] stringByAppendingString:@"/faveChannels.xml"];
    [Utilities writeXmlDocument:[xmlGen xmlDocument] toFile:filename];

	return 0;
}

- (NSString *)getBasePath {
	return [Utilities getWidgetDataDirectory];
}

- (NSString *)devText {
	return @"UK TV Guide Widget Plugin Copyright 2005-2008 Daniel Phillips";
}

- (NSString *)getChannelName:(int) channelNumber {
    return [m_channelsList getChannelNameForNumber:channelNumber];
}

- (BOOL)doesFileExist:(NSString*)fileName {
    return [Utilities doesFileExist:fileName];
}
@end
