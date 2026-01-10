import BottomNavBar from '@/components/bottomNavBar';
import GiftExplore from '@/components/giftExplore';
import GiftStepA from '@/components/gifting/giftStep1';
import GiftCardScreen from '@/components/gifting/giftStep2';
import EGiftCardScreen from '@/components/gifting/giftStep3';
import GiftStepper from '@/components/gifting/giftStepper';
import GiftingCard from '@/components/giftingCard';
import HashtagComponent from '@/components/hashtagComponent';
import HorizontalRuleIGM from '@/components/horizontalRuleIGM';
import LatestCollections from '@/components/latestCollections';
import { TopPicks } from '@/components/topPicks';
import { useGetBrandByNameQuery } from '@/store/apis/brandsApi';
import { useGetProductsQuery } from '@/store/apis/product';
import { selectProducts } from '@/store/productSlice';
import { useRouter } from 'expo-router';
import { Scroll } from 'lucide-react-native';
import React from 'react';
import { Text, StyleSheet ,ScrollView, Pressable} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

export default function Gift() {
    const router = useRouter();
    const { data: products=[], isLoading, error } = useGetProductsQuery({});
  return (
    <SafeAreaView style={styles.container}>
      <Pressable
              onPress={() => router.back()}
              style={styles.backButton}
              hitSlop={10}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <Text style={styles.backText}>‹</Text>
            </Pressable>
       <ScrollView >
        <GiftExplore/>
       <HorizontalRuleIGM/>
       <TopPicks products={products}/>
       <HorizontalRuleIGM/>
        <LatestCollections/>
        <HorizontalRuleIGM/>
        <HashtagComponent/>
       </ScrollView>
       <BottomNavBar activeTab='Gifting'></BottomNavBar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
  backButton: {
    position: 'absolute',
    top: 50, // adjust for notch/status bar as needed
    left: 16,
    zIndex: 100,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  backText: {
    fontSize: 26,
    fontWeight: '600',
    color: 'black',
  }
});