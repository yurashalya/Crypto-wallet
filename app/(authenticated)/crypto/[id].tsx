import {
  View,
  Text,
  ScrollView,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import { useGetCoinDetailsQuery } from "@/queries/useGetCoinDetailsQuery";

import { Stack, useLocalSearchParams } from "expo-router";
import { useHeaderHeight } from "@react-navigation/elements";

import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";
import { Categories } from "@/constants/keys";

const CoinDetails = () => {
  const { id } = useLocalSearchParams();
  const stringId = Array.isArray(id) ? id[0] : id;

  const [activeIndex, setActiveIndex] = useState<number>(0);

  const headerHeight = useHeaderHeight();
  const itemsRef = useRef<Array<TouchableOpacity | null>>([]);

  const { data: coinData } = useGetCoinDetailsQuery({ id: stringId ?? "" });

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
          <View style={defaultStyles.block}>
            <Text>Render Item</Text>
          </View>
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
    marginBottom: 20,
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
});

export default CoinDetails;
