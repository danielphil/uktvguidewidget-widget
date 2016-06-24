#import "HarnessGUI.h"
#import "Channels.h"


@implementation HarnessGUI

- (IBAction)getChannelName:(id)sender
{
	NSAutoreleasePool *pool = [[NSAutoreleasePool alloc] init];
	int requiredChannelNumber = [channelNumber intValue];
	Channels *channelsList = [[Channels alloc] init];
	[channelsList loadChannelList];
	[channelNameResult setStringValue:[channelsList getChannelName:requiredChannelNumber]];
	[channelsList release];
	[pool release];
}

@end
