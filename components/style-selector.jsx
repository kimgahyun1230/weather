"use client"

import { Card } from "@/components/ui/card"

export function StyleSelector({ styles, selectedStyle, onStyleSelect }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {styles.map((style) => (
          <Card
            key={style.id}
            className={`p-3 cursor-pointer transition-all duration-200 hover:scale-105 ${
              selectedStyle === style.id
                ? "ring-2 ring-primary bg-primary/5 border-primary/20"
                : "hover:border-primary/30"
            }`}
            onClick={() => onStyleSelect(style.id)}
          >
            <div className="text-center space-y-2">
              <div className="text-2xl">{style.icon}</div>
              <div className="font-semibold text-sm">{style.name}</div>
              <div className="text-xs text-muted-foreground text-pretty">{style.description}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
