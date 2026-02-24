import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "@/components/Header";
import { BANNERS, dummyProducts } from "@/assets/assets";
import { useRouter } from "expo-router";
import { CATEGORIES } from "@/constants";
import CategoryItem from "@/components/CategoryItem";
import { Product } from "@/constants/types";
import ProductCard from "@/components/ProductCard";

const { width } = Dimensions.get("window");

export default function Home() {
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const categories = [{ id: "all", name: "all", icon: "grid" }, ...CATEGORIES];
  const router = useRouter();

  const fetchProduct = async () => {
    setProducts(dummyProducts);
    setLoading(false);
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <SafeAreaView className="flex-1" edges={["top"]}>
      <Header title="Forever" showMenu showCart showLogo />

      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <View className="mb-6">
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
                <View className="absolute inset-0 bg-black/40" />

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
        </View>

        {/* categories */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-primary">Categories</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((cat: any) => (
              <CategoryItem
                key={cat.id}
                item={cat}
                isSelected={false}
                onPress={() =>
                  router.push({
                    pathname: "/shop",
                    params: {
                      category: cat.id === "all" ? "" : cat.name,
                    },
                  })
                }
              />
            ))}
          </ScrollView>
        </View>

        {/* popular products */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-primary">Popular</Text>
            <TouchableOpacity onPress={() => router.push("/shop")}>
              <Text className="text-secondary text-sm">See All</Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator size={"large"} />
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </View>
          )}
        </View>

        {/* News letter CTA */}
        <View className="bg-gray-100 px-6 py-8 rounded-2xl mb-20 items-center ">
          <Text className="text-2xl font-bold text-center mb-2 text-gray-900">
            Join the Revolution
          </Text>

          <Text className="text-center mb-6 text-gray-600 leading-5">
            Subscribe to our newsletter and get 10% off your first purchase.
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            className="bg-primary w-4/5 py-3 rounded-full items-center"
          >
            <Text className="text-white font-semibold text-base">
              Subscribe Now
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
