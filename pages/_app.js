import "@/styles/globals.css";
import { TransactionsProvider } from "../context/TransactionsContext";

export default function App({ Component, pageProps }) {
  return (
    <TransactionsProvider><Component {...pageProps} /></TransactionsProvider> 
);
}
