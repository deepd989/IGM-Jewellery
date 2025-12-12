    import { useRouter } from "expo-router";
    import { useEffect } from "react";
    import { View } from "react-native";


    export default function AuthGuard({ children }: { children: React.ReactNode }) {
        const router = useRouter();

        useEffect(() => {
            const isAuthenticated = true;
            if (!isAuthenticated) {
                router.replace("/login");
                return 
            }else{
                router.replace("/home");}
        }, []);
    
        //check if user is authenticated
        // Replace with actual authentication logic


        return <View style={{ flex: 1 }}>{children}</View>;   
    }