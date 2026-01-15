import { OCCASIONS } from '@/constants/occasions';
    import { ProductTypes } from '@/constants/productTypes';
    import { RELATIONSHIPS } from '@/constants/relationships';
    import React, { useState } from 'react';
    import { router } from 'expo-router';
    import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Platform,
    } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

    const occasions = OCCASIONS
    const whoIsItFor = RELATIONSHIPS
    const products = ProductTypes

    export default function AiSearchComponent() {
    const [searchText, setSearchText] = useState('');
    const [selectedOccasion, setSelectedOccasion] = useState('Wedding');
    const [selectedWhoFor, setSelectedWhoFor] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [priceRange, setPriceRange] = useState([0, 10000]);
    
    const [occasionExpanded, setOccasionExpanded] = useState(true);
    const [whoForExpanded, setWhoForExpanded] = useState(false);
    const [productExpanded, setProductExpanded] = useState(false);
    const [priceExpanded, setPriceExpanded] = useState(false);

    const toggleAccordion = (section) => {
        switch (section) {
        case 'occasion':
            setOccasionExpanded(!occasionExpanded);
            break;
        case 'whoFor':
            setWhoForExpanded(!whoForExpanded);
            break;
        case 'product':
            setProductExpanded(!productExpanded);
            break;
        case 'price':
            setPriceExpanded(!priceExpanded);
            break;
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
        <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Ai Search</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#999"
            />
        </View>

        {/* Category Pills */}
        <ScrollView 
            horizontal  
            showsHorizontalScrollIndicator={false}
            style={styles.categoryContainer}
        >
            {['New In', 'Rings', 'Rings', 'Necklace', 'Earring', 'Rings'].map((cat, idx) => (
            <View key={idx} style={styles.categoryPill}>
                <View style={styles.categoryImage} />
                <Text style={styles.categoryText}>{cat}</Text>
            </View>
            ))}
        </ScrollView>

        {/* Main Content */}
        <ScrollView style={styles.scrollContent}>
            {/* Title Section */}
            <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Not sure what to buy?</Text>
            <Text style={styles.subtitle}>
                Let <Text style={styles.sonarText}>Sonar</Text> help you
            </Text>
            </View>

            {/* Occasion Accordion */}
            <View style={styles.accordionContainer}>
            <TouchableOpacity 
                style={styles.accordionHeader}
                onPress={() => toggleAccordion('occasion')}
            >
                <Text style={styles.accordionTitle}>What's the occasion?</Text>
                <Text style={styles.chevron}>{occasionExpanded ? '⌄' : '›'}</Text>
            </TouchableOpacity>
            
            {occasionExpanded && (
                <View style={styles.accordionContent}>
                <View style={styles.optionsGrid}>
                    {occasions.map((occasion) => (
                    <TouchableOpacity
                        key={occasion}
                        style={[
                        styles.optionButton,
                        selectedOccasion === occasion && styles.optionButtonSelected
                        ]}
                        onPress={() => setSelectedOccasion(occasion)}
                    >
                        <Text
                        style={[
                            styles.optionText,
                            selectedOccasion === occasion && styles.optionTextSelected
                        ]}
                        >
                        {occasion}
                        </Text>
                    </TouchableOpacity>
                    ))}
                </View>
                </View>
            )}
            </View>

            {/* Who is it for Accordion */}
            <View style={styles.accordionContainer}>
            <TouchableOpacity 
                style={styles.accordionHeader}
                onPress={() => toggleAccordion('whoFor')}
            >
                <Text style={styles.accordionTitle}>Who is it for?</Text>
                <Text style={styles.chevron}>{whoForExpanded ? '⌄' : '›'}</Text>
            </TouchableOpacity>
            
            {whoForExpanded && (
                <View style={styles.accordionContent}>
                <View style={styles.optionsGrid}>
                    {whoIsItFor.map((person) => (
                    <TouchableOpacity
                        key={person}
                        style={[
                        styles.optionButton,
                        selectedWhoFor === person && styles.optionButtonSelected
                        ]}
                        onPress={() => setSelectedWhoFor(person)}
                    >
                        <Text
                        style={[
                            styles.optionText,
                            selectedWhoFor === person && styles.optionTextSelected
                        ]}
                        >
                        {person}
                        </Text>
                    </TouchableOpacity>
                    ))}
                </View>
                </View>
            )}
            </View>

            {/* Product Type Accordion */}
            <View style={styles.accordionContainer}>
            <TouchableOpacity 
                style={styles.accordionHeader}
                onPress={() => toggleAccordion('product')}
            >
                <Text style={styles.accordionTitle}>Any specific product you're eying?</Text>
                <Text style={styles.chevron}>{productExpanded ? '⌄' : '›'}</Text>
            </TouchableOpacity>
            
            {productExpanded && (
                <View style={styles.accordionContent}>
                <View style={styles.optionsGrid}>
                    {products.map((product) => (
                    <TouchableOpacity
                        key={product}
                        style={[
                        styles.optionButton,
                        selectedProduct === product && styles.optionButtonSelected
                        ]}
                        onPress={() => setSelectedProduct(product)}
                    >
                        <Text
                        style={[
                            styles.optionText,
                            selectedProduct === product && styles.optionTextSelected
                        ]}
                        >
                        {product}
                        </Text>
                    </TouchableOpacity>
                    ))}
                </View>
                </View>
            )}
            </View>

            {/* Price Range Accordion */}
            <View style={styles.accordionContainer}>
            <TouchableOpacity 
                style={styles.accordionHeader}
                onPress={() => toggleAccordion('price')}
            >
                <Text style={styles.accordionTitle}>Do you have a price range?</Text>
                <Text style={styles.chevron}>{priceExpanded ? '⌄' : '›'}</Text>
            </TouchableOpacity>
            
            {priceExpanded && (
                <View style={styles.accordionContent}>
                <View style={styles.priceRangeContainer}>
                    <Text style={styles.priceRangeText}>
                    ${priceRange[0]} - ${priceRange[1]}
                    </Text>
                    <Text style={styles.priceHint}>Add your price slider component here</Text>
                </View>
                </View>
            )}
            </View>
        </ScrollView>
        <View style={styles.bottomButtonContainer}>
                <TouchableOpacity 
                    style={styles.startLookingButton}
                    onPress={() => router.push('/product-list')}
                >
                    <Text style={styles.startLookingIcon}>🔍</Text>
                    <Text style={styles.startLookingText}>Start Looking</Text>
                </TouchableOpacity>
    </View>
        </View>
        </SafeAreaView>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 20,
        paddingBottom: 15,
        backgroundColor: '#F5F5F5',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '600',
        color: '#000',
    },
    closeButton: {
        padding: 5,
    },
    closeIcon: {
        fontSize: 28,
        fontWeight: '300',
        color: '#000',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        marginHorizontal: 20,
        marginVertical: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 25,
        ...Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
        },
        android: {
            elevation: 2,
        },
        }),
    },
    searchIcon: {
        fontSize: 20,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    categoryContainer: {
        paddingHorizontal: 20,
        flexGrow: 0,
        marginVertical: 10,
    },
    categoryPill: {
        alignItems: 'center',
        marginRight: 15,
    },
    categoryImage: {
        width: 60,
        height: 60,
        backgroundColor: '#E0E0E0',
        borderRadius: 12,
        marginBottom: 5,
    },
    categoryText: {
        fontSize: 12,
        color: '#666',
    },
    scrollContent: {
        flex: 1,
        paddingHorizontal: 20,
    },
    titleSection: {
        alignItems: 'center',
        marginVertical: 30,
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
    sonarText: {
        fontStyle: 'italic',
        color: '#666',
    },
    accordionContainer: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        marginBottom: 15,
        overflow: 'hidden',
        ...Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 3,
        },
        android: {
            elevation: 1,
        },
        }),
    },
    accordionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    accordionTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        flex: 1,
    },
    chevron: {
        fontSize: 24,
        color: '#666',
    },
    accordionContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    optionButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#FFF',
        marginBottom: 10,
    },
    optionButtonSelected: {
        backgroundColor: '#000',
        borderColor: '#000',
    },
    optionText: {
        fontSize: 14,
        color: '#000',
    },
    optionTextSelected: {
        color: '#FFF',
    },
    priceRangeContainer: {
        paddingVertical: 10,
    },
    priceRangeText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
        marginBottom: 10,
    },
    priceHint: {
        fontSize: 14,
        color: '#999',
        fontStyle: 'italic',
    },
    bottomContainer: {
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
    },
    floatingButton: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        ...Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
        },
        android: {
            elevation: 6,
        },
        }),
    },
    floatingButtonText: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '600',
    },
    startButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 25,
        width: '90%',
        ...Platform.select({
        ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
        },
        android: {
            elevation: 3,
        },
        }),
    },
    startButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 10,
    },
    startButtonIcon: {
        fontSize: 18,
    },
    bottomButtonContainer: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        paddingBottom: Platform.OS === 'ios' ? 30 : 15,
        backgroundColor: '#F5F5F5',
      },
      startLookingButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        paddingVertical: 16,
        borderRadius: 30,
        ...Platform.select({
          ios: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          },
          android: {
            elevation: 3,
          },
        }),
      },
      startLookingText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
      },
      startLookingIcon: {
        fontSize: 18,
      },
    });