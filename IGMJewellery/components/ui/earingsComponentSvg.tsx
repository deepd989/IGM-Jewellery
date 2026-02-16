import React from "react";
import { View } from "react-native";
import Svg, { Circle, Ellipse, Path } from "react-native-svg";

export default function EarringIcon({
  width = 32,
  height = 64,
  color = "#053844",
}) {
  return (
    <View style={{ flexDirection: "row" }}>
      <Svg width={width} height={height} viewBox="0 0 120 240" fill="none">
        {/* Hook */}
        <Path
          d="M30 20 L50 10"
          stroke={color}
          strokeWidth={12}
          strokeLinecap="round"
        />

        {/* Ring */}
        <Circle
          cx="30"
          cy="50"
          r="15"
          stroke={color}
          strokeWidth={12}
          fill="none"
        />

        {/* Tear drop */}
        <Path
          d="M30 70 C0 130 0 190 30 210 C60 190 60 130 30 70Z"
          fill={color}
        />

        {/* Bottom oval */}
        <Ellipse cx="30" cy="225" rx="12" ry="6" fill={color} />

        <Path
          d="M110 20 L130 10"
          stroke={color}
          strokeWidth={12}
          strokeLinecap="round"
        />

        {/* Ring */}
        <Circle
          cx="110"
          cy="50"
          r="15"
          stroke={color}
          strokeWidth={12}
          fill="none"
        />

        {/* Tear drop */}
        <Path
          d="M110 70 C80 130 80 190 110 210 C140 190 140 130 110 70Z"
          fill={color}
        />

        {/* Bottom oval */}
        <Ellipse cx="110" cy="225" rx="12" ry="6" fill={color} />
      </Svg>
    </View>
  );
}
