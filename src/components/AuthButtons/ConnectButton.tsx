import { styled } from "@mui/material";
import { useRouter } from "next/router";
import { useAppDispatch } from "src/redux/app/hooks";
import Button from "@mui/material/Button";
import { connectWallet } from "src/redux/features/web3/webSlice";

const AuthButton = styled(Button)({
  height: 35,
});

export default function () {
  const dispatch = useAppDispatch();
  const router = useRouter();
  return (
    <AuthButton
      data-testid="connectButton"
      onClick={() => dispatch(connectWallet({ router }))}
      variant="contained"
    >
      Connect
    </AuthButton>
  );
}
