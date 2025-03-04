import { auth } from "@/auth"
import LogoutButton from "../../components/logout-button";

const AdminPage = async () => {
    const session = await auth();
    if(session?.user?.role !== "admin"){
        return <div>No eres administrador</div>
    }

  return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <LogoutButton />
    </div>
  )
}

export default AdminPage
