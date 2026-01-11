import GiftCardRedeemStep1 from "@/app/redeemGiftStep1";
import { useLocalSearchParams } from "expo-router";
import Gift from "./gift";

export default function redeemGiftCardPage() {
     const params = useLocalSearchParams();
    return (
        <>
        <GiftCardRedeemStep1/>
        </>
);
}