export interface PatternSettings {
    direction: "rtl" | "ltr"
    stripeWidth: number
    patternSize: number
    primaryColor: string
    secondaryColor: string
    noiseIntensity: number
    blurAmount: number
    wiggleIntensity: number
    layers: number
    animationSpeed: number
}

export interface Preset extends PatternSettings {
    name: string
}

export type CustomPresets = Record<string, PatternSettings>
