import { Ionicons } from "@expo/vector-icons";
import { View,Text } from "react-native";


export default function searchBar(){
    return (<View style={styles.searchRow}>
    <Ionicons name="search" size={22} color="#444" />
    <Text style={styles.searchPlaceholder}>Search</Text>

    <View style={{ flexDirection: "row", marginLeft: "auto", gap: 20 }}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>GBST Vault</Text>
      </View>
      <Ionicons name="notifications-outline" size={22} />
      <Ionicons name="heart-outline" size={22} />
      <Ionicons name="bag-outline" size={22} />
    </View>
  </View>)
}


const styles = {
      searchRow: { flexDirection: "row", alignItems: "center", marginTop: 20 },
  searchPlaceholder: { marginLeft: 8, color: "#666", fontSize: 16 },

  badge: { backgroundColor: "#f1f1f1", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 14 },
  badgeText: { fontSize: 12, color: "#444" },
}