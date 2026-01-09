import React, { useState } from "react";
import { View, Image, Pressable, StyleSheet, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import tanishqLogo from "../assets/images/bwBrandlogo/Tanishq_Logo.png";
import tbzLogo from "../assets/images/bwBrandlogo/tbzlogo.png";
import pcjLogo from "../assets/images/bwBrandlogo/pcjlogo.png";
import malabarLogo from "../assets/images/bwBrandlogo/mbrandlogo.png";
import caratlaneLogo from "../assets/images/bwBrandlogo/caratlanelogo.png";
import kjlogo from "../assets/images/bwBrandlogo/kjlogo1.png";
import { SectionHeader } from "@/app/home";

const W = Dimensions.get("window").width;
const GAP = 12;

export default function BrandGridTileView() {
  const [selected, setSelected] = useState("");
  const router = useRouter();

  const Tile = ({
    id,
    w,
    h,
    src,
    brandSlug,
  }: {
    id: string;
    w: number;
    h: number;
    src: any;
    brandSlug: string;
  }) => (
    <Pressable
      onPress={() => {
        setSelected(id);
        router.push(`/brandProfile/${brandSlug}`);
      }}
      style={[
        styles.tile,
        {
          width: w,
          height: h,
          borderColor: selected === id ? "#2F80ED" : "transparent",
        },
      ]}
    >
      <Image
        source={src}
        style={{ width: "60%", height: "60%", opacity: 0.55 }}
        resizeMode="contain"
      />
    </Pressable>
  );

  return (
    <>
      <SectionHeader value="Explore Brand" />
      <View style={styles.container}>
        {/* ROW 1 */}
        <View style={styles.row}>
          <Tile id="large1" w={W * 0.58} h={W * 0.38} src={tanishqLogo} brandSlug="tanishq" />

          <View style={{ justifyContent: "space-between" }}>
            <Tile id="r1top" w={W * 0.28} h={W * 0.18} src={malabarLogo} brandSlug="malabar" />
            <View style={{ marginTop: GAP }}>
              <Tile id="r1bottom" w={W * 0.28} h={W * 0.18} src={caratlaneLogo} brandSlug="caratlane" />
            </View>
          </View>
        </View>

        {/* ROW 2 */}
        <View style={styles.row}>
          {/* Left column */}
          <View style={{ gap: GAP }}>
            <Tile id="r2leftTop" w={W * 0.28} h={W * 0.18} src={pcjLogo} brandSlug="pcj" />
            <Tile id="r2leftBottom" w={W * 0.28} h={W * 0.18} src={tbzLogo} brandSlug="tbz" />
          </View>

          {/* Middle column */}
          <View style={{ gap: GAP }}>
            <Tile id="r2midTop" w={W * 0.28} h={W * 0.18} src={tanishqLogo} brandSlug="tanishq" />
            <Tile id="r2midBottom" w={W * 0.28} h={W * 0.18} src={tbzLogo} brandSlug="tbz" />
          </View>

          {/* Right big tile */}
          <Tile id="r2big" w={W * 0.32} h={W * 0.38} src={kjlogo} brandSlug="kalyan_jewellers" />
        </View>

        {/* ROW 3 */}
        <View style={styles.row}>
          <Tile id="r3left" w={W * 0.28} h={W * 0.18} src={pcjLogo} brandSlug="pcj" />
          <Tile id="r3right" w={W * 0.64} h={W * 0.38} src={caratlaneLogo} brandSlug="caratlane" />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingRight: 16,
    gap: GAP,
  },
  row: {
    flexDirection: "row",
    gap: GAP,
    alignItems: "center",
  },
  tile: {
    backgroundColor: "#F3F3F3",
    borderRadius: 22,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
});
