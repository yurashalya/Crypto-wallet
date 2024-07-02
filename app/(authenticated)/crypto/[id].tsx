import {
  View,
  Text,
  ScrollView,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import { useRef, useState, useEffect } from "react";
import { format } from "date-fns";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { CartesianChart, Line, useChartPressState } from "victory-native";

import { useGetCoinDetailsQuery } from "@/queries/useGetCoinDetailsQuery";
import { useGetCoinTickersQuery } from "@/queries/useGetCoinTickersQuery";

import { Stack, useLocalSearchParams } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";
import { Circle, useFont } from "@shopify/react-native-skia";
import Animated, {
  SharedValue,
  useAnimatedProps,
} from "react-native-reanimated";

import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { Categories } from "@/constants/Keys";

Animated.addWhitelistedNativeProps({ text: true });
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

function ToolTip({ x, y }: { x: SharedValue<number>; y: SharedValue<number> }) {
  return <Circle cx={x} cy={y} r={8} color={Colors.primary} />;
}

const CoinDetails = () => {
  const { id } = useLocalSearchParams();
  const stringId = Array.isArray(id) ? id[0] : id;

  const font = useFont(require("@/assets/fonts/SpaceMono-Regular.ttf"), 12);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const { state, isActive } = useChartPressState({ x: 0, y: { price: 0 } });

  const headerHeight = useHeaderHeight();
  const itemsRef = useRef<Array<TouchableOpacity | null>>([]);

  useEffect(() => {
    if (isActive) Haptics.selectionAsync();
  }, [isActive]);

  const { data: coinData } = useGetCoinDetailsQuery({ id: stringId ?? "" });
  const { data: tickers } = useGetCoinTickersQuery({
    name: coinData?.slug === "bnb" ? "binance-coin" : coinData?.slug,
    symbol: coinData?.symbol,
  });

  const animatedText = useAnimatedProps(() => {
    return {
      text: `${state.y.price.value.value.toFixed(2)} $`,
      defaultValue: "",
    };
  });

  const animatedDateText = useAnimatedProps(() => {
    const date = new Date(state.x.value.value);
    return {
      text: `${date.toLocaleDateString()}`,
      defaultValue: "",
    };
  });

  return (
    <>
      <Stack.Screen
        options={{
          title: coinData?.name,
        }}
      />
      <SectionList
        contentInsetAdjustmentBehavior="automatic"
        style={{ marginTop: headerHeight }}
        scrollEnabled={true}
        stickySectionHeadersEnabled={true}
        keyExtractor={(i) => i.title}
        renderSectionHeader={() => (
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.renderSectionHeaderContainer}
          >
            {Categories.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setActiveIndex(index)}
                style={
                  activeIndex === index
                    ? styles.categoriesBtnActive
                    : styles.categoriesBtn
                }
              >
                <Text
                  style={
                    activeIndex === index
                      ? styles.categoryTextActive
                      : styles.categoryText
                  }
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        ListHeaderComponent={() => (
          <>
            <View style={styles.listHeaderContainer}>
              <Text style={styles.subtitle}>{coinData?.symbol}</Text>
              <Image source={{ uri: coinData?.logo }} style={styles.coinLogo} />
            </View>

            <View style={styles.actionsContainer}>
              <TouchableOpacity
                style={[defaultStyles.pillButtonSmall, styles.actionBuy]}
              >
                <Ionicons name="add" size={24} color={Colors.white} />
                <Text
                  style={[defaultStyles.buttonText, { color: Colors.white }]}
                >
                  Buy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[defaultStyles.pillButtonSmall, styles.actionReceive]}
              >
                <Ionicons name="arrow-back" size={24} color={Colors.primary} />
                <Text
                  style={[defaultStyles.buttonText, { color: Colors.primary }]}
                >
                  Receive
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        renderItem={({ item }) => (
          <>
            <View style={[defaultStyles.block, { height: 500 }]}>
              {tickers && (
                <>
                  {!isActive && (
                    <View>
                      <Text style={styles.currentPrice}>
                        {tickers[tickers.length - 1].price.toFixed(2)} $
                      </Text>
                      <Text style={styles.dateTitle}>Today</Text>
                    </View>
                  )}
                  {isActive && (
                    <View>
                      <AnimatedTextInput
                        editable={false}
                        underlineColorAndroid={"transparent"}
                        style={styles.currentPrice}
                        animatedProps={animatedText}
                      ></AnimatedTextInput>
                      <AnimatedTextInput
                        editable={false}
                        underlineColorAndroid={"transparent"}
                        style={styles.dateTitle}
                        animatedProps={animatedDateText}
                      ></AnimatedTextInput>
                    </View>
                  )}
                  <CartesianChart
                    chartPressState={state}
                    axisOptions={{
                      font,
                      tickCount: 5,
                      labelOffset: { x: -2, y: 0 },
                      labelColor: Colors.gray,
                      formatYLabel: (v) => `${v} $`,
                      formatXLabel: (ms) => format(new Date(ms), "MM/yy"),
                    }}
                    data={tickers!}
                    xKey="timestamp"
                    yKeys={["price"]}
                  >
                    {({ points }) => (
                      <>
                        <Line
                          points={points?.price}
                          color={Colors.primary}
                          strokeWidth={3}
                        />
                        {isActive && (
                          <ToolTip
                            x={state.x.position}
                            y={state.y.price.position}
                          />
                        )}
                      </>
                    )}
                  </CartesianChart>
                </>
              )}
            </View>
            <View style={[defaultStyles.block, { marginTop: 20 }]}>
              <Text style={styles.subtitle}>{coinData?.name} Overview</Text>
              <Text style={{ color: Colors.gray }}>
                {coinData?.description}
              </Text>
            </View>
          </>
        )}
        sections={[{ data: [{ title: "Chart" }] }]}
      />
    </>
  );
};

const styles = StyleSheet.create({
  renderSectionHeaderContainer: {
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: Colors.background,
    borderBottomColor: Colors.lightGray,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  listHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
  },
  coinLogo: {
    width: 60,
    height: 60,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 10,
    margin: 12,
  },
  actionBuy: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    gap: 10,
  },
  actionReceive: {
    backgroundColor: Colors.primaryMuted,
    flexDirection: "row",
    gap: 10,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.gray,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.gray,
  },
  categoryTextActive: {
    fontSize: 14,
    color: Colors.black,
  },
  categoriesBtn: {
    padding: 10,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  categoriesBtnActive: {
    padding: 10,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.white,
    borderRadius: 20,
  },
  currentPrice: {
    fontSize: 30,
    fontWeight: "bold",
    color: Colors.dark,
  },
  dateTitle: {
    fontSize: 18,
    color: Colors.gray,
  },
});

export default CoinDetails;
