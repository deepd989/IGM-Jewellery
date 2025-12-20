import { Product } from '@/interfaces/product.interface';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { COLORS, SPACING } from '../../constants/theme';


interface CustomizationModalProps {
  visible: boolean;
  onClose: () => void;
  product: Product;
}

const { height } = Dimensions.get('window');

const OptionGroup = ({ label, options, selectedId, onSelect, variant = 'chips' }: any) => (
  <View style={styles.groupContainer}>
    <Text style={styles.groupLabel}>{label}</Text>
    <View style={styles.optionsRow}>
      {options.map((opt: any) => {
        const isSelected = opt.id === selectedId;
        if (variant === 'color') {
          return (
            <TouchableOpacity 
              key={opt.id} 
              style={styles.colorOption}
              onPress={() => onSelect(opt.id)}
            >
              <View style={[styles.colorCircle, { backgroundColor: opt.color }, isSelected && styles.colorCircleActive]} />
              <Text style={[styles.colorText, isSelected && styles.colorTextActive]}>{opt.label}</Text>
            </TouchableOpacity>
          );
        }
        return (
          <TouchableOpacity 
            key={opt.id} 
            style={[styles.chipOption, isSelected && styles.chipOptionActive]}
            onPress={() => onSelect(opt.id)}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

export const CustomizationModal: React.FC<CustomizationModalProps> = ({ visible, onClose, product }) => {
  const [purity, setPurity] = useState('18KT');
  const [color, setColor] = useState('yellow');
  const [diamondQuality, setDiamondQuality] = useState('SI IJ');
  const [quantity, setQuantity] = useState(1);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.container} onPress={e => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Customize your design</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Options */}
            <OptionGroup 
              label="Gold Purity"
              selectedId={purity}
              onSelect={setPurity}
              options={[
                { id: '14KT', label: '14 KT' },
                { id: '18KT', label: '18 KT' },
                { id: '22KT', label: '22 KT' },
              ]}
            />

            <OptionGroup 
              label="Metal Color"
              selectedId={color}
              onSelect={setColor}
              variant="color"
              options={[
                { id: 'yellow', label: 'Yellow Gold', color: '#FFD700' },
                { id: 'rose', label: 'Rose Gold', color: '#B76E79' },
                { id: 'white', label: 'White Gold', color: '#E5E4E2' },
              ]}
            />

            <OptionGroup 
              label="Diamond Quality"
              selectedId={diamondQuality}
              onSelect={setDiamondQuality}
              options={[
                { id: 'SI IJ', label: 'SI IJ' },
                { id: 'VVS EF', label: 'VVS EF' },
                { id: 'VS GH', label: 'VS GH' },
              ]}
            />

            {/* Quantity Selector */}
            <View style={styles.quantitySection}>
              <Text style={styles.groupLabel}>Quantity</Text>
              <View style={styles.quantityRow}>
                <View style={styles.quantityInputContainer}>
                  <View style={styles.quantityLabelBox}>
                    <Text style={styles.quantityLabelText}>Quantity</Text>
                    <Text style={styles.quantityValue}>{quantity}</Text>
                  </View>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity onPress={incrementQuantity} style={styles.arrowBtn}>
                      <Ionicons name="chevron-up" size={14} color="#333" />
                    </TouchableOpacity>
                    <View style={styles.arrowDivider} />
                    <TouchableOpacity onPress={decrementQuantity} style={styles.arrowBtn}>
                      <Ionicons name="chevron-down" size={14} color="#333" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.editCircle}>
                    <Ionicons name="pencil" size={12} color="#FFF" />
                  </View>
                </View>
                <TouchableOpacity style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={24} color="red" />
                </TouchableOpacity>
              </View>
              {quantity < 1 && <Text style={styles.errorText}>Quantity must be at least 1</Text>}
            </View>
          </ScrollView>

          {/* Sticky Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.confirmBtn} onPress={onClose}>
              <Text style={styles.confirmBtnText}>CONFIRM CUSTOMIZATION</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  closeBtn: {
    position: 'absolute',
    right: SPACING.m,
  },
  scrollContent: {
    padding: SPACING.m,
    paddingBottom: 100,
  },
  groupContainer: {
    marginBottom: SPACING.l,
  },
  groupLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  chipOption: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  chipOptionActive: {
    borderColor: COLORS.primary,
    backgroundColor: '#FAFAFA',
  },
  chipText: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  chipTextActive: {
    color: COLORS.text,
    fontWeight: '700',
  },
  colorOption: {
    alignItems: 'center',
  },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 6,
  },
  colorCircleActive: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  colorText: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },
  colorTextActive: {
    color: COLORS.text,
    fontWeight: '700',
  },
  quantitySection: {
    marginTop: SPACING.s,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E8A39A',
    borderRadius: 4,
    flex: 1,
    height: 56,
    marginRight: 16,
    position: 'relative',
  },
  quantityLabelBox: {
    flex: 1,
    paddingLeft: 12,
  },
  quantityLabelText: {
    fontSize: 11,
    color: '#8E9AAF',
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  quantityControls: {
    width: 32,
    height: '100%',
    backgroundColor: '#F9F9F9',
    borderLeftWidth: 1,
    borderLeftColor: '#F0F0F0',
  },
  arrowBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowDivider: {
    height: 1,
    backgroundColor: '#F0F0F0',
  },
  editCircle: {
    position: 'absolute',
    right: -10,
    top: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E87A5E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  deleteBtn: {
    padding: 8,
  },
  errorText: {
    color: '#E87A5E',
    fontSize: 11,
    marginTop: 4,
  },
  footer: {
    padding: SPACING.m,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFF',
  },
  confirmBtn: {
    backgroundColor: COLORS.primary,
    height: 54,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
});