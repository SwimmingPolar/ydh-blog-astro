import React, { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Copy, Rocket } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const BorderGenerator = () => {
    const [settings, setSettings] = useState({
        width: 12,
        height: 12,
        strokeWidth: 7,
        dashArray: "50%, 13%",
        lineCap: "butt",
        dashOffset: 86,
        borderRadius: 100,
        color: "#EC3463"
    })

    const [cssCode, setCssCode] = useState("")
    const [notification, setNotification] = useState(null)

    const generateSvgUrl = () => {
        const svg = `
      <svg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
        <rect 
          x='${settings.strokeWidth / 2}'
          y='${settings.strokeWidth / 2}'
          width='${100 - settings.strokeWidth}'
          height='${100 - settings.strokeWidth}'
          fill='none'
          rx='${settings.borderRadius}'
          ry='${settings.borderRadius}'
          stroke='${settings.color}'
          stroke-width='${settings.strokeWidth}'
          stroke-dasharray='${settings.dashArray}'
          stroke-dashoffset='${settings.dashOffset}'
          stroke-linecap='${settings.lineCap}'
        />
      </svg>
    `.trim()

        return `data:image/svg+xml,${encodeURIComponent(svg)}`
    }

    useEffect(() => {
        const svgUrl = generateSvgUrl()
        const code = `background-image: url("${svgUrl}");\nbackground-size: 100% 100%;\nbackground-repeat: no-repeat;\nborder-radius: ${settings.borderRadius}px;`
        setCssCode(code)
    }, [settings])

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null)
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [notification])

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(cssCode)
            setNotification({
                type: "success",
                message: "CSS code copied to clipboard!"
            })
        } catch (err) {
            setNotification({
                type: "error",
                message: "Failed to copy CSS code. Please try again."
            })
        }
    }

    const updateSettings = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const generateRandomDash = () => {
        const num1 = Math.floor(Math.random() * 100)
        const num2 = Math.floor(Math.random() * 100)
        updateSettings("dashArray", `${num1}%, ${num2}%`)
    }

    return (
        <div className="p-8 space-y-8 bg-gray-50">
            {notification && (
                <Alert
                    variant={
                        notification.type === "error"
                            ? "destructive"
                            : "default"
                    }
                    className="fixed top-4 right-4 w-auto z-50"
                >
                    <AlertDescription>{notification.message}</AlertDescription>
                </Alert>
            )}

            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold">
                        Customize your CSS Border ??
                    </h1>
                    <p className="text-gray-500">
                        With this tool you can simply increase space between
                        dots, change dash length or distance between strokes.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Preview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div
                            className="h-64 w-full"
                            style={{
                                backgroundImage: `url("${generateSvgUrl()}")`,
                                backgroundSize: "100% 100%",
                                backgroundRepeat: "no-repeat",
                                borderRadius: `${settings.borderRadius}px`
                            }}
                        />
                    </CardContent>
                </Card>

                {/* Controls */}
                <Card>
                    <CardHeader>
                        <CardTitle>Controls</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Width</Label>
                                <Input
                                    type="number"
                                    value={settings.width}
                                    onChange={e =>
                                        updateSettings("width", e.target.value)
                                    }
                                />
                                <span className="text-xs text-gray-500">
                                    Note: It doesn't impact on generated style.
                                </span>
                            </div>
                            <div className="space-y-2">
                                <Label>Height</Label>
                                <Input
                                    type="number"
                                    value={settings.height}
                                    onChange={e =>
                                        updateSettings("height", e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Stroke width: {settings.strokeWidth}</Label>
                            <Slider
                                value={[settings.strokeWidth]}
                                min={1}
                                max={20}
                                step={1}
                                onValueChange={([value]) =>
                                    updateSettings("strokeWidth", value)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label>Dash Array</Label>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={generateRandomDash}
                                >
                                    Random
                                </Button>
                            </div>
                            <div className="flex gap-4">
                                <Input
                                    value={settings.dashArray}
                                    onChange={e =>
                                        updateSettings(
                                            "dashArray",
                                            e.target.value
                                        )
                                    }
                                />
                                <Select
                                    value={settings.lineCap}
                                    onValueChange={value =>
                                        updateSettings("lineCap", value)
                                    }
                                >
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="butt">
                                            butt
                                        </SelectItem>
                                        <SelectItem value="round">
                                            round
                                        </SelectItem>
                                        <SelectItem value="square">
                                            square
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <span className="text-xs text-gray-500">
                                It's a sequence of visible/invisible intervals.
                            </span>
                        </div>

                        <div className="space-y-2">
                            <Label>Dash offset: {settings.dashOffset}</Label>
                            <Slider
                                value={[settings.dashOffset]}
                                min={0}
                                max={100}
                                step={1}
                                onValueChange={([value]) =>
                                    updateSettings("dashOffset", value)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>
                                Border radius: {settings.borderRadius}
                            </Label>
                            <Slider
                                value={[settings.borderRadius]}
                                min={0}
                                max={100}
                                step={1}
                                onValueChange={([value]) =>
                                    updateSettings("borderRadius", value)
                                }
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Border Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    type="color"
                                    value={settings.color}
                                    onChange={e =>
                                        updateSettings("color", e.target.value)
                                    }
                                    className="w-full h-10"
                                />
                                <Input
                                    type="text"
                                    value={settings.color}
                                    onChange={e =>
                                        updateSettings("color", e.target.value)
                                    }
                                    className="font-mono"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* CSS Code Output */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>Generated CSS</span>
                        <Button variant="outline" onClick={handleCopy}>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy CSS
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto">
                        <pre className="font-mono text-sm whitespace-pre-wrap">
                            {cssCode}
                        </pre>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default BorderGenerator
