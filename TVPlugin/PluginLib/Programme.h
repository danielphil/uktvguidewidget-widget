//
//  Channels.h
//  TVPlugin
//
//  Created by Daniel Phillips on 13/11/2005.
//  Copyright 2005 __MyCompanyName__. All rights reserved.
//

@interface Programme : NSObject {
@private
    NSString* m_programmeName;
	NSString* m_episodeName;
	NSString* m_filmReleaseYear;
	NSString* m_director;
	NSString* m_cast;
	NSString* m_category;
	NSString* m_description;
	NSString* m_date;
	NSString* m_startTime;
	NSString* m_endTime;
	NSString* m_programmeDuration;
}

- (NSString*)programmeName;
- (void) setProgrammeName:(NSString*)programmeName;

- (NSString*)episodeName;
- (void) setEpisodeName:(NSString*)episodeName;

- (NSString*)filmReleaseYear;
- (void) setFilmReleaseYear:(NSString*)filmReleaseYear;

- (NSString*)director;
- (void) setDirector:(NSString*)director;

- (NSString*)cast;
- (void) setCast:(NSString*)cast;

- (NSString*)category;
- (void) setCategory:(NSString*)category;

- (NSString*)description;
- (void) setDescription:(NSString*)description;

- (NSString*)date;
- (void) setDate:(NSString*)date;

- (NSString*)startTime;
- (void) setStartTime:(NSString*)startTime;

- (NSString*)endTime;
- (void) setEndTime:(NSString*)endTime;

- (NSString*)programmeDuration;
- (void) setProgrammeDuration:(NSString*)programmeDuration;
@end
