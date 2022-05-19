import { useRouter } from "next/router";
import { FunctionComponent, useEffect } from "react";
import { useAccount } from "wagmi";

const ReroutesProvider: FunctionComponent = ({ children }) => {
  const { data: walletData } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (walletData) {
      router.push("/canvas").catch((e) => console.log(e));
    } else {
      router.push("/").catch((e) => console.log(e));
    }
  }, [walletData]);

  return <>{children}</>;
};

export default ReroutesProvider;
