import { LUXURY_COLORS } from "@/constants/theme";
import React from "react";
import {
  KeyboardTypeOptions,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";

type LuxuryTextFieldProps = {
  label: string;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  /** Marks the field with the red asterisk the classic form uses. */
  required?: boolean;
  /** Message under the field; the border turns red while it is set. */
  error?: string;
  /** Fixed text locked to the left of the input, e.g. a dialling code. */
  prefix?: string;
  keyboardType?: KeyboardTypeOptions;
  style?: StyleProp<ViewStyle>;
};

/**
 * A labelled input on the dark ground. Every luxury profile form field goes
 * through this, so the resting, filled and error states stay in step.
 */
export default function LuxuryTextField({
  label,
  value,
  onChangeText,
  placeholder,
  required = false,
  error,
  prefix,
  keyboardType,
  style,
}: LuxuryTextFieldProps) {
  return (
    <View style={style}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>

      <View style={[styles.field, !!error && styles.fieldError]}>
        {!!prefix && (
          <View style={styles.prefix}>
            <Text style={styles.prefixText}>{prefix}</Text>
          </View>
        )}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={LUXURY_COLORS.textMuted}
          keyboardType={keyboardType}
          style={styles.input}
        />
      </View>

      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
    color: LUXURY_COLORS.text,
  },
  required: {
    color: "#FF6B6B",
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    height: 54,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: LUXURY_COLORS.border,
    backgroundColor: LUXURY_COLORS.surface,
    overflow: "hidden",
  },
  fieldError: {
    borderColor: "#FF6B6B",
  },
  prefix: {
    height: "100%",
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: LUXURY_COLORS.border,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  prefixText: {
    fontSize: 14,
    color: LUXURY_COLORS.text,
  },
  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 16,
    fontSize: 14,
    color: LUXURY_COLORS.text,
    // Android pads its inputs by default, which pushes the text off-centre.
    paddingVertical: 0,
  },
  errorText: {
    marginTop: 6,
    fontSize: 11,
    color: "#FF6B6B",
  },
});
