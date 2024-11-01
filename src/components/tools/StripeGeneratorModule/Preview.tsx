import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { PatternSettings } from "./types"

interface PreviewProps {
    settings: PatternSettings
}

const OrganicWigglingStripes = ({
    direction = "rtl",
    stripeWidth = 2,
    patternSize = 4,
    className = "",
    primaryColor = "#e5e5e5",
    secondaryColor = "#ffffff",
    noiseIntensity = 0.5,
    blurAmount = 0.5,
    wiggleIntensity = 1,
    layers = 2,
    animationSpeed = 4
}) => {
    const rotation = direction === "rtl" ? 45 : -45
    const adjustedPatternSize = Math.max(patternSize, stripeWidth * 2)
    const uniqueId = `organic-${Math.random().toString(36).substr(2, 9)}`

    const getRandomDuration = (base = animationSpeed) => {
        return base + Math.random() * 2 + "s"
    }

    return (
        <div className={`relative w-full h-full ${className}`}>
            <svg
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
            >
                <defs>
                    <filter id={`noise-${uniqueId}`}>
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.65"
                            numOctaves="3"
                            seed="15"
                            stitchTiles="stitch"
                        >
                            <animate
                                attributeName="baseFrequency"
                                dur={`${animationSpeed * 2}s`}
                                values="0.65;0.75;0.65"
                                repeatCount="indefinite"
                            />
                        </feTurbulence>
                        <feColorMatrix type="saturate" values="0" />
                        <feComponentTransfer>
                            <feFuncA
                                type="linear"
                                slope={noiseIntensity}
                                intercept="0"
                            />
                        </feComponentTransfer>
                        <feGaussianBlur stdDeviation={blurAmount} />
                    </filter>

                    {[...Array(layers)].map((_, i) => (
                        <filter id={`wiggle-${uniqueId}-${i}`} key={i}>
                            <feTurbulence
                                type="turbulence"
                                baseFrequency="0.01"
                                numOctaves="1"
                                result="turbulence"
                            >
                                <animate
                                    attributeName="seed"
                                    from={i * 10}
                                    to={i * 10 + 100}
                                    dur={getRandomDuration(
                                        animationSpeed * 1.5
                                    )}
                                    repeatCount="indefinite"
                                />
                            </feTurbulence>
                            <feDisplacementMap
                                in="SourceGraphic"
                                in2="turbulence"
                                scale={wiggleIntensity * 5}
                                xChannelSelector="R"
                                yChannelSelector="G"
                            />
                        </filter>
                    ))}

                    <pattern
                        id={`stripe-${uniqueId}`}
                        width={adjustedPatternSize}
                        height={adjustedPatternSize}
                        patternUnits="userSpaceOnUse"
                        patternTransform={`rotate(${rotation})`}
                    >
                        <rect
                            width={stripeWidth}
                            height={adjustedPatternSize}
                            fill={primaryColor}
                            opacity="0.85"
                        />
                        <rect
                            x={stripeWidth}
                            width={stripeWidth}
                            height={adjustedPatternSize}
                            fill={secondaryColor}
                            opacity="0.85"
                        />
                    </pattern>
                </defs>

                <g>
                    {[...Array(layers)].map((_, i) => (
                        <rect
                            key={i}
                            width="100%"
                            height="100%"
                            fill={`url(#stripe-${uniqueId})`}
                            filter={`url(#wiggle-${uniqueId}-${i})`}
                            opacity={0.7}
                        >
                            <animateTransform
                                attributeName="transform"
                                type="translate"
                                values={`${i * 2} ${i * 2}; ${-i * 2} ${-i * 2}; ${i * 2} ${i * 2}`}
                                dur={getRandomDuration()}
                                repeatCount="indefinite"
                            />
                        </rect>
                    ))}
                    <rect
                        width="100%"
                        height="100%"
                        filter={`url(#noise-${uniqueId})`}
                        opacity="0.3"
                    />
                </g>
            </svg>
        </div>
    )
}

const Preview = ({ settings }: PreviewProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Pattern Preview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-64 rounded-lg overflow-hidden">
                    <OrganicWigglingStripes {...settings} />
                </div>
            </CardContent>
        </Card>
    )
}

export default Preview
