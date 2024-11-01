import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

// Updated path generator function for all four sides
const generateRippedPath = (width, height) => {
    // Path generation utilities
    const getSegments = (min, max) =>
        Math.floor(Math.random() * (max - min + 1)) + min

    // Helper function to generate points for one edge
    const generateEdgePoints = (
        start,
        end,
        isVertical = false,
        roughness = 1
    ) => {
        const points = []
        const [x1, y1] = start
        const [x2, y2] = end
        const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))

        // Increase minimum segments and make it proportional to length
        const minSegments = Math.max(8, Math.floor(length / 30))
        const segments = getSegments(minSegments, minSegments + 4)

        for (let i = 0; i <= segments; i++) {
            const progress = i / segments
            const x = x1 + (x2 - x1) * progress
            const y = y1 + (y2 - y1) * progress

            if (i > 0 && i < segments) {
                // Enhanced amplitude variation
                const edgeDistance = Math.sin(progress * Math.PI) // More variation in middle
                const amplitudeBase = Math.min(length * 0.15, 25) * roughness
                const amplitude = amplitudeBase * (0.8 + edgeDistance * 0.4)

                // Add multiple layers of distortion
                const mainTear = (Math.random() - 0.5) * amplitude
                const secondaryTear = (Math.random() - 0.5) * (amplitude * 0.5)
                const microTear = (Math.random() - 0.5) * (amplitude * 0.2)

                const totalTear = mainTear + secondaryTear + microTear
                const perpTear = (Math.random() - 0.3) * (amplitude * 0.7)

                if (isVertical) {
                    points.push([x + perpTear, y + totalTear])
                    // Add extra points between segments for more detail
                    if (i < segments - 1) {
                        const subProgress = progress + 0.5 / segments
                        const subX = x1 + (x2 - x1) * subProgress
                        const subY = y1 + (y2 - y1) * subProgress
                        points.push([
                            subX + (Math.random() - 0.5) * amplitude * 0.7,
                            subY + (Math.random() - 0.5) * amplitude * 0.7
                        ])
                    }
                } else {
                    points.push([x + totalTear, y + perpTear])
                    // Add extra points between segments for more detail
                    if (i < segments - 1) {
                        const subProgress = progress + 0.5 / segments
                        const subX = x1 + (x2 - x1) * subProgress
                        const subY = y1 + (y2 - y1) * subProgress
                        points.push([
                            subX + (Math.random() - 0.5) * amplitude * 0.7,
                            subY + (Math.random() - 0.5) * amplitude * 0.7
                        ])
                    }
                }
            } else {
                // Enhanced corner distortion
                const cornerRandom = Math.random() * 3 - 1.5
                points.push([
                    x + cornerRandom * roughness * 2,
                    y + cornerRandom * roughness * 2
                ])
            }
        }
        return points
    }

    // Generate points for each edge
    const topEdge = generateEdgePoints([0, 0], [width, 0])
    const rightEdge = generateEdgePoints([width, 0], [width, height])
    const bottomEdge = generateEdgePoints([width, height], [0, height])
    const leftEdge = generateEdgePoints([0, height], [0, 0])

    // Combine all points into a path
    const allPoints = [...topEdge, ...rightEdge, ...bottomEdge, ...leftEdge]

    // Create SVG path
    let path = `M ${allPoints[0][0]},${allPoints[0][1]}`
    allPoints.forEach(point => {
        path += ` L ${point[0]},${point[1]}`
    })
    path += " Z"

    return path
}

const RippedPaperEffect = ({
    backgroundColor = "#ffffff",
    shadowColor = "rgba(0, 0, 0, 0.5)",
    shadowOffset = 6,
    shadowBlur = 3,
    noiseAmount = 0.5,
    edgeRoughness = 1,
    animationSpeed = 4,
    isAnimated = true,
    width = 400,
    height = 300,
    className = "",
    children
}) => {
    const uniqueId = `ripped-${Math.random().toString(36).substr(2, 9)}`
    const path = generateRippedPath(width, height)

    return (
        <div className={`relative ${className}`}>
            <svg className="absolute w-0 h-0">
                <defs>
                    <filter id={`paper-shadow-${uniqueId}`}>
                        <feGaussianBlur
                            in="SourceAlpha"
                            stdDeviation={shadowBlur}
                        />
                        <feOffset dx={shadowOffset / 2} dy={shadowOffset} />
                        <feComponentTransfer>
                            <feFuncA type="linear" slope="0.5" />
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    // And in the SVG filters, enhance the noise effect:
                    <filter id={`noise-${uniqueId}`}>
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency={`${noiseAmount * 0.03} ${noiseAmount * 0.03}`}
                            numOctaves="6"
                            seed="0"
                            stitchTiles="stitch"
                        >
                            <animate
                                attributeName="baseFrequency"
                                dur={`${animationSpeed}s`}
                                values={`${noiseAmount * 0.03} ${noiseAmount * 0.03};
              ${noiseAmount * 0.04} ${noiseAmount * 0.04};
              ${noiseAmount * 0.03} ${noiseAmount * 0.03}`}
                                keyTimes="0;0.5;1"
                                calcMode="spline"
                                keySplines="0.4 0 0.6 1; 0.4 0 0.6 1"
                                repeatCount="indefinite"
                            />
                        </feTurbulence>
                        <feDisplacementMap
                            in="SourceGraphic"
                            scale={edgeRoughness * 20}
                        />
                        <feTurbulence
                            type="turbulence"
                            baseFrequency={`${noiseAmount * 0.05} ${noiseAmount * 0.05}`}
                            numOctaves="4"
                            seed="1"
                            stitchTiles="stitch"
                        />
                        <feDisplacementMap
                            in="SourceGraphic"
                            scale={edgeRoughness * 10}
                        />
                    </filter>
                    <mask id={`paper-mask-${uniqueId}`}>
                        <path
                            d={path}
                            fill="white"
                            filter={`url(#noise-${uniqueId})`}
                        />
                    </mask>
                </defs>
            </svg>
            <div
                className="relative"
                style={{ filter: `url(#paper-shadow-${uniqueId})` }}
            >
                <div
                    className="relative overflow-hidden"
                    style={{
                        maskImage: `url(#paper-mask-${uniqueId})`,
                        WebkitMaskImage: `url(#paper-mask-${uniqueId})`,
                        backgroundColor,
                        width: `${width}px`,
                        height: `${height}px`
                    }}
                >
                    <div className="p-6 w-full h-full">{children}</div>
                </div>
            </div>
        </div>
    )
}

// The Controls component (same as before)
const RippedPaperControls = ({ onSettingsChange }) => {
    const [settings, setSettings] = useState({
        backgroundColor: "#ffffff",
        shadowColor: "#000000",
        shadowOffset: 6,
        shadowBlur: 3,
        noiseAmount: 0.5,
        edgeRoughness: 1,
        animationSpeed: 4,
        isAnimated: true,
        width: 400,
        height: 300
    })

    const handleChange = (key, value) => {
        const newSettings = { ...settings, [key]: value }
        setSettings(newSettings)
        onSettingsChange(newSettings)
    }

    return (
        <Card className="w-full max-w-xl">
            <CardHeader>
                <CardTitle>Ripped Paper Effect Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Colors */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="backgroundColor">
                            Background Color
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                id="backgroundColor"
                                type="color"
                                value={settings.backgroundColor}
                                onChange={e =>
                                    handleChange(
                                        "backgroundColor",
                                        e.target.value
                                    )
                                }
                                className="w-16 h-8 p-1"
                            />
                            <Input
                                type="text"
                                value={settings.backgroundColor}
                                onChange={e =>
                                    handleChange(
                                        "backgroundColor",
                                        e.target.value
                                    )
                                }
                                className="flex-1"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="shadowColor">Shadow Color</Label>
                        <div className="flex gap-2">
                            <Input
                                id="shadowColor"
                                type="color"
                                value={settings.shadowColor}
                                onChange={e => {
                                    const hex = e.target.value
                                    const rgba = `rgba(${parseInt(hex.slice(1, 3), 16)}, ${parseInt(hex.slice(3, 5), 16)}, ${parseInt(hex.slice(5, 7), 16)}, 0.5)`
                                    handleChange("shadowColor", rgba)
                                }}
                                className="w-16 h-8 p-1"
                            />
                            <Input
                                type="text"
                                value={settings.shadowColor}
                                onChange={e =>
                                    handleChange("shadowColor", e.target.value)
                                }
                                className="flex-1"
                            />
                        </div>
                    </div>
                </div>

                {/* Shadow Controls */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Shadow Offset ({settings.shadowOffset}px)</Label>
                        <Slider
                            value={[settings.shadowOffset]}
                            min={0}
                            max={20}
                            step={1}
                            onValueChange={([value]) =>
                                handleChange("shadowOffset", value)
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Shadow Blur ({settings.shadowBlur}px)</Label>
                        <Slider
                            value={[settings.shadowBlur]}
                            min={0}
                            max={10}
                            step={0.1}
                            onValueChange={([value]) =>
                                handleChange("shadowBlur", value)
                            }
                        />
                    </div>
                </div>

                {/* Effect Controls */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>
                            Noise Amount ({settings.noiseAmount.toFixed(2)})
                        </Label>
                        <Slider
                            value={[settings.noiseAmount]}
                            min={0}
                            max={1}
                            step={0.01}
                            onValueChange={([value]) =>
                                handleChange("noiseAmount", value)
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Edge Roughness ({settings.edgeRoughness.toFixed(2)})
                        </Label>
                        <Slider
                            value={[settings.edgeRoughness]}
                            min={0}
                            max={2}
                            step={0.1}
                            onValueChange={([value]) =>
                                handleChange("edgeRoughness", value)
                            }
                        />
                    </div>
                </div>

                {/* Animation Controls */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="isAnimated">Animate Effect</Label>
                        <Switch
                            id="isAnimated"
                            checked={settings.isAnimated}
                            onCheckedChange={checked =>
                                handleChange("isAnimated", checked)
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>
                            Animation Speed ({settings.animationSpeed}s)
                        </Label>
                        <Slider
                            value={[settings.animationSpeed]}
                            min={1}
                            max={10}
                            step={0.1}
                            onValueChange={([value]) =>
                                handleChange("animationSpeed", value)
                            }
                            disabled={!settings.isAnimated}
                        />
                    </div>
                </div>

                {/* Dimensions */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="width">Width (px)</Label>
                        <Input
                            id="width"
                            type="number"
                            value={settings.width}
                            onChange={e =>
                                handleChange(
                                    "width",
                                    parseInt(e.target.value, 10)
                                )
                            }
                            min={100}
                            max={1000}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="height">Height (px)</Label>
                        <Input
                            id="height"
                            type="number"
                            value={settings.height}
                            onChange={e =>
                                handleChange(
                                    "height",
                                    parseInt(e.target.value, 10)
                                )
                            }
                            min={100}
                            max={1000}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

// The Demo component
const RippedPaperDemo = () => {
    const [settings, setSettings] = useState({
        backgroundColor: "#ffffff",
        shadowColor: "rgba(0, 0, 0, 0.5)",
        shadowOffset: 6,
        shadowBlur: 3,
        noiseAmount: 0.5,
        edgeRoughness: 1,
        animationSpeed: 4,
        isAnimated: true,
        width: 400,
        height: 300
    })

    return (
        <div className="flex flex-col lg:flex-row gap-8 p-8">
            <RippedPaperControls onSettingsChange={setSettings} />
            <div className="flex-1 flex items-start justify-center">
                <RippedPaperEffect {...settings}>
                    <div className="prose dark:prose-invert">
                        <h2>Sample Content</h2>
                        <p>
                            This is an example of the ripped paper effect. Try
                            adjusting the controls to customize the appearance!
                        </p>
                    </div>
                </RippedPaperEffect>
            </div>
        </div>
    )
}

export default RippedPaperDemo
