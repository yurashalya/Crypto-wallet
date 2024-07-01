import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import { Link } from "expo-router";

import { useCurrenciesQuery } from "@/queries/useGetCurrenciesQuery";
import { useCryptoInfoQuery } from "@/queries/useGetCryptoInfoQuery";

import { defaultStyles } from "@/constants/Styles";
import Colors from "@/constants/Colors";

import { Currency } from "@/types/crypto";

const Crypto = () => {
  const headerHeight = useHeaderHeight();

  const { data: currencies, isFetching: isFetchingCurrencies } =
    useCurrenciesQuery();

  const ids = currencies?.map((currency: Currency) => currency.id).join(",");

  const { data: cryptoInfo, isFetching: isFetchingCryptoInfo } =
    useCryptoInfoQuery({ ids });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingTop: headerHeight }}
    >
      <Text style={defaultStyles.sectionHeader}>Latest crypto</Text>
      <View style={styles.block}>
        {currencies?.map((currency: Currency) => (
          <Link href={`/crypto/${currency.id}`} key={currency.id} asChild>
            <TouchableOpacity style={styles.actionCoinDetails}>
              <View key={currency.id} style={styles.coin}>
                <Image
                  source={{ uri: cryptoInfo?.[currency.id]?.logo }}
                  style={styles.logo}
                />
                <View style={styles.coinDesc}>
                  <Text style={styles.coinName}>{currency.name}</Text>
                  <Text
                    style={{
                      color: Colors.gray,
                    }}
                  >
                    {currency.symbol}
                  </Text>
                </View>
                <View style={styles.coinPriceContainer}>
                  <Text>{currency.quote.EUR?.price.toFixed(2)} €</Text>
                  <View style={styles.coinPrice}>
                    <Ionicons
                      name={
                        currency.quote.EUR.percent_change_1h > 0
                          ? "caret-up"
                          : "caret-down"
                      }
                      size={16}
                      color={
                        currency.quote.EUR.percent_change_1h > 0
                          ? "green"
                          : "red"
                      }
                    />
                    <Text
                      style={{
                        color:
                          currency.quote.EUR.percent_change_1h > 0
                            ? "green"
                            : "red",
                      }}
                    >
                      {currency.quote.EUR.percent_change_1h.toFixed(2)} %
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
  },
  coin: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },
  coinDesc: {
    flex: 1,
    gap: 10,
  },
  actionCoinDetails: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
  },
  coinName: {
    fontWeight: "600",
    color: Colors.dark,
  },
  coinPriceContainer: {
    gap: 10,
    alignItems: "flex-end",
  },
  coinPrice: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
  },
  block: {
    marginHorizontal: 20,
    padding: 14,
    backgroundColor: Colors.white,
    borderRadius: 16,
    gap: 20,
  },
});

export default Crypto;
