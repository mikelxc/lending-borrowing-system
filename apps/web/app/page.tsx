import styles from "./page.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import LendingBorrowingSystem from "./LendingBorrowingSystem";
export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ConnectButton />
        <LendingBorrowingSystem />
      </main>
    </div>
  );
}
