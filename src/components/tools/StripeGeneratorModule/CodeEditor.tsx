import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code } from "lucide-react"
import type { PatternSettings } from "./types"

interface CodeEditorProps {
    settings: PatternSettings
}

const CodeEditor = ({ settings }: CodeEditorProps) => {
    const generateUniqueId = () =>
        `organic-${Math.random().toString(36).substr(2, 9)}`

    const generateCode = () => {
        const {
            direction,
            stripeWidth,
            patternSize,
            primaryColor,
            secondaryColor,
            noiseIntensity,
            blurAmount,
            wiggleIntensity,
            layers,
            animationSpeed
        } = settings

        const uniqueId = generateUniqueId()
        const rotation = direction === "rtl" ? 45 : -45
        const adjustedPatternSize = Math.max(patternSize, stripeWidth * 2)

        return `<!-- HTML Implementation -->
<div class="relative w-full h-full">
  <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <defs>
      <!-- Noise Filter -->
      <filter id="noise-${uniqueId}">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="3"
          seed="15"
          stitchTiles="stitch">
          <animate
            attributeName="baseFrequency"
            dur="${animationSpeed * 2}s"
            values="0.65;0.75;0.65"
            repeatCount="indefinite"
          />
        </feTurbulence>
        <feColorMatrix type="saturate" values="0"/>
        <feComponentTransfer>
          <feFuncA type="linear" slope="${noiseIntensity}" intercept="0"/>
        </feComponentTransfer>
        <feGaussianBlur stdDeviation="${blurAmount}"/>
      </filter>

      <!-- Wiggle Filters -->
${[...Array(layers)]
    .map(
        (_, i) => `      <filter id="wiggle-${uniqueId}-${i}">
        <feTurbulence
          type="turbulence"
          baseFrequency="0.01"
          numOctaves="1"
          result="turbulence">
          <animate
            attributeName="seed"
            from="${i * 10}"
            to="${i * 10 + 100}"
            dur="${animationSpeed * 1.5 + Math.random() * 2}s"
            repeatCount="indefinite"
          />
        </feTurbulence>
        <feDisplacementMap
          in="SourceGraphic"
          in2="turbulence"
          scale="${wiggleIntensity * 5}"
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>`
    )
    .join("\n")}

      <!-- Stripe Pattern -->
      <pattern
        id="stripe-${uniqueId}"
        width="${adjustedPatternSize}"
        height="${adjustedPatternSize}"
        patternUnits="userSpaceOnUse"
        patternTransform="rotate(${rotation})">
        <rect
          width="${stripeWidth}"
          height="${adjustedPatternSize}"
          fill="${primaryColor}"
          opacity="0.85"
        />
        <rect
          x="${stripeWidth}"
          width="${stripeWidth}"
          height="${adjustedPatternSize}"
          fill="${secondaryColor}"
          opacity="0.85"
        />
      </pattern>
    </defs>

    <!-- Pattern Layers -->
    <g>
${[...Array(layers)]
    .map(
        (_, i) => `      <rect
        width="100%"
        height="100%"
        fill="url(#stripe-${uniqueId})"
        filter="url(#wiggle-${uniqueId}-${i})"
        opacity="0.7">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="${i * 2} ${i * 2}; ${-i * 2} ${-i * 2}; ${i * 2} ${i * 2}"
          dur="${animationSpeed + Math.random() * 2}s"
          repeatCount="indefinite"
        />
      </rect>`
    )
    .join("\n")}
      
      <!-- Noise Overlay -->
      <rect
        width="100%"
        height="100%"
        filter="url(#noise-${uniqueId})"
        opacity="0.3"
      />
    </g>
  </svg>
</div>

<!-- CSS Required -->
<style>
.relative {
  position: relative;
}

.w-full {
  width: 100%;
}

.h-full {
  height: 100%;
}
</style>`
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    Implementation Code
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto">
                    <pre className="font-mono text-sm">
                        <code>{generateCode()}</code>
                    </pre>
                </div>
            </CardContent>
        </Card>
    )
}

export default CodeEditor
