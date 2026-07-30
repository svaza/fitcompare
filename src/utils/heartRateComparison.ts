import type { SimplifiedLapRecord } from './fitDataParser'

export interface HeartRateSample {
  timestampMs: number
  heartRate: number
}

export interface HeartRateOverlap {
  startTimeMs: number
  endTimeMs: number
  firstSamples: HeartRateSample[]
  secondSamples: HeartRateSample[]
}

function getHeartRateSamples(records: SimplifiedLapRecord[]): HeartRateSample[] {
  const samplesByTimestamp = new Map<number, HeartRateSample>()

  records.forEach((record) => {
    const timestampMs = new Date(record.timestamp).getTime()
    const heartRate = record.heartRate

    if (
      !Number.isFinite(timestampMs) ||
      typeof heartRate !== 'number' ||
      !Number.isFinite(heartRate) ||
      heartRate <= 0
    ) {
      return
    }

    samplesByTimestamp.set(timestampMs, { timestampMs, heartRate })
  })

  return Array.from(samplesByTimestamp.values()).sort(
    (first, second) => first.timestampMs - second.timestampMs,
  )
}

/**
 * Restrict both heart-rate streams to the time period recorded by both files.
 * Samples stay on their original timestamps so files with different recording
 * intervals can still be rendered together without requiring exact matches.
 */
export function getHeartRateOverlap(
  firstRecords: SimplifiedLapRecord[],
  secondRecords: SimplifiedLapRecord[],
): HeartRateOverlap | null {
  const firstSamples = getHeartRateSamples(firstRecords)
  const secondSamples = getHeartRateSamples(secondRecords)

  if (firstSamples.length === 0 || secondSamples.length === 0) {
    return null
  }

  const startTimeMs = Math.max(
    firstSamples[0].timestampMs,
    secondSamples[0].timestampMs,
  )
  const endTimeMs = Math.min(
    firstSamples[firstSamples.length - 1].timestampMs,
    secondSamples[secondSamples.length - 1].timestampMs,
  )

  if (startTimeMs > endTimeMs) {
    return null
  }

  const overlappingFirstSamples = firstSamples.filter(
    (sample) => sample.timestampMs >= startTimeMs && sample.timestampMs <= endTimeMs,
  )
  const overlappingSecondSamples = secondSamples.filter(
    (sample) => sample.timestampMs >= startTimeMs && sample.timestampMs <= endTimeMs,
  )

  if (overlappingFirstSamples.length === 0 || overlappingSecondSamples.length === 0) {
    return null
  }

  return {
    startTimeMs,
    endTimeMs,
    firstSamples: overlappingFirstSamples,
    secondSamples: overlappingSecondSamples,
  }
}
