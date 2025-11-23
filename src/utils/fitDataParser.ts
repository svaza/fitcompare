// Types for simplified FIT data structure
export interface SimplifiedLapRecord {
  timestamp: string;
  heartRate: number | null;
}

export interface SimplifiedActivity {
  sport: string;
  subSport: string;
  timestamp: string;
  startTime: string;
  avgHeartRate: number;
  maxHeartRate: number;
  records: SimplifiedLapRecord[];
}

export interface SimplifiedFitData {
  userProfile: {
    friendlyName?: string;
    weight?: number;
    gender?: string;
    restingHeartRate?: number;
  };
  activities: SimplifiedActivity[];
}

/**
 * Parse raw FIT data and consolidate into simplified records
 * Extracts sport, activity timestamp, and consolidates lap information with heart rate
 */
export function parseFitData(rawData: unknown): SimplifiedFitData {
  const data = rawData as any;

  // Extract user profile info
  const userProfile = {
    friendlyName: data.user_profile?.friendly_name,
    weight: data.user_profile?.weight,
    gender: data.user_profile?.gender,
    restingHeartRate: data.user_profile?.resting_heart_rate,
  };

  // Extract and consolidate activity data
  const activities: SimplifiedActivity[] = [];

  if (data.activity && data.activity.sessions) {
    data.activity.sessions.forEach((session: any) => {
      // Consolidate laps with heart rate information
      const laps: SimplifiedLapRecord[] = [];

      if (session.laps && Array.isArray(session.laps)) {
        session.laps.forEach((lap: any) => {
          // Create a lap record with timestamp and average heart rate
          if(lap.records && lap.records.length > 0) {
            lap.records.forEach((record: any) => {
              laps.push({
                timestamp: record.timestamp || lap.start_time,
                heartRate: record.heart_rate || 0,
              });
            });
          }
        });
      }

      // Create simplified activity record
      const activity: SimplifiedActivity = {
        sport: session.sport || 'unknown',
        subSport: session.sub_sport || 'unknown',
        timestamp: session.timestamp || data.activity.timestamp,
        startTime: session.start_time || data.activity.timestamp,
        avgHeartRate: session.avg_heart_rate || 0,
        maxHeartRate: session.max_heart_rate || 0,
        records: laps,
      };

      activities.push(activity);
    });
  }

  return {
    userProfile,
    activities,
  };
}
