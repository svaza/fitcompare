import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import FitParser from 'fit-file-parser'
import { parseFitData, type SimplifiedFitData, type SimplifiedActivity } from './utils/fitDataParser'
import {
  getHeartRateOverlap,
  type HeartRateSample,
} from './utils/heartRateComparison'
import * as echarts from 'echarts'

interface FileData {
  fileName: string
  activity: SimplifiedActivity
}

interface HeartRateSeries {
  name: string
  samples: HeartRateSample[]
}

interface HeartRateChartData {
  startTimeMs: number
  endTimeMs: number
  series: [HeartRateSeries, HeartRateSeries]
}

interface ZoomRange {
  startPercent: number
  endPercent: number
}

interface EChartsComponentProps {
  chartData: HeartRateChartData
  zoomRange: ZoomRange | null
  onZoomChange: (range: ZoomRange | null) => void
}

const EChartsComponent: React.FC<EChartsComponentProps> = ({
  chartData,
  zoomRange,
  onZoomChange,
}) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    if (!chartInstanceRef.current || chartInstanceRef.current.isDisposed()) {
      chartInstanceRef.current = echarts.init(chartRef.current, 'dark')
    }

    const chart = chartInstanceRef.current
    const seriesNames = chartData.series.map((series) => series.name)

    const options: echarts.EChartsOption = {
      backgroundColor: 'rgba(10, 14, 39, 0)',
      animation: false,
      textStyle: {
        color: '#bbb',
      },
      grid: {
        top: '12%',
        left: '5%',
        right: '5%',
        bottom: '25%',
        containLabel: true,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
        },
        backgroundColor: '#1a1f3a',
        borderColor: '#ff6b35',
        borderWidth: 2,
        textStyle: {
          color: '#fff',
        },
      },
      legend: {
        data: seriesNames,
        textStyle: {
          color: '#bbb',
        },
        bottom: 50,
      },
      xAxis: {
        type: 'time',
        min: chartData.startTimeMs,
        max: chartData.endTimeMs,
        axisLine: {
          lineStyle: {
            color: '#444',
          },
        },
        axisLabel: {
          color: '#bbb',
          rotate: -45,
          formatter: (value: number) => new Date(value).toLocaleTimeString(),
        },
      },
      yAxis: {
        type: 'value',
        name: 'Heart Rate (bpm)',
        nameTextStyle: {
          color: '#bbb',
          fontSize: 12,
        },
        nameLocation: 'middle',
        nameGap: 40,
        axisLine: {
          lineStyle: {
            color: '#444',
          },
        },
        axisLabel: {
          color: '#bbb',
        },
        splitLine: {
          lineStyle: {
            color: '#333',
          },
        },
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          start: zoomRange?.startPercent ?? 0,
          end: zoomRange?.endPercent ?? 100,
          textStyle: {
            color: '#bbb',
          },
          bottom: 20,
        },
        {
          type: 'inside',
          start: zoomRange?.startPercent ?? 0,
          end: zoomRange?.endPercent ?? 100,
        },
      ],
      series: chartData.series.map((series, index) => ({
        name: series.name,
        type: 'line',
        data: series.samples.map((sample) => [sample.timestampMs, sample.heartRate]),
        lineStyle: {
          color: index === 0 ? '#ff6b35' : '#3498db',
          width: 2,
        },
        smooth: false,
        symbol: 'none',
        showSymbol: false,
        sampling: 'lttb',
      })),
    }

    chart.setOption(options, { notMerge: true })

    const handleDataZoom = () => {
      const option = chart.getOption() as unknown as {
        dataZoom?: Array<{ start?: number; end?: number }>
      }
      const dataZoomOption = option.dataZoom ?? []

      if (dataZoomOption.length > 0) {
        const startPercent = dataZoomOption[0].start ?? 0
        const endPercent = dataZoomOption[0].end ?? 100

        if (startPercent <= 0 && endPercent >= 100) {
          onZoomChange(null)
        } else {
          onZoomChange({ startPercent, endPercent })
        }
      }
    }

    chart.on('datazoom', handleDataZoom)

    const handleResize = () => {
      chart.resize()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.off('datazoom', handleDataZoom)
    }
  }, [chartData, zoomRange, onZoomChange])

  useEffect(() => {
    return () => {
      chartInstanceRef.current?.dispose()
      chartInstanceRef.current = null
    }
  }, [])

  return <div ref={chartRef} className="echarts-container" />
}

function App() {
  const [file1Data, setFile1Data] = useState<FileData | null>(null)
  const [file2Data, setFile2Data] = useState<FileData | null>(null)
  const [showComparison, setShowComparison] = useState(false)
  const [zoomRange, setZoomRange] = useState<ZoomRange | null>(null)

  const parseFile = (file: File, setData: (data: FileData) => void) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer

      const fitParser = new FitParser({
        force: true,
        speedUnit: 'km/h',
        lengthUnit: 'km',
        temperatureUnit: 'celsius',
        pressureUnit: 'bar',
        elapsedRecordField: true,
        // Keep both the nested activity tree and the top-level message lists.
        // Some valid FIT files contain records without any lap messages.
        mode: 'both',
      })

      fitParser.parse(arrayBuffer, (error: Error | null, data: unknown) => {
        if (error) {
          console.error('Error parsing FIT file:', error)
          alert(`Error parsing file: ${error.message}`)
        } else {
          try {
            const simplifiedData: SimplifiedFitData = parseFitData(data)
            if (simplifiedData.activities.length > 0) {
              setData({
                fileName: file.name.replace(/\.[^/.]+$/, ''),
                activity: simplifiedData.activities[0],
              })
            }
          } catch (parseError) {
            console.error('Error parsing simplified FIT data:', parseError)
            alert('Error processing FIT data')
          }
        }
      })
    }
    reader.readAsArrayBuffer(file)
  }

  const handleFile1Upload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      parseFile(file, setFile1Data)
    }
  }

  const handleFile2Upload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      parseFile(file, setFile2Data)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getFileName = (name: string) => {
    return name.replace(/\.[^/.]+$/, '')
  }

  const heartRateChartData = useMemo<HeartRateChartData | null>(() => {
    if (!file1Data || !file2Data) return null

    const overlap = getHeartRateOverlap(
      file1Data.activity.records,
      file2Data.activity.records,
    )

    if (!overlap) return null

    const file1Name = getFileName(file1Data.fileName)
    const file2Name = getFileName(file2Data.fileName)
    const series1Name = file1Name === file2Name ? `${file1Name} (1)` : file1Name
    const series2Name = file1Name === file2Name ? `${file2Name} (2)` : file2Name

    return {
      startTimeMs: overlap.startTimeMs,
      endTimeMs: overlap.endTimeMs,
      series: [
        { name: series1Name, samples: overlap.firstSamples },
        { name: series2Name, samples: overlap.secondSamples },
      ],
    }
  }, [file1Data, file2Data])

  const handleZoomChange = useCallback((range: ZoomRange | null) => {
    setZoomRange(range)
  }, [])

  const resetZoom = () => {
    setZoomRange(null)
  }

  return (
    <>
      {/* Header */}
      <header className="fitcompare-header">
        <h1>FitCompare</h1>
      </header>

      {/* Main Content */}
      <div className="container main-content">
        {showComparison && file1Data && file2Data ? (
          // Comparison View
          <div className="comparison-view">
            {/* Activity Panels */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="comparison-table-card">
                  <table className="comparison-table">
                    <thead>
                      <tr>
                        <th className="label-column">Metric</th>
                        <th className="data-column">{file1Data.fileName}</th>
                        <th className="data-column">{file2Data.fileName}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="label-cell">Sport</td>
                        <td className="data-cell">{file1Data.activity.sport}</td>
                        <td className="data-cell">{file2Data.activity.sport}</td>
                      </tr>
                      <tr>
                        <td className="label-cell">Sub Sport</td>
                        <td className="data-cell">{file1Data.activity.subSport}</td>
                        <td className="data-cell">{file2Data.activity.subSport}</td>
                      </tr>
                      <tr>
                        <td className="label-cell">Average Heart Rate (bpm)</td>
                        <td className="data-cell">{file1Data.activity.avgHeartRate}</td>
                        <td className="data-cell">{file2Data.activity.avgHeartRate}</td>
                      </tr>
                      <tr>
                        <td className="label-cell">Max Heart Rate (bpm)</td>
                        <td className="data-cell">{file1Data.activity.maxHeartRate}</td>
                        <td className="data-cell">{file2Data.activity.maxHeartRate}</td>
                      </tr>
                      <tr>
                        <td className="label-cell">Start Time</td>
                        <td className="data-cell">{formatDate(file1Data.activity.startTime)}</td>
                        <td className="data-cell">{formatDate(file2Data.activity.startTime)}</td>
                      </tr>
                      <tr>
                        <td className="label-cell">End Time</td>
                        <td className="data-cell">{formatDate(file1Data.activity.timestamp)}</td>
                        <td className="data-cell">{formatDate(file2Data.activity.timestamp)}</td>
                      </tr>
                      <tr>
                        <td className="label-cell">Total Records</td>
                        <td className="data-cell">{file1Data.activity.records.length}</td>
                        <td className="data-cell">{file2Data.activity.records.length}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Combined Graph */}
            <div className="row mb-4">
              <div className="col-12">
                <div className="graph-card">
                  <div className="graph-header">
                    <h5>Heart Rate Comparison</h5>
                    {zoomRange && heartRateChartData && (
                      <button className="btn btn-small btn-reset" onClick={resetZoom}>
                        Reset Zoom
                      </button>
                    )}
                  </div>
                  <div className="graph-instructions">
                    {!zoomRange ? (
                      <p>📍 Drag to select an area on the graph to zoom in | Scroll to zoom | Click reset to see full range</p>
                    ) : (
                      <p>🔍 Zoomed view | Click "Reset Zoom" to see full range</p>
                    )}
                  </div>
                  {heartRateChartData ? (
                    <>
                      <div className="overlap-summary">
                        Shared recording window: {formatDate(new Date(heartRateChartData.startTimeMs).toISOString())}
                        {' – '}
                        {formatDate(new Date(heartRateChartData.endTimeMs).toISOString())}
                        {' · '}
                        {heartRateChartData.series[0].samples.length} / {heartRateChartData.series[1].samples.length} HR samples
                      </div>
                      <EChartsComponent
                        chartData={heartRateChartData}
                        zoomRange={zoomRange}
                        onZoomChange={handleZoomChange}
                      />
                    </>
                  ) : (
                    <div className="no-chart-data">
                      No shared time window with valid heart-rate samples was found in these files.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="row">
              <div className="col-12 text-center">
                <button
                  className="btn btn-secondary mt-4"
                  onClick={() => {
                    setFile1Data(null)
                    setFile2Data(null)
                    setShowComparison(false)
                    resetZoom()
                  }}
                >
                  Upload Different Files
                </button>
              </div>
            </div>
          </div>
        ) : (
          // File Upload Section
          <div className="upload-section">
            <div className="row">
              <div className="col-lg-6 mb-4">
                <div className="upload-card">
                  <div className="upload-icon">📁</div>
                  <h4>File 1</h4>
                  {file1Data ? (
                    <div className="file-info">
                      <p className="file-name">✓ {file1Data.fileName}</p>
                      <p className="file-sport">{file1Data.activity.sport}</p>
                    </div>
                  ) : (
                    <>
                      <label htmlFor="fileInput1" className="form-label">
                        Upload First FIT File
                      </label>
                      <input
                        type="file"
                        className="form-control form-control-lg"
                        id="fileInput1"
                        onChange={handleFile1Upload}
                        accept=".fit"
                      />
                    </>
                  )}
                </div>
              </div>

              <div className="col-lg-6 mb-4">
                <div className="upload-card">
                  <div className="upload-icon">📁</div>
                  <h4>File 2</h4>
                  {file2Data ? (
                    <div className="file-info">
                      <p className="file-name">✓ {file2Data.fileName}</p>
                      <p className="file-sport">{file2Data.activity.sport}</p>
                    </div>
                  ) : (
                    <>
                      <label htmlFor="fileInput2" className="form-label">
                        Upload Second FIT File
                      </label>
                      <input
                        type="file"
                        className="form-control form-control-lg"
                        id="fileInput2"
                        onChange={handleFile2Upload}
                        accept=".fit"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Compare Button */}
            <div className="row">
              <div className="col-12 text-center">
                <button
                  className="btn btn-primary btn-lg mt-4"
                  onClick={() => setShowComparison(true)}
                  disabled={!file1Data || !file2Data}
                >
                  Compare Activities
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
