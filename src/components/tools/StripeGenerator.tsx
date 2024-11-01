import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@components/ui/toaster"
import { ToastAction } from "@radix-ui/react-toast"
import { Code, Copy, RotateCcw, Save, Trash2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"

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
    animationSpeed = 4,
    isAnimated = true
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
                            {isAnimated && (
                                <animate
                                    attributeName="baseFrequency"
                                    dur={`${animationSpeed * 2}s`}
                                    values="0.65;0.75;0.65"
                                    repeatCount="indefinite"
                                />
                            )}
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
                                {isAnimated && (
                                    <animate
                                        attributeName="seed"
                                        from={i * 10}
                                        to={i * 10 + 100}
                                        dur={getRandomDuration(
                                            animationSpeed * 1.5
                                        )}
                                        repeatCount="indefinite"
                                    />
                                )}
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
                            {isAnimated && (
                                <animateTransform
                                    attributeName="transform"
                                    type="translate"
                                    values={`${i * 2} ${i * 2}; ${-i * 2} ${-i * 2}; ${i * 2} ${i * 2}`}
                                    dur={getRandomDuration()}
                                    repeatCount="indefinite"
                                />
                            )}
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

const generatePatternSVG = ({
    direction = "rtl",
    stripeWidth = 2,
    patternSize = 4,
    primaryColor = "#e5e5e5",
    secondaryColor = "#ffffff",
    noiseIntensity = 0.5,
    blurAmount = 0.5,
    wiggleIntensity = 1,
    layers = 2,
    animationSpeed = 4,
    isAnimated = true
} = {}) => {
    const rotation = direction === "rtl" ? 45 : -45
    const adjustedPatternSize = Math.max(patternSize, stripeWidth * 2)
    const uniqueId = `organic-${Math.random().toString(36).substr(2, 9)}`

    const getRandomDuration = (base = animationSpeed) => {
        return `${base + Math.random() * 2}s`
    }

    // Helper to create animation elements
    const createAnimation = attrs => {
        if (!isAnimated) return ""
        const attrsStr = Object.entries(attrs)
            .map(([key, value]) => `${key}="${value}"`)
            .join(" ")
        return `<animate ${attrsStr} />`
    }

    // Generate SVG filters
    const noiseFilter = `
        <filter id="noise-${uniqueId}">
            <feTurbulence 
                type="fractalNoise" 
                baseFrequency="0.65" 
                numOctaves="3" 
                seed="15" 
                stitchTiles="stitch">
                ${createAnimation({
                    attributeName: "baseFrequency",
                    dur: `${animationSpeed * 2}s`,
                    values: "0.65;0.75;0.65",
                    repeatCount: "indefinite"
                })}
            </feTurbulence>
            <feColorMatrix type="saturate" values="0"/>
            <feComponentTransfer>
                <feFuncA type="linear" slope="${noiseIntensity}" intercept="0"/>
            </feComponentTransfer>
            <feGaussianBlur stdDeviation="${blurAmount}"/>
        </filter>
    `

    // Generate wiggle filters for each layer
    const wiggleFilters = [...Array(layers)]
        .map(
            (_, i) => `
        <filter id="wiggle-${uniqueId}-${i}">
            <feTurbulence 
                type="turbulence" 
                baseFrequency="0.01" 
                numOctaves="1" 
                result="turbulence">
                ${createAnimation({
                    attributeName: "seed",
                    from: i * 10,
                    to: i * 10 + 100,
                    dur: getRandomDuration(animationSpeed * 1.5),
                    repeatCount: "indefinite"
                })}
            </feTurbulence>
            <feDisplacementMap 
                in="SourceGraphic" 
                in2="turbulence" 
                scale="${wiggleIntensity * 5}" 
                xChannelSelector="R" 
                yChannelSelector="G"/>
        </filter>
    `
        )
        .join("\n")

    // Generate pattern
    const pattern = `
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
                opacity="0.85"/>
            <rect 
                x="${stripeWidth}" 
                width="${stripeWidth}" 
                height="${adjustedPatternSize}" 
                fill="${secondaryColor}" 
                opacity="0.85"/>
        </pattern>
    `

    // Generate layers
    const layers_svg = [...Array(layers)]
        .map(
            (_, i) => `
        <rect 
            width="100%" 
            height="100%" 
            fill="url(#stripe-${uniqueId})" 
            filter="url(#wiggle-${uniqueId}-${i})" 
            opacity="0.7">
            ${createAnimation({
                attributeName: "transform",
                type: "translate",
                values: `${i * 2} ${i * 2}; ${-i * 2} ${-i * 2}; ${i * 2} ${i * 2}`,
                dur: getRandomDuration(),
                repeatCount: "indefinite"
            })}
        </rect>
    `
        )
        .join("\n")

    // Combine all elements into final SVG
    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300" preserveAspectRatio="none">
    <defs>
        ${noiseFilter}
        ${wiggleFilters}
        ${pattern}
    </defs>
    <g>
        ${layers_svg}
        <rect 
            width="100%" 
            height="100%" 
            filter="url(#noise-${uniqueId})" 
            opacity="0.3"/>
    </g>
</svg>`.trim()
}

const PatternController = () => {
    const defaultSettings = {
        direction: "rtl",
        stripeWidth: 6,
        patternSize: 12,
        primaryColor: "#d4d4d4",
        secondaryColor: "#f5f5f5",
        noiseIntensity: 0.3,
        blurAmount: 0.7,
        wiggleIntensity: 0.8,
        layers: 2,
        animationSpeed: 4,
        isAnimated: true
    }

    const [settings, setSettings] = useState(defaultSettings)
    const [activePreset, setActivePreset] = useState(null)
    const [customPresets, setCustomPresets] = useState({})
    const [newPresetName, setNewPresetName] = useState("")
    const [showPresetDialog, setShowPresetDialog] = useState(false)
    const [currentSVG, setCurrentSVG] = useState("")
    const previewRef = useRef(null)
    const { toast } = useToast()

    // Update SVG when settings change
    useEffect(() => {
        const newSVG = generatePatternSVG(settings)
        setCurrentSVG(newSVG)

        // Update preview
        if (previewRef.current) {
            previewRef.current.innerHTML = newSVG
        }
    }, [settings])

    const handleChange = (key, value) => {
        setActivePreset(null)
        setSettings(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const builtInPresets = {
        subtle: {
            stripeWidth: 6,
            patternSize: 12,
            noiseIntensity: 0.3,
            blurAmount: 0.7,
            wiggleIntensity: 0.8,
            layers: 2,
            animationSpeed: 4,
            isAnimated: true
        },
        dynamic: {
            stripeWidth: 8,
            patternSize: 16,
            noiseIntensity: 0.5,
            blurAmount: 0.4,
            wiggleIntensity: 1.2,
            layers: 3,
            animationSpeed: 3,
            isAnimated: true
        },
        refinedSilk: {
            direction: "ltr",
            stripeWidth: 8,
            patternSize: 16,
            primaryColor: "#bfbfbf",
            secondaryColor: "#e5e5e5",
            noiseIntensity: 0.4,
            blurAmount: 0.6,
            wiggleIntensity: 0.9,
            layers: 3,
            animationSpeed: 4,
            isAnimated: true
        }
    }

    const handleReset = () => {
        setSettings(defaultSettings)
        setActivePreset(null)

        toast({
            title: "Settings reset",
            description: "All settings have been reset to default values.",
            duration: 2000
        })
    }

    const saveCustomPreset = () => {
        if (newPresetName.trim()) {
            setCustomPresets(prev => ({
                ...prev,
                [newPresetName]: { ...settings }
            }))
            setActivePreset(newPresetName)
            setNewPresetName("")
            setShowPresetDialog(false)

            toast({
                title: "Preset saved",
                description: `Preset "${newPresetName}" has been saved successfully.`
            })
        } else {
            toast({
                title: "Invalid preset name",
                description: "Please enter a name for your preset.",
                variant: "destructive"
            })
        }
    }

    const deletePreset = presetName => {
        if (customPresets[presetName]) {
            const { [presetName]: _, ...rest } = customPresets
            setCustomPresets(rest)
            setActivePreset(null)

            toast({
                title: "Preset deleted",
                description: `Preset "${presetName}" has been deleted.`,
                duration: 2000
            })
        }
    }

    const applyPreset = (presetName, isCustom = false) => {
        setActivePreset(presetName)
        const presetSettings = isCustom
            ? customPresets[presetName]
            : builtInPresets[presetName]
        setSettings(prev => ({
            ...prev,
            ...presetSettings,
            isAnimated: prev.isAnimated
        }))

        toast({
            title: "Preset applied",
            description: `"${presetName}" preset has been applied.`,
            duration: 2000
        })
    }

    const toggleAnimation = () => {
        handleChange("isAnimated", !settings.isAnimated)
        toast({
            title: settings.isAnimated
                ? "Animation disabled"
                : "Animation enabled",
            description: settings.isAnimated
                ? "Pattern animation has been turned off."
                : "Pattern animation has been turned on.",
            duration: 2000
        })
    }

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(currentSVG)
            toast({
                title: "Copied to clipboard",
                description: "SVG code has been copied to your clipboard.",
                duration: 2000
            })
        } catch (err) {
            toast({
                title: "Copy failed",
                description: "Failed to copy SVG code. Please try again.",
                variant: "destructive",
                action: <ToastAction altText="Try again">Try again</ToastAction>
            })
        }
    }

    const downloadSVG = () => {
        try {
            const blob = new Blob([currentSVG], { type: "image/svg+xml" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = "pattern.svg"
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)

            toast({
                title: "Download started",
                description: "Your SVG file is being downloaded.",
                duration: 2000
            })
        } catch (err) {
            toast({
                title: "Download failed",
                description: "Failed to download SVG file. Please try again.",
                variant: "destructive",
                action: <ToastAction altText="Try again">Try again</ToastAction>
            })
        }
    }

    return (
        <>
            <div className="p-8 space-y-8 bg-gray-50">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">
                        SVG Pattern Generator
                    </h1>
                    <Button
                        variant="outline"
                        onClick={handleReset}
                        className="flex items-center gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Pattern Preview */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pattern Preview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div
                                className="h-64 rounded-lg overflow-hidden"
                                ref={previewRef}
                            />
                        </CardContent>
                    </Card>

                    {/* Controls */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Pattern Controls</CardTitle>
                            <div className="relative mt-4">
                                {/* Pattern Items - Will wrap when overflow */}
                                <div className="flex gap-2 flex-wrap pr-32">
                                    <Button
                                        variant={
                                            activePreset === "subtle"
                                                ? "default"
                                                : "outline"
                                        }
                                        onClick={() => applyPreset("subtle")}
                                    >
                                        Subtle
                                    </Button>
                                    <Button
                                        variant={
                                            activePreset === "dynamic"
                                                ? "default"
                                                : "outline"
                                        }
                                        onClick={() => applyPreset("dynamic")}
                                    >
                                        Dynamic
                                    </Button>
                                    <Button
                                        variant={
                                            activePreset === "refinedSilk"
                                                ? "default"
                                                : "outline"
                                        }
                                        onClick={() =>
                                            applyPreset("refinedSilk")
                                        }
                                    >
                                        Refined Silk
                                    </Button>

                                    {/* Custom Presets */}
                                    {Object.keys(customPresets).map(
                                        presetName => (
                                            <Button
                                                key={presetName}
                                                variant={
                                                    activePreset === presetName
                                                        ? "default"
                                                        : "outline"
                                                }
                                                onClick={() =>
                                                    applyPreset(
                                                        presetName,
                                                        true
                                                    )
                                                }
                                            >
                                                {presetName}
                                            </Button>
                                        )
                                    )}
                                </div>

                                {/* Action Buttons - Absolutely positioned */}
                                <div className="absolute right-0 top-0 flex gap-2 bg-white dark:bg-gray-950 py-0.5">
                                    <Dialog
                                        open={showPresetDialog}
                                        onOpenChange={setShowPresetDialog}
                                    >
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-9 w-9"
                                            >
                                                <Save className="w-4 h-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>
                                                    Save Custom Preset
                                                </DialogTitle>
                                            </DialogHeader>
                                            <div className="flex gap-2 mt-4">
                                                <Input
                                                    placeholder="Preset name"
                                                    value={newPresetName}
                                                    onChange={e =>
                                                        setNewPresetName(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <Button
                                                    onClick={saveCustomPreset}
                                                >
                                                    Save
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9"
                                        onClick={handleReset}
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9"
                                        onClick={() =>
                                            activePreset &&
                                            deletePreset(activePreset)
                                        }
                                        disabled={
                                            !activePreset ||
                                            !customPresets[activePreset]
                                        }
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {/* Tabs content remains the same as before */}
                            <Tabs defaultValue="dimensions" className="w-full">
                                <TabsList className="grid w-full grid-cols-4">
                                    <TabsTrigger value="dimensions">
                                        Size
                                    </TabsTrigger>
                                    <TabsTrigger value="appearance">
                                        Color
                                    </TabsTrigger>
                                    <TabsTrigger value="movement">
                                        Motion
                                    </TabsTrigger>
                                    <TabsTrigger value="advanced">
                                        Advanced
                                    </TabsTrigger>
                                </TabsList>

                                {/* Dimensions Tab */}
                                <TabsContent
                                    value="dimensions"
                                    className="space-y-6"
                                >
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Direction</Label>
                                            <Select
                                                value={settings.direction}
                                                onValueChange={value =>
                                                    handleChange(
                                                        "direction",
                                                        value
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="rtl">
                                                        Right to Left
                                                    </SelectItem>
                                                    <SelectItem value="ltr">
                                                        Left to Right
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>
                                                Stripe Width (
                                                {settings.stripeWidth}
                                                px)
                                            </Label>
                                            <Slider
                                                value={[settings.stripeWidth]}
                                                min={2}
                                                max={20}
                                                step={1}
                                                onValueChange={([value]) =>
                                                    handleChange(
                                                        "stripeWidth",
                                                        value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>
                                                Pattern Size (
                                                {settings.patternSize}
                                                px)
                                            </Label>
                                            <Slider
                                                value={[settings.patternSize]}
                                                min={4}
                                                max={40}
                                                step={2}
                                                onValueChange={([value]) =>
                                                    handleChange(
                                                        "patternSize",
                                                        value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Appearance Tab */}
                                <TabsContent
                                    value="appearance"
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Primary Color</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="color"
                                                    value={
                                                        settings.primaryColor
                                                    }
                                                    onChange={e =>
                                                        handleChange(
                                                            "primaryColor",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full h-10"
                                                />
                                                <Input
                                                    type="text"
                                                    value={
                                                        settings.primaryColor
                                                    }
                                                    onChange={e =>
                                                        handleChange(
                                                            "primaryColor",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="font-mono"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Secondary Color</Label>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="color"
                                                    value={
                                                        settings.secondaryColor
                                                    }
                                                    onChange={e =>
                                                        handleChange(
                                                            "secondaryColor",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full h-10"
                                                />
                                                <Input
                                                    type="text"
                                                    value={
                                                        settings.secondaryColor
                                                    }
                                                    onChange={e =>
                                                        handleChange(
                                                            "secondaryColor",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="font-mono"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Movement Tab */}
                                <TabsContent
                                    value="movement"
                                    className="space-y-6"
                                >
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>
                                                Wiggle Intensity (
                                                {settings.wiggleIntensity.toFixed(
                                                    1
                                                )}
                                                )
                                            </Label>
                                            <Slider
                                                value={[
                                                    settings.wiggleIntensity *
                                                        10
                                                ]}
                                                min={1}
                                                max={20}
                                                step={1}
                                                onValueChange={([value]) =>
                                                    handleChange(
                                                        "wiggleIntensity",
                                                        value / 10
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>
                                                Animation Speed (
                                                {settings.animationSpeed}s)
                                            </Label>
                                            <Slider
                                                value={[
                                                    settings.animationSpeed
                                                ]}
                                                min={1}
                                                max={10}
                                                step={1}
                                                onValueChange={([value]) =>
                                                    handleChange(
                                                        "animationSpeed",
                                                        value
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <Label>Animation</Label>
                                                <Button
                                                    variant="outline"
                                                    onClick={toggleAnimation}
                                                >
                                                    {settings.isAnimated
                                                        ? "Disable"
                                                        : "Enable"}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                {/* Advanced Tab */}
                                <TabsContent
                                    value="advanced"
                                    className="space-y-6"
                                >
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>
                                                Noise Intensity (
                                                {settings.noiseIntensity.toFixed(
                                                    1
                                                )}
                                                )
                                            </Label>
                                            <Slider
                                                value={[
                                                    settings.noiseIntensity * 10
                                                ]}
                                                min={0}
                                                max={10}
                                                step={1}
                                                onValueChange={([value]) =>
                                                    handleChange(
                                                        "noiseIntensity",
                                                        value / 10
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>
                                                Blur Amount (
                                                {settings.blurAmount.toFixed(1)}
                                                )
                                            </Label>
                                            <Slider
                                                value={[
                                                    settings.blurAmount * 10
                                                ]}
                                                min={0}
                                                max={10}
                                                step={1}
                                                onValueChange={([value]) =>
                                                    handleChange(
                                                        "blurAmount",
                                                        value / 10
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>
                                                Layers ({settings.layers})
                                            </Label>
                                            <Slider
                                                value={[settings.layers]}
                                                min={1}
                                                max={5}
                                                step={1}
                                                onValueChange={([value]) =>
                                                    handleChange(
                                                        "layers",
                                                        value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>

                {/* SVG Code Output */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Code className="w-5 h-5" />
                            SVG Code
                            <div className="ml-auto space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={copyToClipboard}
                                >
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy SVG
                                </Button>
                                <Button variant="outline" onClick={downloadSVG}>
                                    Download SVG
                                </Button>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto">
                            <pre className="font-mono text-sm">
                                <code>{currentSVG}</code>
                            </pre>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Toaster />
        </>
    )
}

export default PatternController
