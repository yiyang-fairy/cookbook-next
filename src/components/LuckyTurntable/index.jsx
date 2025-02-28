import React, { useState, useRef } from 'react'
import { LuckyWheel } from '@lucky-canvas/react'

export default function App ({ prizes, onEnd, onStart }) {
  const [blocks] = useState([
    { padding: '13px', background: '#ff6b6b' }
  ])

  const [buttons] = useState([
    { radius: '30%', background: 'pink' },
    { radius: '25%', background: '#ef6a95' },
    {
      radius: '20%', background: '#ff6b6b',
      pointer: true,
      fonts: [{ text: '开始', top: '-10px', fontColor: '#fff' }]
    }
  ])
  const myLucky = useRef()

  const colors = [
    '#FFE4E1', // Misty Rose
    '#E0FFFF', // Light Cyan
    '#F0FFF0', // Honeydew
    '#FFF0F5', // Lavender Blush
    '#F0FFFF', // Azure
    '#FFF5EE', // Seashell
    '#F5FFFA', // Mint Cream
    '#FFE4B5', // Moccasin
    '#F0F8FF', // Alice Blue
    '#FAFAD2', // Light Goldenrod Yellow
    '#E6E6FA', // Lavender
    '#F8F8FF', // Ghost White
    '#FFF5E6', // Warm Ivory
    '#E8F5E9', // Mint Light
    '#FCE4EC', // Pink Light
    '#F3E5F5', // Purple Light
    '#E3F2FD', // Blue Light
    '#FFFDE7', // Yellow Light
    '#FBE9E7', // Deep Orange Light
    '#EFEBE9'  // Brown Light
  ]

  const formatPrize = (prize) => {
    const data = prize.map((item, index) => {
      return {
        background: colors[index],
        fonts: [{ text: item.name, fontColor: 'red' }]
      }
    })
    return data
  }
  return <div>
    <LuckyWheel
      ref={myLucky}
      width="300px"
      height="300px"
      blocks={blocks}
      prizes={formatPrize(prizes)}
      buttons={buttons}
      onStart={() => {
        onStart()
        myLucky.current.play()
        setTimeout(() => {
          const index = Math.floor(Math.random() * prizes.length)
          myLucky.current.stop(index)
        }, 2500)
      }}
      onEnd={prize => {
        onEnd(prize)
      }}
    />
  </div>
}