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
import { selectProducts } from '@/store/productSlice';
import { Scroll } from 'lucide-react-native';
import React from 'react';
import { Text, StyleSheet ,ScrollView} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

export default function Gift() {
    const products = useSelector(selectProducts)
  return (
    <SafeAreaView style={styles.container}>
       <ScrollView >
        <GiftExplore/>
       <HorizontalRuleIGM/>
       <TopPicks products={products}/>
       <HorizontalRuleIGM/>
        <LatestCollections/>
        <HorizontalRuleIGM/>
        <HashtagComponent/>
       </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  }
});