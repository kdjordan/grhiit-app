import { View, Text, Pressable, ScrollView, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useState, useRef, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import tw from "@/lib/tw";
import { GrhiitMark } from "@/components/GrhiitMark";

// Template types
interface ShareTemplate {
  id: string;
  name: string;
  style: "minimal" | "brutal" | "stats" | "dark";
}

const TEMPLATES: ShareTemplate[] = [
  { id: "minimal", name: "Minimal", style: "minimal" },
  { id: "brutal", name: "Brutal", style: "brutal" },
  { id: "stats", name: "Stats", style: "stats" },
  { id: "dark", name: "Dark", style: "dark" },
];

// Template preview component
function TemplatePreview({
  template,
  data,
  selected,
  onSelect,
}: {
  template: ShareTemplate;
  data: { time: string; brp: string; flsq: string; week: string; day: string };
  selected: boolean;
  onSelect: () => void;
}) {
  const getTemplateStyle = () => {
    switch (template.style) {
      case "minimal":
        return {
          bg: "#000000",
          accent: "#EF4444",
          textPrimary: "#FFFFFF",
          textSecondary: "#6B7280",
        };
      case "brutal":
        return {
          bg: "#0A0A0A",
          accent: "#EF4444",
          textPrimary: "#EF4444",
          textSecondary: "#FFFFFF",
        };
      case "stats":
        return {
          bg: "#1a1a1a",
          accent: "#EF4444",
          textPrimary: "#FFFFFF",
          textSecondary: "#9CA3AF",
        };
      case "dark":
        return {
          bg: "#000000",
          accent: "#FFFFFF",
          textPrimary: "#FFFFFF",
          textSecondary: "#4B5563",
        };
      default:
        return {
          bg: "#000000",
          accent: "#EF4444",
          textPrimary: "#FFFFFF",
          textSecondary: "#6B7280",
        };
    }
  };

  const colors = getTemplateStyle();

  return (
    <Pressable
      onPress={onSelect}
      style={[
        {
          width: 160,
          marginRight: 12,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: selected ? "#EF4444" : "transparent",
          overflow: "hidden",
        },
      ]}
    >
      {/* Template preview */}
      <View
        style={[
          tw`p-4 items-center justify-center`,
          {
            backgroundColor: colors.bg,
            aspectRatio: 9 / 16,
          },
        ]}
      >
        {/* Mini logomark */}
        <View style={tw`mb-3`}>
          <GrhiitMark size={32} color={colors.accent} />
        </View>

        {/* Stats */}
        {template.style === "minimal" && (
          <View style={tw`items-center`}>
            <Text
              style={{
                fontFamily: "SpaceGrotesk_700Bold",
                fontSize: 24,
                color: colors.textPrimary,
              }}
            >
              {data.brp}
            </Text>
            <Text
              style={{
                fontFamily: "SpaceGrotesk_500Medium",
                fontSize: 8,
                color: colors.textSecondary,
                letterSpacing: 1,
              }}
            >
              BURPEES
            </Text>
            <Text
              style={{
                fontFamily: "SpaceGrotesk_700Bold",
                fontSize: 24,
                color: colors.textPrimary,
                marginTop: 8,
              }}
            >
              {data.flsq}
            </Text>
            <Text
              style={{
                fontFamily: "SpaceGrotesk_500Medium",
                fontSize: 8,
                color: colors.textSecondary,
                letterSpacing: 1,
              }}
            >
              FLYING SQUATS
            </Text>
          </View>
        )}

        {template.style === "brutal" && (
          <View style={tw`items-center`}>
            <Text
              style={{
                fontFamily: "ChakraPetch_700Bold",
                fontSize: 28,
                color: colors.textPrimary,
              }}
            >
              {data.brp}
            </Text>
            <Text
              style={{
                fontFamily: "ChakraPetch_700Bold",
                fontSize: 10,
                color: colors.textSecondary,
                letterSpacing: 2,
              }}
            >
              BRP
            </Text>
            <View
              style={{
                width: 40,
                height: 2,
                backgroundColor: colors.accent,
                marginVertical: 8,
              }}
            />
            <Text
              style={{
                fontFamily: "ChakraPetch_700Bold",
                fontSize: 28,
                color: colors.textPrimary,
              }}
            >
              {data.flsq}
            </Text>
            <Text
              style={{
                fontFamily: "ChakraPetch_700Bold",
                fontSize: 10,
                color: colors.textSecondary,
                letterSpacing: 2,
              }}
            >
              FLSQ
            </Text>
          </View>
        )}

        {template.style === "stats" && (
          <View style={tw`items-center`}>
            <Text
              style={{
                fontFamily: "SpaceGrotesk_500Medium",
                fontSize: 8,
                color: colors.textSecondary,
                letterSpacing: 1,
                marginBottom: 4,
              }}
            >
              SESSION COMPLETE
            </Text>
            <Text
              style={{
                fontFamily: "SpaceGrotesk_700Bold",
                fontSize: 18,
                color: colors.textPrimary,
              }}
            >
              {data.brp} BRP • {data.flsq} FLSQ
            </Text>
            <Text
              style={{
                fontFamily: "SpaceGrotesk_500Medium",
                fontSize: 10,
                color: colors.textSecondary,
                marginTop: 4,
              }}
            >
              W{data.week}:D{data.day} • {data.time}
            </Text>
          </View>
        )}

        {template.style === "dark" && (
          <View style={tw`items-center`}>
            <Text
              style={{
                fontFamily: "SpaceGrotesk_700Bold",
                fontSize: 32,
                color: colors.textPrimary,
              }}
            >
              {data.brp}/{data.flsq}
            </Text>
            <Text
              style={{
                fontFamily: "SpaceGrotesk_500Medium",
                fontSize: 8,
                color: colors.textSecondary,
                letterSpacing: 1,
                marginTop: 4,
              }}
            >
              REPS PER INTERVAL
            </Text>
          </View>
        )}

        {/* Week/Day badge */}
        <View
          style={[
            tw`absolute bottom-3 px-2 py-1`,
            { backgroundColor: colors.accent, borderRadius: 4 },
          ]}
        >
          <Text
            style={{
              fontFamily: "SpaceGrotesk_600SemiBold",
              fontSize: 8,
              color: template.style === "dark" ? "#000000" : "#FFFFFF",
              letterSpacing: 1,
            }}
          >
            W{data.week}:D{data.day}
          </Text>
        </View>
      </View>

      {/* Template name */}
      <View style={tw`py-2 px-3 bg-[#1a1a1a]`}>
        <Text
          style={{
            fontFamily: "SpaceGrotesk_500Medium",
            fontSize: 12,
            color: selected ? "#FFFFFF" : "#6B7280",
            textAlign: "center",
          }}
        >
          {template.name}
        </Text>
      </View>
    </Pressable>
  );
}

export default function ShareScreen() {
  const params = useLocalSearchParams<{
    time: string;
    brp: string;
    flsq: string;
    difficulty: string;
  }>();

  const [selectedTemplate, setSelectedTemplate] = useState<string>("minimal");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Get user progress (mock for now - would come from userStore)
  const week = "1";
  const day = "1";

  const shareData = {
    time: params.time || "0:00",
    brp: params.brp || "0",
    flsq: params.flsq || "0",
    week,
    day,
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleShare = (platform: "instagram" | "tiktok" | "x" | "save") => {
    // TODO: Implement actual share functionality
    // For now, just go home
    console.log(`Sharing to ${platform} with template ${selectedTemplate}`);
    router.replace("/(tabs)");
  };

  const handleSkip = () => {
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={tw`flex-1 bg-grhiit-black`}>
      <Animated.View style={[tw`flex-1`, { opacity: fadeAnim }]}>
        {/* Header */}
        <View style={tw`px-5 pt-6 pb-4`}>
          <Text
            style={[
              tw`text-white text-center`,
              { fontFamily: "ChakraPetch_700Bold", fontSize: 24, letterSpacing: 1 },
            ]}
          >
            SHARE YOUR SESSION
          </Text>
          <Text style={tw`text-white/50 text-center text-sm mt-2`}>
            Show the world what you just did
          </Text>
        </View>

        {/* Template selector */}
        <View style={tw`mb-6`}>
          <Text
            style={[
              tw`text-white/40 px-5 mb-3`,
              { fontSize: 11, letterSpacing: 2, fontFamily: "SpaceGrotesk_500Medium" },
            ]}
          >
            CHOOSE A TEMPLATE
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={tw`px-5`}
          >
            {TEMPLATES.map((template) => (
              <TemplatePreview
                key={template.id}
                template={template}
                data={shareData}
                selected={selectedTemplate === template.id}
                onSelect={() => setSelectedTemplate(template.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Share platforms */}
        <View style={tw`px-5 mb-6`}>
          <Text
            style={[
              tw`text-white/40 mb-3`,
              { fontSize: 11, letterSpacing: 2, fontFamily: "SpaceGrotesk_500Medium" },
            ]}
          >
            SHARE TO
          </Text>

          <View style={tw`flex-row gap-3`}>
            {/* Instagram */}
            <Pressable
              style={[
                tw`flex-1 py-4 items-center`,
                {
                  backgroundColor: "#1a1a1a",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#262626",
                },
              ]}
              onPress={() => handleShare("instagram")}
            >
              <Feather name="instagram" size={24} color="#E1306C" />
              <Text
                style={{
                  fontFamily: "SpaceGrotesk_500Medium",
                  fontSize: 11,
                  color: "#FFFFFF",
                  marginTop: 6,
                }}
              >
                Instagram
              </Text>
            </Pressable>

            {/* TikTok */}
            <Pressable
              style={[
                tw`flex-1 py-4 items-center`,
                {
                  backgroundColor: "#1a1a1a",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#262626",
                },
              ]}
              onPress={() => handleShare("tiktok")}
            >
              <Feather name="video" size={24} color="#FFFFFF" />
              <Text
                style={{
                  fontFamily: "SpaceGrotesk_500Medium",
                  fontSize: 11,
                  color: "#FFFFFF",
                  marginTop: 6,
                }}
              >
                TikTok
              </Text>
            </Pressable>

            {/* X/Twitter */}
            <Pressable
              style={[
                tw`flex-1 py-4 items-center`,
                {
                  backgroundColor: "#1a1a1a",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#262626",
                },
              ]}
              onPress={() => handleShare("x")}
            >
              <Feather name="twitter" size={24} color="#1DA1F2" />
              <Text
                style={{
                  fontFamily: "SpaceGrotesk_500Medium",
                  fontSize: 11,
                  color: "#FFFFFF",
                  marginTop: 6,
                }}
              >
                X
              </Text>
            </Pressable>

            {/* Save */}
            <Pressable
              style={[
                tw`flex-1 py-4 items-center`,
                {
                  backgroundColor: "#1a1a1a",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#262626",
                },
              ]}
              onPress={() => handleShare("save")}
            >
              <Feather name="download" size={24} color="#22C55E" />
              <Text
                style={{
                  fontFamily: "SpaceGrotesk_500Medium",
                  fontSize: 11,
                  color: "#FFFFFF",
                  marginTop: 6,
                }}
              >
                Save
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Spacer */}
        <View style={tw`flex-1`} />

        {/* Skip option */}
        <View style={tw`px-5 pb-8`}>
          <Pressable
            style={tw`py-4 items-center`}
            onPress={handleSkip}
          >
            <Text
              style={{
                fontFamily: "SpaceGrotesk_500Medium",
                fontSize: 14,
                color: "#6B7280",
              }}
            >
              Skip for now
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
