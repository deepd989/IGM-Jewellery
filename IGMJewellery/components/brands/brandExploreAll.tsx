import { 
    StyleSheet, 
    Text, 
    View, 
    TextInput, 
    ScrollView,  
    TouchableOpacity, 
    Dimensions,
    Platform,
    StatusBar
  } from 'react-native';
import BrandGridTileView from '../brandGrid';
import { BrandCarousel, BrandSection } from './brandList';
import { SafeAreaFrameContext, SafeAreaView } from 'react-native-safe-area-context';

const TOP_BRANDS = [1, 2, 3, 4, 5, 6];
const ETHNIC_BRANDS = [1, 2, 3, 4, 5, 6];
const MODERN_BRANDS = [1, 2, 3, 4, 5, 6];


export default function BrandsExploreAll() {
    return (<>
    <SafeAreaView>
            <ScrollView>
                <Text style={style.header}>Top Brands</Text>
                <BrandCarousel data={TOP_BRANDS} />
                <BrandSection title="Ethnic Jewellery Brands" data={ETHNIC_BRANDS} />
                <BrandSection title="Modern Jewellery Brands" data={MODERN_BRANDS} />
                <BrandSection title="Only at IGM" data={ETHNIC_BRANDS} />
            </ScrollView>   
        </SafeAreaView>      
    </>)
} 

const style=StyleSheet.create({
    header:{fontSize:24,
    fontWeight:"600",
    marginTop:20,
    marginBottom:20,
    textAlign:"center"
    }
})