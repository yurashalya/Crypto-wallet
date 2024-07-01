import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Button,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";

import Colors from "@/constants/Colors";
import WidgetList from "@/components/SortableList/WidgetList";
import RoundButton from "@/components/RoundButton";
import Dropdown from "@/components/Dropdown";
import { useWalletStore } from "@/store/walletStore";

const Home = () => {
  const headerHeight = useHeaderHeight();

  const { wallet, runTransaction, transactions, clearTransactions } =
    useWalletStore();

  const onAddMoney = () => {
    runTransaction({
      id: Math.random().toString(),
      title: "Add money",
      amount: Math.floor(Math.random() * 1000) * (Math.random() > 0.5 ? 1 : -1),
      date: new Date(),
    });
  };

  return (
    <ScrollView
      style={{ backgroundColor: Colors.background }}
      contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: 70 }}
    >
      <View style={styles.account}>
        <View style={styles.row}>
          <Text style={styles.balance}>{wallet()}</Text>
          <Text style={styles.currency}>€</Text>
        </View>
      </View>
      <View style={styles.actionRow}>
        <RoundButton icon="add" text="Add money" onPress={onAddMoney} />
        <RoundButton
          icon="refresh"
          text="Exchange"
          onPress={clearTransactions}
        />
        <RoundButton icon="list" text="Details" />
        <Dropdown />
      </View>

      <Text style={styles.sectionHeader}>Transactions</Text>
      <View style={styles.transactionsHeader}>
        {transactions.length === 0 && (
          <Text style={{ padding: 14, color: Colors.gray }}>
            No transactions yet
          </Text>
        )}
        {transactions.length > 0 &&
          transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionsContainer}>
              <View style={styles.circle}>
                <Ionicons
                  name={transaction.amount > 0 ? "add" : "remove"}
                  size={30}
                  color={Colors.dark}
                />
              </View>

              <View style={styles.transaction}>
                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                <Text style={styles.transactionAmount}>
                  {transaction.date.toLocaleString()}
                </Text>
              </View>
              <Text>{transaction.amount}€</Text>
            </View>
          ))}
      </View>

      <Text style={styles.sectionHeader}>Widgets</Text>
      <WidgetList />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  account: {
    margin: 80,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: 10,
  },
  balance: {
    fontSize: 40,
    fontWeight: "bold",
  },
  currency: {
    fontSize: 20,
    fontWeight: "500",
    paddingBottom: 5,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  transactionsHeader: {
    marginHorizontal: 20,
    padding: 14,
    backgroundColor: Colors.white,
    borderRadius: 16,
    gap: 20,
  },
  transactionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  transaction: {
    flex: 1,
  },
  transactionTitle: {
    fontWeight: "400",
  },
  transactionAmount: {
    color: Colors.gray,
    fontSize: 12,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 20,
    marginBottom: 10,
  },
});

export default Home;
