import styles from "./page.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: 12,
          }}
        >
          <ConnectButton />
        </div>
      </main>
    </div>
  );
}
