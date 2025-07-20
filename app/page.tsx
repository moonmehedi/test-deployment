"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, Calculator, Users, Home, IndianRupee, Sparkles } from "lucide-react"

interface FamilyMember {
  id: string
  name: string
  relation: string
  gender: string
  isAlive: boolean
}

interface InheritanceResult {
  member: FamilyMember
  share: number
  percentage: number
}

export default function HinduInheritanceCalculator() {
  const [propertyValue, setPropertyValue] = useState("")
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [results, setResults] = useState<InheritanceResult[]>([])
  const [currentStep, setCurrentStep] = useState(1)

  const addFamilyMember = () => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: "",
      relation: "",
      gender: "",
      isAlive: true,
    }
    setFamilyMembers([...familyMembers, newMember])
  }

  const removeFamilyMember = (id: string) => {
    setFamilyMembers(familyMembers.filter((member) => member.id !== id))
  }

  const updateFamilyMember = (id: string, field: keyof FamilyMember, value: any) => {
    setFamilyMembers(familyMembers.map((member) => (member.id === id ? { ...member, [field]: value } : member)))
  }

  const calculateInheritance = () => {
    if (!propertyValue || familyMembers.length === 0) return

    const totalValue = Number.parseFloat(propertyValue)
    const aliveMembers = familyMembers.filter((member) => member.isAlive)

    // Simplified Hindu inheritance calculation
    const sons = aliveMembers.filter((m) => m.relation === "son")
    const daughters = aliveMembers.filter((m) => m.relation === "daughter")
    const widow = aliveMembers.find((m) => m.relation === "widow")

    let totalShares = 0
    const shareMap = new Map<string, number>()

    // Sons get equal shares
    sons.forEach((son) => {
      shareMap.set(son.id, 1)
      totalShares += 1
    })

    // Daughters get equal shares (same as sons under Hindu Succession Act 2005)
    daughters.forEach((daughter) => {
      shareMap.set(daughter.id, 1)
      totalShares += 1
    })

    // Widow gets equal share
    if (widow) {
      shareMap.set(widow.id, 1)
      totalShares += 1
    }

    // Other relatives get proportional shares
    const others = aliveMembers.filter((m) => !["son", "daughter", "widow"].includes(m.relation))
    others.forEach((other) => {
      const share = 0.5 // Reduced share for other relatives
      shareMap.set(other.id, share)
      totalShares += share
    })

    const calculatedResults: InheritanceResult[] = aliveMembers.map((member) => {
      const share = shareMap.get(member.id) || 0
      const amount = (share / totalShares) * totalValue
      const percentage = (share / totalShares) * 100

      return {
        member,
        share: amount,
        percentage,
      }
    })

    setResults(calculatedResults)
    setCurrentStep(3)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-medium">Hindu Inheritance Calculator</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
            Property Distribution
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Calculate fair inheritance distribution according to Hindu Succession Act
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                    currentStep >= step
                      ? "bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-lg"
                      : "bg-white/20 text-white/60"
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 rounded transition-all duration-300 ${
                      currentStep > step ? "bg-gradient-to-r from-yellow-400 to-orange-400" : "bg-white/20"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Property Value Card */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Home className="w-5 h-5 text-yellow-300" />
                  Property Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Label htmlFor="property-value" className="text-white/90 font-medium">
                    Total Property Value
                  </Label>
                  <div className="relative mt-2">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-300" />
                    <Input
                      id="property-value"
                      type="number"
                      placeholder="Enter property value"
                      value={propertyValue}
                      onChange={(e) => setPropertyValue(e.target.value)}
                      className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-yellow-300 focus:ring-yellow-300/20 h-12 text-lg"
                    />
                  </div>
                </div>
                {propertyValue && (
                  <div className="bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-lg p-3">
                    <p className="text-white font-medium">
                      Property Value: ₹{Number.parseFloat(propertyValue).toLocaleString("en-IN")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Family Members Card */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Users className="w-5 h-5 text-blue-300" />
                    Family Members
                  </CardTitle>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {familyMembers.length} members
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {familyMembers.map((member, index) => (
                  <div key={member.id} className="bg-white/10 rounded-lg p-4 space-y-3 border border-white/20">
                    <div className="flex items-center justify-between">
                      <span className="text-white/90 font-medium">Member {index + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFamilyMember(member.id)}
                        className="text-red-300 hover:text-red-200 hover:bg-red-500/20"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-white/90 text-sm">Name</Label>
                        <Input
                          placeholder="Enter name"
                          value={member.name}
                          onChange={(e) => updateFamilyMember(member.id, "name", e.target.value)}
                          className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-blue-300 mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-white/90 text-sm">Relation</Label>
                        <Select
                          value={member.relation}
                          onValueChange={(value) => updateFamilyMember(member.id, "relation", value)}
                        >
                          <SelectTrigger className="bg-white/20 border-white/30 text-white focus:border-blue-300 mt-1">
                            <SelectValue placeholder="Select relation" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="son">Son</SelectItem>
                            <SelectItem value="daughter">Daughter</SelectItem>
                            <SelectItem value="widow">Widow</SelectItem>
                            <SelectItem value="mother">Mother</SelectItem>
                            <SelectItem value="father">Father</SelectItem>
                            <SelectItem value="brother">Brother</SelectItem>
                            <SelectItem value="sister">Sister</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  onClick={addFamilyMember}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium h-12"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Family Member
                </Button>
              </CardContent>
            </Card>

            {/* Calculate Button */}
            <Button
              onClick={calculateInheritance}
              disabled={!propertyValue || familyMembers.length === 0}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold text-lg h-14 shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Calculate Inheritance
            </Button>
          </div>

          {/* Results Section */}
          <div>
            <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl h-fit">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-green-300" />
                  Inheritance Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                {results.length > 0 ? (
                  <div className="space-y-4">
                    {results.map((result, index) => (
                      <div
                        key={result.member.id}
                        className="bg-gradient-to-r from-white/10 to-white/5 rounded-lg p-4 border border-white/20"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="text-white font-semibold text-lg">
                              {result.member.name || `Member ${index + 1}`}
                            </h3>
                            <p className="text-white/70 capitalize">{result.member.relation}</p>
                          </div>
                          <Badge className="bg-gradient-to-r from-green-400 to-blue-400 text-white">
                            {result.percentage.toFixed(1)}%
                          </Badge>
                        </div>

                        <div className="bg-white/10 rounded p-3">
                          <p className="text-white font-bold text-xl">
                            ₹{result.share.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                          </p>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-3 bg-white/20 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-1000"
                            style={{ width: `${result.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}

                    <Separator className="bg-white/20" />

                    <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg p-4">
                      <h3 className="text-white font-bold text-lg mb-2">Summary</h3>
                      <p className="text-white/90">
                        Total Property: ₹{Number.parseFloat(propertyValue).toLocaleString("en-IN")}
                      </p>
                      <p className="text-white/90">Total Beneficiaries: {results.length}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calculator className="w-16 h-16 text-white/40 mx-auto mb-4" />
                    <p className="text-white/60 text-lg">
                      Enter property details and family members to calculate inheritance
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
