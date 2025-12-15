import { FILTER_CATEGORIES } from '@/dummyData/filters';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    FlatList,
    Modal,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: Record<string, string[]>) => void;
}



const { width, height } = Dimensions.get('window');

export const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose, onApply }) => {
  const [activeCategoryId, setActiveCategoryId] = useState('productType');
  // Record<CategoryId, Array<OptionId>>
  const [selections, setSelections] = useState<Record<string, string[]>>({});

  const activeCategory = FILTER_CATEGORIES.find(c => c.id === activeCategoryId) || FILTER_CATEGORIES[0];

  const toggleSelection = (categoryId: string, optionId: string) => {
    setSelections(prev => {
      const current = prev[categoryId] || [];
      const exists = current.includes(optionId);
      let updated;
      if (exists) {
        updated = current.filter(id => id !== optionId);
      } else {
        updated = [...current, optionId];
      }
      return { ...prev, [categoryId]: updated };
    });
  };

  const clearAll = () => {
    setSelections({});
  };

  const handleApply = () => {
    onApply(selections);
    onClose();
  };

  const renderSidebarItem = ({ item }: { item: typeof FILTER_CATEGORIES[0] }) => {
    const isActive = item.id === activeCategoryId;
    const count = selections[item.id]?.length || 0;

    return (
      <TouchableOpacity 
        style={[styles.sidebarItem, isActive && styles.sidebarItemActive]}
        onPress={() => setActiveCategoryId(item.id)}
      >
        <View style={styles.sidebarLabelContainer}>
          <Text style={[styles.sidebarText, isActive && styles.sidebarTextActive]}>
            {item.label}
          </Text>
          {count > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{count}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderGridOption = ({ item }: { item: { id: string, label: string } }) => {
    const isSelected = (selections[activeCategoryId] || []).includes(item.id);
    return (
      <TouchableOpacity 
        style={styles.gridItemContainer}
        onPress={() => toggleSelection(activeCategoryId, item.id)}
      >
        <View style={[styles.gridItemBox, isSelected && styles.gridItemBoxSelected]}>
           {/* Placeholder for image */}
           {isSelected && (
             <Ionicons name="checkmark" size={24} color={COLORS.text} style={styles.checkIconCenter} />
           )}
        </View>
        <Text style={[styles.gridItemText, isSelected && styles.gridItemTextSelected]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderListOption = ({ item }: { item: { id: string, label: string } }) => {
    const isSelected = (selections[activeCategoryId] || []).includes(item.id);
    return (
      <TouchableOpacity 
        style={styles.listItem}
        onPress={() => toggleSelection(activeCategoryId, item.id)}
      >
        <Text style={[styles.listItemText, isSelected && styles.listItemTextSelected]}>
          {item.label}
        </Text>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Ionicons name="checkmark" size={14} color="#FFF" />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="options-outline" size={24} color={COLORS.text} />
            <Text style={styles.headerTitle}>Filters</Text>
          </View>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* Body */}
        <View style={styles.body}>
          {/* Sidebar */}
          <View style={styles.sidebar}>
            <FlatList
              data={FILTER_CATEGORIES}
              keyExtractor={item => item.id}
              renderItem={renderSidebarItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.sidebarContent}
            />
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            {activeCategory.type === 'grid' ? (
              <FlatList
                key={activeCategoryId} // Refresh on category change
                data={activeCategory.options}
                keyExtractor={item => item.id}
                numColumns={3}
                renderItem={renderGridOption}
                contentContainerStyle={styles.gridContent}
              />
            ) : (
              <FlatList
                key={activeCategoryId}
                data={activeCategory.options}
                keyExtractor={item => item.id}
                renderItem={renderListOption}
                contentContainerStyle={styles.listContent}
              />
            )}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.clearBtn} onPress={clearAll}>
            <Text style={styles.clearBtnText}>CLEAR ALL</Text>
          </TouchableOpacity>
          <View style={styles.verticalDivider} />
          <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
            <Text style={styles.applyBtnText}>APPLY FILTER</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: SPACING.s,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: '35%',
    backgroundColor: '#F9F9F9', // Sidebar background typically lighter/gray
  },
  sidebarContent: {
    paddingBottom: SPACING.xl,
  },
  sidebarItem: {
    paddingVertical: 20,
    paddingHorizontal: SPACING.m,
  },
  sidebarItemActive: {
    backgroundColor: '#FFFFFF', // Highlighted
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  sidebarLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sidebarText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    flex: 1,
  },
  sidebarTextActive: {
    color: COLORS.text,
    fontWeight: '600',
  },
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginLeft: 4,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  
  content: {
    width: '65%',
    backgroundColor: '#FFFFFF',
  },
  gridContent: {
    padding: SPACING.m,
  },
  gridItemContainer: {
    width: '33.3%',
    alignItems: 'center',
    marginBottom: SPACING.l,
    paddingHorizontal: 4,
  },
  gridItemBox: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridItemBoxSelected: {
    backgroundColor: '#EAEAEA',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  checkIconCenter: {
    opacity: 0.5,
  },
  gridItemText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  gridItemTextSelected: {
    color: COLORS.text,
    fontWeight: '600',
  },

  listContent: {
    padding: SPACING.m,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FAFAFA',
  },
  listItemText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  listItemTextSelected: {
    color: COLORS.text,
    fontWeight: '500',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  footer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    height: 60,
  },
  clearBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearBtnText: {
    color: COLORS.text,
    fontWeight: '600',
    fontSize: 14,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#F0F0F0',
    height: '100%',
  },
  applyBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyBtnText: {
    color: COLORS.text, // Usually apply is prominent, but design shows plain text
    fontWeight: '600',
    fontSize: 14,
  },
});
