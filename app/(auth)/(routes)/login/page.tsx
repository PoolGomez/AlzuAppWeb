import FormLogin from "./components/form-login"


const LoginPage = async ({
  searchParams
}:{
  searchParams:Promise<{
    verified: string;
    error: string
  }>
}) => {
  // const isVerified = searchParams.verified === "true"
  // const OAuthAccountNotLinked = searchParams.error === "OAuthAccountNotLinked";

  const {verified, error} = await searchParams;
  const isVerified = verified === "true"
  const OAuthAccountNotLinked = error === "OAuthAccountNotLinked";
  return (
    <div>
      <FormLogin 
        isVerified={isVerified}
        OAuthAccountNotLinked={OAuthAccountNotLinked}
      />
    </div>
  )
}

export default LoginPage
