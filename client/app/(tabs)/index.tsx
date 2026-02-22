import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { BANNERS } from "@/assets/assets";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function Home() {
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <Header title="Forever" showMenu showCart showLogo />

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        {/* banner slider */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          className="w-full h-48 rounded-xl"
          scrollEventThrottle={16}
          onScroll={(e) => {
            const slide = Math.ceil(
              e.nativeEvent.contentOffset.x /
                e.nativeEvent.layoutMeasurement.width,
            );
            if (slide !== activeBannerIndex) {
              setActiveBannerIndex(slide);
            }
          }}
        >
          {BANNERS.map(({ id, image, title, subtitle }, index) => (
            <View
              key={id ?? index}
              className="relative w-full h-48 bg-gray-200 overflow-hidden"
              style={{ width: width - 32 }}
            >
              <Image
                source={{ uri: image }}
                className="w-full h-full"
                resizeMode="cover"
              />

              <View className="absolute bottom-4 left-4 z-10">
                <Text className="text-white text-2xl font-bold">{title}</Text>
                <Text className="text-white text-sm font-medium">
                  {subtitle}
                </Text>
                <TouchableOpacity className="mt-2 bg-white px-4 py-2 rounded-full self-start">
                  <Text className="text-primary font-bold text-xs">
                    GET NOW
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="absolute inset-0 bg-black/40" />
            </View>
          ))}
        </ScrollView>
        {/* pagination dots */}
        <View className="flex-row justify-center mt-3 gap-2">
          {BANNERS.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full ${index === activeBannerIndex ? "w-6 bg-primary" : "w-2 bg-gray-300"}`}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
