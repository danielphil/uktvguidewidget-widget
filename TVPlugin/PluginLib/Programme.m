//
//  Channels.m
//  TVPlugin
//
//  Created by Daniel Phillips on 13/11/2005.
//  Copyright 2005 __MyCompanyName__. All rights reserved.
//

#import "Programme.h"

#define REPLACE_MEMBER_VARIABLE(member_variable, local_variable) \
    [member_variable release]; \
    member_variable = local_variable; \
    [member_variable retain];

@implementation Programme
- (void) dealloc {
    [m_programmeName release];
	[m_episodeName release];
	[m_filmReleaseYear release];
	[m_director release];
	[m_cast release];
	[m_category release];
	[m_description release];
	[m_date release];
	[m_startTime release];
	[m_endTime release];
	[m_programmeDuration release];
	[super dealloc];
}

- (NSString*) programmeName {
    return m_programmeName;
}

- (void) setProgrammeName:(NSString*)programmeName {
    REPLACE_MEMBER_VARIABLE(m_programmeName, programmeName);
}

- (NSString*) episodeName {
    return m_episodeName;
}

- (void) setEpisodeName:(NSString*)episodeName {
    REPLACE_MEMBER_VARIABLE(m_episodeName, episodeName);
}

- (NSString*) filmReleaseYear {
    return m_filmReleaseYear;
}

- (void) setFilmReleaseYear:(NSString*)filmReleaseYear {
    REPLACE_MEMBER_VARIABLE(m_filmReleaseYear, filmReleaseYear);
}

- (NSString*) director {
    return m_director;
}

- (void) setDirector:(NSString*)director {
    REPLACE_MEMBER_VARIABLE(m_director, director);
}

- (NSString*) cast {
    return m_cast;
}
        
- (void) setCast:(NSString*)cast {
    REPLACE_MEMBER_VARIABLE(m_cast, cast);
}

- (NSString*) category {
    return m_category;
}

- (void) setCategory:(NSString*)category {
    REPLACE_MEMBER_VARIABLE(m_category, category);
}

- (NSString*)description {
    return m_description;
}

- (void) setDescription:(NSString*)description {
    REPLACE_MEMBER_VARIABLE(m_description, description);
}

- (NSString*) date {
    return m_date;
}

- (void) setDate:(NSString*)date {
    REPLACE_MEMBER_VARIABLE(m_date, date);
}

- (NSString*) startTime {
    return m_startTime;
}

- (void) setStartTime:(NSString*)startTime {
    REPLACE_MEMBER_VARIABLE(m_startTime, startTime);
}

- (NSString*) endTime {
    return m_endTime;
}

- (void) setEndTime:(NSString*)endTime {
    REPLACE_MEMBER_VARIABLE(m_endTime, endTime);
}

- (NSString*) programmeDuration {
    return m_programmeDuration;
}

- (void) setProgrammeDuration:(NSString*)programmeDuration {
    REPLACE_MEMBER_VARIABLE(m_programmeDuration, programmeDuration);
}
@end
