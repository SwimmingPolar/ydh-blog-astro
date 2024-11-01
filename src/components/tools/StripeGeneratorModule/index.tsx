import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Code } from "lucide-react"
import { useState } from "react"
import type { PatternSettings } from "./types"
import Preview from "./Preview"
import Controller from "./Controller"
import CodeEditor from "./CodeEditor"

// Main StripeGenerator Component
const defaultSettings: PatternSettings = {
    direction: "rtl",
    stripeWidth: 6,
    patternSize: 12,
    primaryColor: "#d4d4d4",
    secondaryColor: "#f5f5f5",
    noiseIntensity: 0.3,
    blurAmount: 0.7,
    wiggleIntensity: 0.8,
    layers: 2,
    animationSpeed: 4
}

const StripeGenerator = () => {
    const [settings, setSettings] = useState<PatternSettings>(defaultSettings)

    const handleReset = () => {
        setSettings(defaultSettings)
    }

    return (
        <div className="p-8 space-y-8 bg-gray-50">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                    Enhanced Subtle Organic Pattern
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Preview settings={settings} />
                <Controller
                    settings={settings}
                    onSettingsChange={setSettings}
                    onReset={handleReset}
                />
            </div>

            <CodeEditor settings={settings} />
        </div>
    )
}

export default StripeGenerator
