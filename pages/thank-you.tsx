import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Bausenberg Check-in</title>
        {/* <meta name="description" content="Generated by create next app" /> */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <section>
          <h4>Danke!</h4>
          <p>
            Du kannst das Fenster nun schließen oder einen weiteren Flug
            eintragen.
          </p>
          <Link href="/">
            <button type="button">Neuer Flugbucheintrag </button>
          </Link>
        </section>
      </main>
    </>
  );
}
