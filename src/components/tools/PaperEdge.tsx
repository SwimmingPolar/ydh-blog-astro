import React, { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Save, Trash2, RefreshCw, ChevronsUpDown } from "lucide-react"

const PRESET_EXAMPLES = [
    {
        name: "Gentle Wave",
        width: 1020,
        height: 100,
        segments: 15,
        roughness: 20,
        variance: 0.3
    },
    {
        name: "Rough Edge",
        width: 1020,
        height: 120,
        segments: 30,
        roughness: 50,
        variance: 0.7
    },
    {
        name: "Sharp Tears",
        width: 1020,
        height: 80,
        segments: 10,
        roughness: 40,
        variance: 0.8
    },
    {
        name: "Subtle Rip",
        width: 1020,
        height: 60,
        segments: 25,
        roughness: 15,
        variance: 0.4
    }
]

const PaperRipGenerator = () => {
    const [width, setWidth] = useState(1020)
    const [height, setHeight] = useState(100)
    const [segments, setSegments] = useState(20)
    const [roughness, setRoughness] = useState(30)
    const [variance, setVariance] = useState(0.5)
    const [savedSettings, setSavedSettings] = useState([])
    const [customName, setCustomName] = useState("")
    const [refreshKey, setRefreshKey] = useState(0)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [paths, setPaths] = useState({ top: "", bottom: "" })

    const generatePath = (isBottom = false) => {
        const points = []
        const segmentWidth = width / segments
        const startY = isBottom ? 0 : height
        const controlY = isBottom ? height * 0.3 : height * 0.7

        points.push(`M0 ${startY}V${controlY}`)

        for (let i = 0; i <= segments; i++) {
            const x = i * segmentWidth
            const baseY = controlY

            const randomY =
                baseY +
                (Math.random() - variance) * roughness * (isBottom ? 1 : -1)

            if (i > 0) {
                const cp1x = x - segmentWidth * 0.5
                const cp1y =
                    baseY +
                    (Math.random() - variance) * roughness * (isBottom ? 1 : -1)
                const cp2x = x - segmentWidth * 0.25
                const cp2y =
                    baseY +
                    (Math.random() - variance) * roughness * (isBottom ? 1 : -1)

                points.push(`C${cp1x} ${cp1y} ${cp2x} ${cp2y} ${x} ${randomY}`)
            }
        }

        points.push(`V${startY}H0Z`)

        return points.join(" ")
    }

    // Generate a unique ID for the clipPath
    const clipId = React.useId()

    const generateVerticalTornPath = (isRight = false) => {
        const points = []
        const segmentHeight = height / segments
        const startX = isRight ? 0 : width
        const controlX = isRight ? width * 0.7 : width * 0.3

        // Start from top
        points.push(`M${startX} 0H${controlX}`)

        for (let i = 0; i <= segments; i++) {
            const y = i * segmentHeight
            const baseX = controlX

            const randomX =
                baseX +
                (Math.random() - variance) * roughness * (isRight ? 1 : -1)

            if (i > 0) {
                // Create bezier curve points
                const cp1y = y - segmentHeight * 0.5
                const cp1x =
                    baseX +
                    (Math.random() - variance) * roughness * (isRight ? 1 : -1)
                const cp2y = y - segmentHeight * 0.25
                const cp2x =
                    baseX +
                    (Math.random() - variance) * roughness * (isRight ? 1 : -1)

                points.push(`C${cp1x} ${cp1y} ${cp2x} ${cp2y} ${randomX} ${y}`)
            }
        }

        // Complete the path
        points.push(`H${startX}Z`)

        return points.join(" ")
    }

    useEffect(() => {
        const saved = localStorage.getItem("paperRipSettings")
        if (saved) {
            setSavedSettings(JSON.parse(saved))
        }
        generateBothPaths()
    }, [])

    // Add effect to regenerate on any control value change
    useEffect(() => {
        generateBothPaths()
    }, [width, height, segments, roughness, variance]) // Regenerate when any control value changes

    // Add effect for initial load
    useEffect(() => {
        const saved = localStorage.getItem("paperRipSettings")
        if (saved) {
            setSavedSettings(JSON.parse(saved))
        }
        generateBothPaths()
    }, []) // Only run on mount

    const generateBothPaths = () => {
        setPaths({
            top: generatePath(false),
            bottom: generatePath(true)
        })
    }

    const handleRefresh = () => {
        setIsRefreshing(true)
        setRefreshKey(prev => prev + 1)
        generateBothPaths()

        setTimeout(() => {
            setIsRefreshing(false)
        }, 300)
    }

    const applySettings = settings => {
        setWidth(settings.width)
        setHeight(settings.height)
        setSegments(settings.segments)
        setRoughness(settings.roughness)
        setVariance(settings.variance)
        handleRefresh()
    }

    const saveCurrentSettings = () => {
        if (!customName.trim()) return

        const newSetting = {
            name: customName,
            width,
            height,
            segments,
            roughness,
            variance
        }

        const updatedSettings = [...savedSettings, newSetting]
        setSavedSettings(updatedSettings)
        localStorage.setItem(
            "paperRipSettings",
            JSON.stringify(updatedSettings)
        )
        setCustomName("")
    }

    const deleteSavedSetting = index => {
        const updatedSettings = savedSettings.filter((_, i) => i !== index)
        setSavedSettings(updatedSettings)
        localStorage.setItem(
            "paperRipSettings",
            JSON.stringify(updatedSettings)
        )
    }

    // Modified Input handlers to include refresh animation
    const handleInputChange = setter => e => {
        setIsRefreshing(true)
        setter(Number(e.target.value))
        setRefreshKey(prev => prev + 1)
        setTimeout(() => setIsRefreshing(false), 300)
    }

    const handleSliderChange =
        setter =>
        ([value]) => {
            setIsRefreshing(true)
            setter(value)
            setRefreshKey(prev => prev + 1)
            setTimeout(() => setIsRefreshing(false), 300)
        }

    const handleVarianceChange = ([value]) => {
        setIsRefreshing(true)
        setVariance(value / 100)
        setRefreshKey(prev => prev + 1)
        setTimeout(() => setIsRefreshing(false), 300)
    }

    return (
        <div className="w-full max-w-4xl space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Dual Paper Rip Generator</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6">
                        {/* Preset Examples */}
                        <div className="space-y-2">
                            <Label>Preset Examples</Label>
                            <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                                {PRESET_EXAMPLES.map((preset, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => applySettings(preset)}
                                    >
                                        {preset.name}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Custom Saved Settings */}
                        {savedSettings.length > 0 && (
                            <div className="space-y-2">
                                <Label>Your Saved Settings</Label>
                                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                    {savedSettings.map((setting, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2"
                                        >
                                            <Button
                                                variant="outline"
                                                className="flex-1"
                                                onClick={() =>
                                                    applySettings(setting)
                                                }
                                            >
                                                {setting.name}
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() =>
                                                    deleteSavedSetting(index)
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Save New Settings */}
                        <div className="flex gap-2">
                            <Input
                                placeholder="Name your settings"
                                value={customName}
                                onChange={e => setCustomName(e.target.value)}
                            />
                            <Button onClick={saveCurrentSettings}>
                                <Save className="h-4 w-4 mr-2" />
                                Save
                            </Button>
                        </div>

                        {/* Controls */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Width</Label>
                                <Input
                                    type="number"
                                    value={width}
                                    onChange={handleInputChange(setWidth)}
                                    className="w-full"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Height</Label>
                                <Input
                                    type="number"
                                    value={height}
                                    onChange={handleInputChange(setHeight)}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Segments: {segments}</Label>
                            <Slider
                                value={[segments]}
                                onValueChange={handleSliderChange(setSegments)}
                                min={5}
                                max={50}
                                step={1}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Roughness: {roughness}</Label>
                            <Slider
                                value={[roughness]}
                                onValueChange={handleSliderChange(setRoughness)}
                                min={5}
                                max={100}
                                step={1}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Variance: {variance.toFixed(2)}</Label>
                            <Slider
                                value={[variance * 100]}
                                onValueChange={handleVarianceChange}
                                min={0}
                                max={100}
                                step={1}
                            />
                        </div>

                        {/* Preview section with refresh animation */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label>Preview</Label>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setIsRefreshing(true)
                                        setRefreshKey(prev => prev + 1)
                                        generateBothPaths()
                                        setTimeout(
                                            () => setIsRefreshing(false),
                                            300
                                        )
                                    }}
                                    className="gap-2"
                                >
                                    <RefreshCw
                                        className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                                    />
                                    Regenerate Both
                                </Button>
                            </div>{" "}
                            <div className="border rounded-lg p-4 bg-slate-50 space-y-4">
                                <div className="relative">
                                    {/* Define the clip path */}
                                    <svg
                                        width="0"
                                        height="0"
                                        className="absolute"
                                    >
                                        <defs>
                                            <clipPath
                                                id={clipId}
                                                clipPathUnits="userSpaceOnUse"
                                            >
                                                <path
                                                    d={generateVerticalTornPath(
                                                        true
                                                    )}
                                                />
                                            </clipPath>
                                        </defs>
                                    </svg>

                                    {/* Content container with clipping applied */}
                                    {/*
                                        <div
                                            className="relative"
                                            style={{
                                                clipPath: `url(#${clipId})`,
                                                width: `${width}px`,
                                                height: `${height}px`
                                            }}
                                        >
                                            <div className="w-full h-full bg-gradient-to-r from-blue-100 to-blue-200">
                                                <div className="p-4">
                                                    Your content here
                                                </div>
                                            </div>
                                        </div>
                                        */}

                                    <div className="border-b pb-4">
                                        <svg
                                            key={`top-${refreshKey}`}
                                            width={width}
                                            height={height}
                                            viewBox={`0 0 ${width} ${height}`}
                                            className="w-full"
                                        >
                                            <path
                                                // d={paths.top}
                                                d={generateVerticalTornPath(
                                                    true
                                                )}
                                                fill="white"
                                                stroke="black"
                                                strokeWidth="1"
                                            />
                                        </svg>
                                    </div>

                                    <div className="border-b pb-4">
                                        <svg
                                            key={`top-${refreshKey}`}
                                            width={width}
                                            height={height}
                                            viewBox={`0 0 ${width} ${height}`}
                                            className="w-full"
                                        >
                                            <path
                                                d={paths.bottom}
                                                fill="white"
                                                stroke="black"
                                                strokeWidth="1"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Generated Code */}
                        <div className="font-mono text-sm p-4 bg-slate-100 rounded-lg overflow-x-auto space-y-4">
                            <div>
                                <Label className="text-xs text-slate-500">
                                    Top Edge:
                                </Label>
                                <pre>{`<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="${paths.top}" fill="white"/>
</svg>`}</pre>
                            </div>
                            <div>
                                <Label className="text-xs text-slate-500">
                                    Bottom Edge:
                                </Label>
                                <pre>{`<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="${paths.bottom}" fill="white"/>
</svg>`}</pre>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default PaperRipGenerator
