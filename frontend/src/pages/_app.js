import "@/styles/globals.css";
import "semantic-ui-css/semantic.min.css";
import { AppWrapper } from "@/context/state";


const MyApp = ({ Component, pageProps }) => {
  return (
    <AppWrapper>
      <Component {...pageProps} />
    </AppWrapper>
  )
}

export default MyApp