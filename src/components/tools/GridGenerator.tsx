import React, { useState, useCallback } from "react"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, Shuffle } from "lucide-react"

// Multiple noise offsets for more variation
const createNoiseOffsets = (count: number) => {
    return Array.from({ length: count }, () => ({
        phase: Math.random() * Math.PI * 2,
        frequency: 0.5 + Math.random() * 1.5,
        amplitude: 0.5 + Math.random() * 0.5
    }))
}

const WavyGrid: React.FC<any> = ({
    className = "",
    width = 20,
    height = 20,
    amplitude = 4,
    frequency = 1,
    randomness = 0.5,
    seed = 1,
    ...rest
}) => {
    const patternId = React.useId()

    const getNoise = useCallback((position: number, offsets: any[]) => {
        return (
            offsets.reduce((sum, offset) => {
                return (
                    sum +
                    Math.sin(position * offset.frequency + offset.phase) *
                        offset.amplitude
                )
            }, 0) / offsets.length
        )
    }, [])

    const getWavyPath = (start: number, isVertical: boolean) => {
        const noiseOffsets = createNoiseOffsets(3)
        const size = isVertical ? height : width
        const steps = Math.max(1, Math.floor(frequency * 8))
        const stepSize = size / steps

        let path = `M ${isVertical ? start : 0} ${isVertical ? 0 : start}`

        for (let i = 0; i <= steps; i++) {
            const t = i / steps
            const pos = t * size
            // Scale the noise based on the dimensions
            const noise =
                getNoise(t * 10 + seed, noiseOffsets) * randomness * amplitude

            if (isVertical) {
                const x = start + noise
                const y = pos
                path += ` L ${x} ${y}`
            } else {
                const x = pos
                const y = start + noise
                path += ` L ${x} ${y}`
            }
        }

        return path
    }

    // Calculate number of lines based on size
    const generateLines = (isVertical: boolean) => {
        const size = isVertical ? width : height
        // Adjust line spacing based on size
        const spacing = Math.max(20, size / 4) // Ensures reasonable line density
        const count = Math.max(2, Math.floor(size / spacing))

        return Array.from({ length: count }, (_, i) => {
            const pos = (i + 0.5) * (size / count)
            return (
                <path
                    key={`${isVertical ? "v" : "h"}-${i}`}
                    d={getWavyPath(pos, isVertical)}
                    fill="none"
                    vectorEffect="non-scaling-stroke" // Maintains consistent stroke width when scaling
                />
            )
        })
    }

    return (
        <svg
            aria-hidden="true"
            className={`${className} pointer-events-none h-full w-full fill-blue-500/50 stroke-blue-500/50`}
            style={{ visibility: "visible" }}
            {...rest}
        >
            <defs>
                <pattern
                    id={patternId}
                    width={width}
                    height={height}
                    patternUnits="userSpaceOnUse"
                    patternTransform={`scale(1)`} // Ensures pattern size matches input dimensions
                >
                    <g style={{ transform: `scale(1)` }}>
                        {generateLines(false)} {/* Horizontal lines */}
                        {generateLines(true)} {/* Vertical lines */}
                    </g>
                </pattern>
            </defs>
            <rect
                width="100%"
                height="100%"
                strokeWidth="0"
                fill={`url(#${patternId})`}
            />
        </svg>
    )
}

const GridController = () => {
    const [settings, setSettings] = useState({
        width: 40,
        height: 40,
        amplitude: 4,
        frequency: 1,
        opacity: 0.3,
        randomness: 0.5,
        seed: 1,
        showCode: false
    })

    const regeneratePattern = () => {
        setSettings(prev => ({
            ...prev,
            seed: Math.random() * 1000
        }))
    }

    return (
        <div className="w-full max-w-3xl mx-auto space-y-8">
            <Card className="relative overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Grid Pattern Preview</CardTitle>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                                setSettings(prev => ({
                                    ...prev,
                                    showCode: !prev.showCode
                                }))
                            }
                            className="h-8 w-8"
                        >
                            <Code className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={regeneratePattern}
                            className="h-8 w-8"
                        >
                            <Shuffle className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-64 w-full relative bg-white rounded-lg border">
                        <WavyGrid
                            className={`opacity-${Math.round(settings.opacity * 100)}`}
                            width={settings.width}
                            height={settings.height}
                            amplitude={settings.amplitude}
                            frequency={settings.frequency}
                            randomness={settings.randomness}
                            seed={settings.seed}
                        />
                    </div>
                    {settings.showCode && (
                        <pre className="mt-4 p-4 bg-gray-100 rounded-lg overflow-x-auto">
                            <code>{`<WavyGrid
  width={${settings.width}}
  height={${settings.height}}
  amplitude={${settings.amplitude}}
  frequency={${settings.frequency}}
  randomness={${settings.randomness}}
  opacity={${settings.opacity}}
/>`}</code>
                        </pre>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Grid Controls</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Width</Label>
                                <Slider
                                    value={[settings.width]}
                                    min={20}
                                    max={200}
                                    step={10}
                                    onValueChange={value =>
                                        setSettings(prev => ({
                                            ...prev,
                                            width: value[0]
                                        }))
                                    }
                                />
                                <div className="text-sm text-gray-500">
                                    {settings.width}px
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Height</Label>
                                <Slider
                                    value={[settings.height]}
                                    min={20}
                                    max={200}
                                    step={10}
                                    onValueChange={value =>
                                        setSettings(prev => ({
                                            ...prev,
                                            height: value[0]
                                        }))
                                    }
                                />
                                <div className="text-sm text-gray-500">
                                    {settings.height}px
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Wave Amplitude</Label>
                            <Slider
                                value={[settings.amplitude]}
                                min={0}
                                max={20}
                                step={1}
                                onValueChange={value =>
                                    setSettings(prev => ({
                                        ...prev,
                                        amplitude: value[0]
                                    }))
                                }
                            />
                            <div className="text-sm text-gray-500">
                                {settings.amplitude}px
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Wave Frequency</Label>
                            <Slider
                                value={[settings.frequency]}
                                min={0.5}
                                max={4}
                                step={0.5}
                                onValueChange={value =>
                                    setSettings(prev => ({
                                        ...prev,
                                        frequency: value[0]
                                    }))
                                }
                            />
                            <div className="text-sm text-gray-500">
                                ?{settings.frequency}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Randomness</Label>
                            <Slider
                                value={[settings.randomness]}
                                min={0}
                                max={1}
                                step={0.1}
                                onValueChange={value =>
                                    setSettings(prev => ({
                                        ...prev,
                                        randomness: value[0]
                                    }))
                                }
                            />
                            <div className="text-sm text-gray-500">
                                {Math.round(settings.randomness * 100)}%
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Opacity</Label>
                            <Slider
                                value={[settings.opacity]}
                                min={0.1}
                                max={1}
                                step={0.1}
                                onValueChange={value =>
                                    setSettings(prev => ({
                                        ...prev,
                                        opacity: value[0]
                                    }))
                                }
                            />
                            <div className="text-sm text-gray-500">
                                {Math.round(settings.opacity * 100)}%
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default GridController
