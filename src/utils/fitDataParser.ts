// Types for simplified FIT data structure
export interface SimplifiedLapRecord {
  timestamp: string
  heartRate: number | null
}

export interface SimplifiedActivity {
  sport: string
  subSport: string
  timestamp: string
  startTime: string
  avgHeartRate: number
  maxHeartRate: number
  records: SimplifiedLapRecord[]
}

export interface SimplifiedFitData {
  userProfile: {
    friendlyName?: string
    weight?: number
    gender?: string
    restingHeartRate?: number
  }
  activities: SimplifiedActivity[]
}

type UnknownRecord = Record<string, unknown>

function asRecord(value: unknown): UnknownRecord {
  return typeof value === 'object' && value !== null
    ? (value as UnknownRecord)
    : {}
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined
}

function asOptionalNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined
}

function asNumber(value: unknown): number {
  return asOptionalNumber(value) ?? 0
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function asTimestamp(...values: unknown[]): string {
  for (const value of values) {
    if (!(value instanceof Date) && typeof value !== 'string' && typeof value !== 'number') {
      continue
    }

    const date = value instanceof Date ? value : new Date(value)
    if (Number.isFinite(date.getTime())) {
      return date.toISOString()
    }
  }

  return ''
}

function getActivityEndTimestamp(
  declaredEnd: string,
  records: SimplifiedLapRecord[],
): string {
  let endTimestamp = declaredEnd
  let endTimeMs = new Date(declaredEnd).getTime()

  records.forEach((record) => {
    const recordTimeMs = new Date(record.timestamp).getTime()
    if (!Number.isFinite(recordTimeMs) || recordTimeMs <= endTimeMs) return

    endTimestamp = record.timestamp
    endTimeMs = recordTimeMs
  })

  return endTimestamp
}

/**
 * Parse raw FIT data and consolidate it into the fields used by the UI.
 * The FIT parser returns Date objects at runtime, so timestamps are normalized
 * to ISO strings here before any comparison is attempted.
 */
export function parseFitData(rawData: unknown): SimplifiedFitData {
  const data = asRecord(rawData)
  const rawUserProfile = asRecord(data.user_profile)
  const rawActivity = asRecord(data.activity)
  const topLevelRecords = asArray(data.records)

  const userProfile = {
    friendlyName: asOptionalString(rawUserProfile.friendly_name),
    weight: asOptionalNumber(rawUserProfile.weight),
    gender: asOptionalString(rawUserProfile.gender),
    restingHeartRate: asOptionalNumber(rawUserProfile.resting_heart_rate),
  }

  const activities: SimplifiedActivity[] = []
  const sessions = asArray(rawActivity.sessions)

  sessions.forEach((rawSession, sessionIndex) => {
    const session = asRecord(rawSession)
    const records: SimplifiedLapRecord[] = []
    const laps = asArray(session.laps)

    laps.forEach((rawLap) => {
      const lap = asRecord(rawLap)
      const lapRecords = asArray(lap.records)

      lapRecords.forEach((rawRecord) => {
        const record = asRecord(rawRecord)
        const timestamp = asTimestamp(record.timestamp, lap.start_time)

        if (!timestamp) return

        records.push({
          timestamp,
          heartRate: asOptionalNumber(record.heart_rate) ?? null,
        })
      })
    })

    // In list/both parser modes, record messages are also available at the
    // top level. Use them when a session has no laps (or its laps have no
    // records), which is valid for activities recorded by some devices/apps.
    if (records.length === 0 && topLevelRecords.length > 0) {
      const nextSession = asRecord(sessions[sessionIndex + 1])
      const sessionStartMs = new Date(
        asTimestamp(session.start_time, session.timestamp),
      ).getTime()
      const nextSessionStartMs = new Date(
        asTimestamp(nextSession.start_time, nextSession.timestamp),
      ).getTime()

      topLevelRecords.forEach((rawRecord) => {
        const record = asRecord(rawRecord)
        const timestamp = asTimestamp(record.timestamp)
        const timestampMs = new Date(timestamp).getTime()

        if (!timestamp || !Number.isFinite(timestampMs)) return
        if (Number.isFinite(sessionStartMs) && timestampMs < sessionStartMs) return
        if (Number.isFinite(nextSessionStartMs) && timestampMs >= nextSessionStartMs) return

        records.push({
          timestamp,
          heartRate: asOptionalNumber(record.heart_rate) ?? null,
        })
      })
    }

    const declaredEnd = asTimestamp(
      session.timestamp,
      rawActivity.timestamp,
      session.start_time,
    )

    activities.push({
      sport: asOptionalString(session.sport) ?? 'unknown',
      subSport: asOptionalString(session.sub_sport) ?? 'unknown',
      timestamp: getActivityEndTimestamp(declaredEnd, records),
      startTime: asTimestamp(session.start_time, rawActivity.timestamp),
      avgHeartRate: asNumber(session.avg_heart_rate),
      maxHeartRate: asNumber(session.max_heart_rate),
      records,
    })
  })

  return {
    userProfile,
    activities,
  }
}
