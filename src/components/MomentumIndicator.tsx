import { View, Text } from "react-native";
import tw from "@/lib/tw";

interface MomentumIndicatorProps {
  percentage: number; // 0-100
}

export function MomentumIndicator({ percentage }: MomentumIndicatorProps) {
  const isLow = percentage < 50;
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  return (
    <View style={tw`bg-[#141414] rounded-xl p-4 border ${isLow ? "border-warning" : "border-[#262626]"}`}>
      <View style={tw`flex-row justify-between items-center mb-2`}>
        <View style={tw`flex-row items-center`}>
          <Text style={tw`text-white/60 text-xs tracking-wide`}>MOMENTUM</Text>
          {isLow && (
            <Text style={tw`text-warning text-xs ml-2`}>⚠️ LOW</Text>
          )}
        </View>
        <Text style={tw`${isLow ? "text-warning" : "text-white"} font-bold`}>
          {Math.round(clampedPercentage)}%
        </Text>
      </View>
      <View style={tw`h-2 bg-[#262626] rounded-full overflow-hidden`}>
        <View
          style={[
            tw`h-full rounded-full ${isLow ? "bg-warning" : "bg-grhiit-red"}`,
            { width: `${clampedPercentage}%` },
          ]}
        />
      </View>
      <Text style={tw`text-white/30 text-xs mt-2`}>
        +30% per workout • -50% per miss
      </Text>
    </View>
  );
}
