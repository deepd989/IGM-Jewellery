import BespokeSection from "@/components/bespokeSection";
import BestSellersSection from "@/components/bestSellers";
import BrandGridTileView from "@/components/brandGrid";
import CommunityCarousel from "@/components/communityCarousel";
import GiftFinder from "@/components/giftFinder";
import GiftingCard from "@/components/giftingCard";
import HomePageCard from "@/components/homePageCard";
import HorizontalRuleIGM from "@/components/horizontalRuleIGM";
import LatestCollections from "@/components/latestCollections";
import OccasionCardList from "@/components/occaisionsHome";
import SearchBar from "@/components/searchBar";
import { TopPicks } from "@/components/topPicks";
import TryAtHomeCard from "@/components/tryAtHomeCard";
import { selectProducts } from "@/store/productSlice";
import { Feather, Ionicons } from "@expo/vector-icons";
import { AudioLines, Sparkles } from 'lucide-react-native';
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from "react-redux";
import EventCard from "@/components/eventCard";
import HashtagComponent from "@/components/hashtagComponent";
import { useFocusEffect, useNavigation, useRouter } from 'expo-router';
import { useGetProductsQuery } from "@/store/apis/product";
import BottomNavBar from "@/components/bottomNavBar";
import { BackHandler } from 'react-native';
import * as Location from 'expo-location';
import { Alert } from 'react-native';
import { getUserPincode } from "@/scripts/location";
import PaymentMethods from "@/components/paymentMethods";





export default function HomeScreen() {
    const [expanded, setExpanded] = useState(false);
    const navigation = useNavigation();
    const [firstRowHeight, setFirstRowHeight] = useState<number | null>(68);
    const { data: products = [], isLoading, isError, error, refetch } = useGetProductsQuery({});
    const router = useRouter();
    const [textInput, setInputChip] = useState<string>("");
    const [pincode, setPincode] = useState(null);

  useEffect(() => {
    (async () => {
      const pin = await getUserPincode();
      setPincode(pin || 'Mumbai 400 999');
    })();
  }, []);
    const handleSubmit = () => {
      router.push({
        pathname: '/exploreAi',
        params: { value: textInput },
      });
    };

    

    useLayoutEffect(() => {
      navigation.setOptions({
        headerLeft: () => null,
        gestureEnabled: false,
      });
    }, [navigation]);
    
    // Disable Android hardware back button
    useFocusEffect(
      useCallback(() => {
        const backHandler = BackHandler.addEventListener(
          'hardwareBackPress',
          () => true
        );
        return () => backHandler.remove();
      }, [])
    );

    
  return (
    <SafeAreaView style={{flex:1}}>
    <ScrollView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.deliveryText}>
            Deliver to <Text style={{ fontWeight: 'bold' }}>
              {pincode || 'Fetching...'}
        </Text>
        </Text>

      </View>

      {/* Search Row */}
     <SearchBar />
      {/* Center Graphic */}

      <View>
          <View style={styles.centerBox}>
          <View style={styles.iconContainer}>
          <Sparkles size={48} color="#d4d4d4" strokeWidth={1.5} />
        </View>

        {/* Greeting Text */}
        <Text style={styles.greetingBold}>Hey there!</Text>
        <Text style={styles.greetingLight}>What sparkle</Text>
        <Text style={styles.greetingLight}>are we looking for today?</Text>
          </View>

          {/* Voice Search Box */}
          <View style={styles.voiceBox}>
            <TextInput
              placeholder="Sonar is listening"
              placeholderTextColor="#999"
              style={styles.input}
              value={textInput}
              onChangeText={setInputChip}
              returnKeyType="send"          // or "done", "go", "search"
              onSubmitEditing={handleSubmit}
            />
            <TouchableOpacity onPress={()=>{router.push({
              pathname: '/exploreAi',
              params: { mode: 'voice' },
            })}}>
              <Ionicons name="mic-outline" size={22} />
            </TouchableOpacity>
            <TouchableOpacity style={{ borderRadius:50, height:30, width:30, alignItems:"center", justifyContent:"center", backgroundColor:"#EBEBEB"}} onPress={()=>{router.push({
              pathname: '/exploreAi',
              params: { mode: 'video' },
            })}}>
                <AudioLines />
            </TouchableOpacity>
          </View>

        <View>
            <View
              style={[
                styles.chipsRow,
                !expanded && firstRowHeight !== null
                  ? { height: firstRowHeight, overflow: "hidden" }
                  : {}
              ]}
              onLayout={(e) => {
                if (firstRowHeight === null) {
                  setFirstRowHeight(e.nativeEvent.layout.height);
                }
              }}
            >
              {[
                "Ai powered",
                "TBZ latest collection",
                "Rings",
                "Wedding",
                "Men’s gifting",
                "Mom’s gift",
                "Anniversary",
                "Ai powered",
                "TBZ latest collection",
                "Rings",
                "Wedding",
                "Men’s gifting",
                "Mom’s gift",
                "Anniversary",
              ].map((chip, idx) => (
                <TouchableOpacity onPress={()=>{setInputChip(chip)}} key={idx} style={styles.chip}>
                  <Text style={styles.chipText}>{chip}</Text>
                </TouchableOpacity>
              ))}
            </View>

              <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                <Text style={styles.moreText}>{expanded ? "Show less" : "More"}</Text>
              </TouchableOpacity>
        </View>
    </View>
        {/* Featured Product Card */}
        <HomePageCard />
        <HorizontalRuleIGM/>
        <BrandGridTileView />
        <HorizontalRuleIGM/>
        <GiftFinder/>
        <HorizontalRuleIGM/>
        <OccasionCardList/>
        <HorizontalRuleIGM/>
        <TopPicks products={products}/>
        <HorizontalRuleIGM/>
        <LatestCollections/>
        <HorizontalRuleIGM/>
        <TryAtHomeCard/>
        <HorizontalRuleIGM/>
        <GiftingCard showExploreButton={true} />
        <HorizontalRuleIGM/>
        <BestSellersSection/>
        <HorizontalRuleIGM/>
        <CommunityCarousel/>
        <HorizontalRuleIGM/>
        <BespokeSection/>
        <HorizontalRuleIGM/>
        <EventCard/>
        <HorizontalRuleIGM/>
        <HashtagComponent/>
        <HorizontalRuleIGM/>
        <View style={styles.contactSection}>
                  <Text style={styles.contactTitle}>For any queries, feel free to contact us:</Text>
                  <View style={styles.contactRow}>
                    <TouchableOpacity style={styles.contactBtn}>
                      <Ionicons name="call-outline" size={20} />
                      <Text style={styles.contactBtnText}>Call Us</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.contactBtn}>
                      <Ionicons name="chatbubble-outline" size={20} />
                      <Text style={styles.contactBtnText}>Chat With Us</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <PaymentMethods />

        {/* Necklace Section */}




    </ScrollView>
    <BottomNavBar></BottomNavBar>
    </SafeAreaView>
  
  );
}


export function SectionHeader({value}: {value:string}) {
    return (
        <View style={{alignItems:"center",marginBottom:40}}>
        <Text style={styles.hey}>{value}</Text>
     </View>
    )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },

  header: { flexDirection: "row", alignItems: "center", gap: 6 },
  deliveryText: { fontSize: 14, color: "#444" },
  bold: { fontWeight: "600" },

  centerBox: { alignItems: "center", marginTop: 30 },
  hey: { marginTop: 10, fontSize: 18, fontWeight: "600" },
  sparkle: { color: "#555", marginTop: 3 },

  voiceBox: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 30,
    gap: 12,
    backgroundColor: "#F8F8F8",
  },
  input: { flex: 1, backgroundColor:"#F8F8F8" },

  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginVertical: 10,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingBold: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  greetingLight: {
    fontSize: 14,
    fontWeight: '300',
    color: '#666',
    textAlign: 'center',
  },
  
  chip: {
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  
  moreText: {
    paddingHorizontal: 12,
    color: "black",
    marginTop: 6,
    fontWeight: "100",
  },
  
  chipText: { fontSize: 12, color: "#444" },

  card: {
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },

  heartIcon: { position: "absolute", top: 20, right: 20 },

  deliveryDate: { marginTop: 8, color: "#666", fontSize: 12 },

  productName: { marginTop: 6, fontSize: 18, fontWeight: "600" },

  priceRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 4 },
  price: { fontSize: 18, fontWeight: "700" },
  cutPrice: { fontSize: 14, color: "#888", textDecorationLine: "line-through" },

  brand: { marginTop: 4, color: "#444" },

  tryButton: {
    marginTop: 14,
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
  },
  tryButtonText: { color: "#fff", fontWeight: "600" },
  contactSection: { alignItems: 'center', padding: 16 },
  contactTitle: { fontSize: 13, color: '#333', marginBottom: 20 },
  contactRow: { flexDirection: 'row', gap: 12 },
  contactBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 50, borderWidth: 1, borderColor: '#DDD', borderRadius: 8, minWidth: 150, backgroundColor: '#FFF' },
  contactBtnText: { marginLeft: 8, fontWeight: '600' },
});
