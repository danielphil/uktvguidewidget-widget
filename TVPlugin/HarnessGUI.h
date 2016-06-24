/* HarnessGUI */

#import <Cocoa/Cocoa.h>

@interface HarnessGUI : NSObject
{
    IBOutlet id channelNameResult;
    IBOutlet id channelNumber;
}
- (IBAction)getChannelName:(id)sender;
@end
