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
import { RotateCcw, Save, Trash2 } from "lucide-react"
import { useState } from "react"
import type { PatternSettings, CustomPresets } from "./types"

interface ControllerProps {
    settings: PatternSettings
    onSettingsChange: (settings: PatternSettings) => void
    onReset: () => void
}

const builtInPresets = {
    subtle: {
        stripeWidth: 6,
        patternSize: 12,
        noiseIntensity: 0.3,
        blurAmount: 0.7,
        wiggleIntensity: 0.8,
        layers: 2,
        animationSpeed: 4
    },
    dynamic: {
        stripeWidth: 8,
        patternSize: 16,
        noiseIntensity: 0.5,
        blurAmount: 0.4,
        wiggleIntensity: 1.2,
        layers: 3,
        animationSpeed: 3
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
        animationSpeed: 4
    }
} as const

const Controller = ({
    settings,
    onSettingsChange,
    onReset
}: ControllerProps) => {
    const [activePreset, setActivePreset] = useState<string | null>(null)
    const [customPresets, setCustomPresets] = useState<CustomPresets>({})
    const [newPresetName, setNewPresetName] = useState("")
    const [showPresetDialog, setShowPresetDialog] = useState(false)

    const handleChange = (key: keyof PatternSettings, value: any) => {
        setActivePreset(null)
        onSettingsChange({ ...settings, [key]: value })
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
        }
    }

    const applyPreset = (presetName: string, isCustom = false) => {
        setActivePreset(presetName)
        const presetSettings = isCustom
            ? customPresets[presetName]
            : builtInPresets[presetName as keyof typeof builtInPresets]
        onSettingsChange({ ...settings, ...presetSettings })
    }

    const deleteCustomPreset = () => {
        if (activePreset && customPresets[activePreset]) {
            const { [activePreset]: _, ...rest } = customPresets
            setCustomPresets(rest)
            setActivePreset(null)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pattern Controls</CardTitle>
                <div className="relative mt-4">
                    <div className="flex gap-2 flex-wrap pr-32">
                        {Object.keys(builtInPresets).map(presetName => (
                            <Button
                                key={presetName}
                                variant={
                                    activePreset === presetName
                                        ? "default"
                                        : "outline"
                                }
                                onClick={() => applyPreset(presetName)}
                            >
                                {presetName}
                            </Button>
                        ))}

                        {Object.keys(customPresets).map(presetName => (
                            <Button
                                key={presetName}
                                variant={
                                    activePreset === presetName
                                        ? "default"
                                        : "outline"
                                }
                                onClick={() => applyPreset(presetName, true)}
                            >
                                {presetName}
                            </Button>
                        ))}
                    </div>

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
                                            setNewPresetName(e.target.value)
                                        }
                                    />
                                    <Button onClick={saveCustomPreset}>
                                        Save
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                            onClick={onReset}
                        >
                            <RotateCcw className="w-4 h-4" />
                        </Button>

                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9"
                            onClick={deleteCustomPreset}
                            disabled={
                                !activePreset || !customPresets[activePreset]
                            }
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="dimensions" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="dimensions">Size</TabsTrigger>
                        <TabsTrigger value="appearance">Color</TabsTrigger>
                        <TabsTrigger value="movement">Motion</TabsTrigger>
                        <TabsTrigger value="advanced">Advanced</TabsTrigger>
                    </TabsList>

                    <TabsContent value="dimensions" className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Direction</Label>
                                <Select
                                    value={settings.direction}
                                    onValueChange={value =>
                                        handleChange("direction", value)
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
                                    Stripe Width ({settings.stripeWidth}px)
                                </Label>
                                <Slider
                                    value={[settings.stripeWidth]}
                                    min={2}
                                    max={20}
                                    step={1}
                                    onValueChange={([value]) =>
                                        handleChange("stripeWidth", value)
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>
                                    Pattern Size ({settings.patternSize}px)
                                </Label>
                                <Slider
                                    value={[settings.patternSize]}
                                    min={4}
                                    max={40}
                                    step={2}
                                    onValueChange={([value]) =>
                                        handleChange("patternSize", value)
                                    }
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="appearance" className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Primary Color</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="color"
                                        value={settings.primaryColor}
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
                                        value={settings.primaryColor}
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
                                        value={settings.secondaryColor}
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
                                        value={settings.secondaryColor}
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

                    <TabsContent value="movement" className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>
                                    Wiggle Intensity (
                                    {settings.wiggleIntensity.toFixed(1)})
                                </Label>
                                <Slider
                                    value={[settings.wiggleIntensity * 10]}
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
                                    Animation Speed ({settings.animationSpeed}s)
                                </Label>
                                <Slider
                                    value={[settings.animationSpeed]}
                                    min={1}
                                    max={10}
                                    step={1}
                                    onValueChange={([value]) =>
                                        handleChange("animationSpeed", value)
                                    }
                                />
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="advanced" className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>
                                    Noise Intensity (
                                    {settings.noiseIntensity.toFixed(1)})
                                </Label>
                                <Slider
                                    value={[settings.noiseIntensity * 10]}
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
                                    {settings.blurAmount.toFixed(1)})
                                </Label>
                                <Slider
                                    value={[settings.blurAmount * 10]}
                                    min={0}
                                    max={10}
                                    step={1}
                                    onValueChange={([value]) =>
                                        handleChange("blurAmount", value / 10)
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Layers ({settings.layers})</Label>
                                <Slider
                                    value={[settings.layers]}
                                    min={1}
                                    max={5}
                                    step={1}
                                    onValueChange={([value]) =>
                                        handleChange("layers", value)
                                    }
                                />
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

export default Controller
