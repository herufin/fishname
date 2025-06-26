"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Plus, Play, RotateCcw } from "lucide-react"
import { css } from "@emotion/react"

interface Fisher {
  id: string
  name: string
  position: number
  isCasting: boolean
  hasFish: boolean
}

export default function FishingRandomizer() {
  const [names, setNames] = useState<string[]>([])
  const [inputName, setInputName] = useState("")
  const [fishers, setFishers] = useState<Fisher[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [winner, setWinner] = useState<string>("")
  const [showResult, setShowResult] = useState(false)
  const [bulkInput, setBulkInput] = useState("")
  const [showBulkInput, setShowBulkInput] = useState(false)
  const [castingPhase, setCastingPhase] = useState<"ready" | "throwing" | "waiting" | "catching">("ready")
  const [winnerFish, setWinnerFish] = useState<string>("")

  const fishTypes = [
    { emoji: "🐟", name: "Ikan Mas", rarity: "Biasa" },
    { emoji: "🐠", name: "Ikan Tropis", rarity: "Langka" },
    { emoji: "🐡", name: "Ikan Buntal", rarity: "Langka" },
    { emoji: "🦈", name: "Hiu Kecil", rarity: "Sangat Langka" },
    { emoji: "🐙", name: "Gurita", rarity: "Sangat Langka" },
    { emoji: "🦞", name: "Lobster", rarity: "Legendaris" },
    { emoji: "🐋", name: "Paus Mini", rarity: "Legendaris" },
    { emoji: "🏆", name: "Ikan Emas", rarity: "Mitos" },
  ]

  // Update fishers when names change
  useEffect(() => {
    const newFishers = names.map((name, index) => ({
      id: `fisher-${index}`,
      name,
      position: index,
      isCasting: false,
      hasFish: false,
    }))
    setFishers(newFishers)
  }, [names])

  const addName = () => {
    if (inputName.trim() && !names.includes(inputName.trim())) {
      setNames([...names, inputName.trim()])
      setInputName("")
    }
  }

  const addBulkNames = () => {
    if (!bulkInput.trim()) return

    // Split by comma or newline and clean up
    const newNames = bulkInput
      .split(/[,\n]/)
      .map((name) => name.trim())
      .filter((name) => name.length > 0)
      .filter((name) => !names.includes(name)) // Remove duplicates

    if (newNames.length > 0) {
      setNames([...names, ...newNames])
      setBulkInput("")
      setShowBulkInput(false)
    }
  }

  const removeName = (nameToRemove: string) => {
    setNames(names.filter((name) => name !== nameToRemove))
  }

  const startFishing = async () => {
    if (names.length < 2) return

    setIsAnimating(true)
    setShowResult(false)
    setWinner("")
    setWinnerFish("")
    setCastingPhase("throwing")

    // Phase 1: Throwing animation
    setFishers((prev) => prev.map((fisher) => ({ ...fisher, isCasting: false, hasFish: false })))
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Phase 2: Casting lines
    setCastingPhase("waiting")
    setFishers((prev) => prev.map((fisher) => ({ ...fisher, isCasting: true, hasFish: false })))
    await new Promise((resolve) => setTimeout(resolve, 2500))

    // Phase 3: Catching
    setCastingPhase("catching")
    const randomIndex = Math.floor(Math.random() * names.length)
    const winnerName = names[randomIndex]
    const randomFish = fishTypes[Math.floor(Math.random() * fishTypes.length)]

    setWinner(winnerName)
    setWinnerFish(randomFish.emoji)

    // Show fish for winner
    setFishers((prev) =>
      prev.map((fisher) => ({
        ...fisher,
        isCasting: false,
        hasFish: fisher.name === winnerName,
      })),
    )

    await new Promise((resolve) => setTimeout(resolve, 500))
    setShowResult(true)
    setIsAnimating(false)
    setCastingPhase("ready")
  }

  const reset = () => {
    setFishers((prev) => prev.map((fisher) => ({ ...fisher, isCasting: false, hasFish: false })))
    setWinner("")
    setShowResult(false)
    setIsAnimating(false)
  }

  const removeWinner = () => {
    if (winner) {
      setNames(names.filter((name) => name !== winner))
      reset()
    }
  }

  const getFisherPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2
    const radius = total > 30 ? 220 : total > 15 ? 200 : 180
    const x = Math.cos(angle) * radius
    const y = Math.sin(angle) * radius
    return { x, y, angle: angle + Math.PI / 2 }
  }

  const fadeInAnimation = css`
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .animate-fadeIn {
      animation: fadeIn 0.5s ease-in-out;
    }
  `

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 via-sky-100 to-green-100 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6 shadow-lg border-2 border-blue-200">
          <CardHeader className="text-center bg-gradient-to-r from-blue-400 to-teal-400 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold flex items-center justify-center gap-2">
              🎣 Pengacak Nama Memancing 🐟
            </CardTitle>
            <p className="text-blue-100">Masukkan nama-nama dan lihat siapa yang beruntung mendapat ikan!</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-4">
              <div className="flex gap-2 mb-2">
                <Button
                  onClick={() => setShowBulkInput(!showBulkInput)}
                  variant="outline"
                  className="border-blue-300 text-blue-600 hover:bg-blue-50"
                >
                  {showBulkInput ? "Input Satu-satu" : "Input Banyak Sekaligus"}
                </Button>
              </div>

              {showBulkInput ? (
                <div className="space-y-2">
                  <textarea
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    placeholder="Masukkan nama-nama (pisahkan dengan koma atau enter)\nContoh:\nAndi, Budi, Citra\natau\nAndi\nBudi\nCitra"
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <Button onClick={addBulkNames} className="bg-blue-500 hover:bg-blue-600 w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah Semua Nama
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    placeholder="Masukkan nama..."
                    onKeyPress={(e) => e.key === "Enter" && addName()}
                    className="flex-1"
                  />
                  <Button onClick={addName} className="bg-blue-500 hover:bg-blue-600">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {names.map((name) => (
                <div
                  key={name}
                  className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  <span>{name}</span>
                  <button onClick={() => removeName(name)} className="text-blue-600 hover:text-red-600 ml-1">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 justify-center">
              <Button
                onClick={startFishing}
                disabled={names.length < 2 || isAnimating}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2"
              >
                <Play className="w-4 h-4 mr-2" />
                {isAnimating ? "Memancing..." : "Mulai Memancing!"}
              </Button>
              <Button onClick={reset} variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Fishing Pond */}
        <div className="relative">
          <Card className="p-8 bg-gradient-to-br from-blue-50 to-teal-50 border-2 border-blue-200 shadow-lg">
            <div className="relative w-full h-[600px] flex items-center justify-center">
              {/* Pond */}
              <div className="absolute w-96 h-96 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full shadow-inner border-4 border-blue-300">
                <div className="absolute inset-6 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full opacity-70"></div>
                <div className="absolute inset-12 bg-gradient-to-br from-blue-200 to-blue-400 rounded-full opacity-50"></div>
                {/* Water ripples */}
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white opacity-20 rounded-full animate-ping"></div>
                  <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white opacity-30 rounded-full animate-pulse"></div>
                  <div
                    className="absolute bottom-1/3 right-1/3 transform translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white opacity-25 rounded-full animate-ping"
                    style={{ animationDelay: "1s" }}
                  ></div>
                </div>
              </div>

              {/* Fishers */}
              {fishers.map((fisher, index) => {
                const pos = getFisherPosition(index, fishers.length)
                return (
                  <div
                    key={fisher.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                    style={{
                      left: `calc(50% + ${pos.x}px)`,
                      top: `calc(50% + ${pos.y}px)`,
                      transform: `translate(-50%, -50%) rotate(${pos.angle}rad)`,
                    }}
                  >
                    {/* Fisher character */}
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`mb-1 transition-all duration-500 ${
                          fishers.length > 30 ? "text-xl" : fishers.length > 15 ? "text-2xl" : "text-3xl"
                        } ${castingPhase === "throwing" ? "animate-pulse transform scale-110" : "animate-bounce"}`}
                        style={{
                          animationDelay: `${index * 0.1}s`,
                          transform: castingPhase === "throwing" ? "rotate(-10deg)" : "rotate(0deg)",
                        }}
                      >
                        🤠
                      </div>

                      {/* Fishing rod */}
                      <div className="relative">
                        <div
                          className={`bg-amber-600 rounded-full transition-all duration-500 ${
                            fishers.length > 30 ? "w-0.5 h-6" : "w-1 h-8"
                          } ${castingPhase === "throwing" ? "transform rotate-45" : ""}`}
                        ></div>

                        {/* Fishing line with enhanced animation */}
                        <div
                          className={`absolute left-1/2 w-0.5 bg-gray-400 origin-top transition-all duration-1000 ${
                            fishers.length > 30 ? "top-6" : "top-8"
                          } ${
                            fisher.isCasting
                              ? fishers.length > 30
                                ? "h-16 transform rotate-12"
                                : "h-20 transform rotate-12"
                              : "h-4"
                          }`}
                          style={{
                            transformOrigin: "top center",
                            animationDelay: `${index * 0.1}s`,
                          }}
                        ></div>

                        {/* Splash effect when line hits water */}
                        {fisher.isCasting && (
                          <div
                            className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
                              fishers.length > 30 ? "top-20" : "top-24"
                            }`}
                          >
                            <div className="text-blue-400 animate-ping">💧</div>
                          </div>
                        )}

                        {/* Hook/Fish */}
                        <div
                          className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-1000 ${
                            fisher.isCasting
                              ? fishers.length > 30
                                ? "top-22"
                                : "top-28"
                              : fishers.length > 30
                                ? "top-10"
                                : "top-12"
                          }`}
                        >
                          {fisher.hasFish ? (
                            <div className={`animate-bounce ${fishers.length > 30 ? "text-lg" : "text-2xl"}`}>
                              {fisher.name === winner ? winnerFish : "🐟"}
                            </div>
                          ) : (
                            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                          )}
                        </div>
                      </div>

                      {/* Name label */}
                      <div
                        className={`mt-2 px-2 py-1 rounded-full font-medium transition-all duration-300 ${
                          fishers.length > 30 ? "text-xs" : "text-sm"
                        } ${
                          fisher.hasFish
                            ? "bg-yellow-200 text-yellow-800 border-2 border-yellow-400 animate-pulse"
                            : "bg-white text-gray-700 border border-gray-300"
                        }`}
                        style={{ transform: `rotate(${-pos.angle}rad)` }}
                      >
                        {fishers.length > 50
                          ? fisher.name.substring(0, 8) + (fisher.name.length > 8 ? "..." : "")
                          : fisher.name}
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Center pond decoration */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl opacity-20">
                🌊
              </div>
            </div>
          </Card>

          {/* Enhanced Result Display */}
          {showResult && winner && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="max-w-md w-full mx-4 bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 border-4 border-yellow-400 shadow-2xl">
                <CardContent className="p-8 text-center">
                  {/* Fireworks effect */}
                  <div className="absolute -top-4 -left-4 text-4xl animate-spin">🎆</div>
                  <div className="absolute -top-4 -right-4 text-4xl animate-spin" style={{ animationDelay: "0.5s" }}>
                    🎇
                  </div>
                  <div className="absolute -bottom-4 -left-4 text-4xl animate-spin" style={{ animationDelay: "1s" }}>
                    ✨
                  </div>
                  <div className="absolute -bottom-4 -right-4 text-4xl animate-spin" style={{ animationDelay: "1.5s" }}>
                    🌟
                  </div>

                  {/* Main celebration */}
                  <div className="text-8xl mb-6 animate-pulse">{winnerFish}</div>
                  <div className="text-6xl mb-4 animate-bounce">🎉</div>

                  <h2 className="text-4xl font-bold text-orange-800 mb-4 animate-pulse">SELAMAT!</h2>

                  <div className="bg-white bg-opacity-80 rounded-lg p-4 mb-4 border-2 border-yellow-300">
                    <p className="text-2xl text-orange-700 mb-2">
                      <span className="font-bold text-3xl text-red-600">{winner}</span>
                    </p>
                    <p className="text-lg text-orange-600">berhasil menangkap</p>
                    <p className="text-xl font-bold text-blue-600">
                      {fishTypes.find((f) => f.emoji === winnerFish)?.name || "Ikan Spesial"}
                    </p>
                    <p className="text-sm text-purple-600 font-medium">
                      ({fishTypes.find((f) => f.emoji === winnerFish)?.rarity || "Langka"})
                    </p>
                  </div>

                  <div className="text-6xl mb-6 animate-bounce">🏆</div>

                  <div className="flex gap-3 justify-center">
                    <Button onClick={removeWinner} className="bg-red-500 hover:bg-red-600 text-white text-lg px-6 py-3">
                      <Trash2 className="w-5 h-5 mr-2" />
                      Hapus Pemenang
                    </Button>
                    <Button onClick={reset} className="bg-blue-500 hover:bg-blue-600 text-white text-lg px-6 py-3">
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Main Lagi
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Instructions */}
          {names.length === 0 && (
            <Card className="mt-6 p-4 bg-blue-50 border border-blue-200">
              <p className="text-center text-blue-600 mb-2">
                👆 Mulai dengan menambahkan nama-nama di atas, lalu tekan "Mulai Memancing!" untuk melihat siapa yang
                beruntung! 🎣
              </p>
              <p className="text-center text-blue-500 text-sm">
                💡 Tips: Gunakan "Input Banyak Sekaligus" untuk menambahkan banyak nama dengan cepat!
              </p>
            </Card>
          )}

          {names.length === 1 && (
            <Card className="mt-6 p-4 bg-orange-50 border border-orange-200">
              <p className="text-center text-orange-600">🎣 Tambahkan minimal 2 nama untuk mulai memancing!</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
