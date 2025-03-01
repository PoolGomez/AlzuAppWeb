import { useEffect, useState } from "react";
// import { auth } from "./firebaseConfig"; // Asegúrate de que la ruta sea correcta
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/src/infrastructure/database/config/database";

const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    // const [loading, setLoading] = useState(true);
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            // setLoading(false);
        });
        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);
    return  user;
    // return { user, loading };
};
export default useAuth;