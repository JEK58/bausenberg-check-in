import Head from "next/head";
import { useRouter } from "next/router";
import {
  localStorageHasDataFromToday,
  saveIdToLocalStorage,
} from "@/util/local-storage";
import { ChangeEvent, useState } from "react";
import {
  badConnectionWarning,
  tooManyCheckinsWarning,
} from "@/lib/user-messages";
import { Club } from "@prisma/client";

export default function Home() {
  const [error, setError] = useState<String | undefined>();
  const [name, setName] = useState<String>();
  const [club, setClub] = useState<String | undefined>();
  const router = useRouter();

  // Check if there is an unfinished check-in of this day present
  if (typeof window !== "undefined") {
    if (localStorageHasDataFromToday()) router.push("/check-out");
  }

  // Require at least two words with a minimum of three characters for name field
  const regex = /(\w|[üäöÄÜÖß-]){3,} (\w|[üäöÄÜÖß-]){3,}/;
  const validName = name?.match(regex);

  const handleNameChange = (name: string) => setName(name);
  const handleClubChange = (club: string) => setClub(club);

  const handleSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = {
      name: name,
      club: club,
    };

    const endpoint = "/api/check-in";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    try {
      const response = await fetch(endpoint, options);

      if (response.status === 201) {
        const resData = await response.json();
        saveIdToLocalStorage(resData.id, resData.checkInDate);
        setError(undefined);
        router.push("/check-out");
      } else if (response.status === 429) setError(tooManyCheckinsWarning);
      else throw new Error("Da ist was schief gegangen");
    } catch (error) {
      setError(badConnectionWarning);
      console.log(error);
    }
  };
  return (
    <>
      <Head>
        <title>Bausenberg Check-in</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <main className="container">
        <div>
          <h3>Bausenberg Check-in</h3>

          <section>
            <form onSubmit={handleSubmit} autoComplete="off">
              <input
                id="name"
                data-testid="name-input"
                name="name"
                type="text"
                placeholder="Voller Name"
                required
                onChange={(e) => handleNameChange(e.target.value)}
              />
              <section>
                <input
                  id="btn-rml"
                  type="radio"
                  name="club"
                  value={Club.RML}
                  onChange={(e) => handleClubChange(e.target.value)}
                  checked={club === Club.RML}
                />
                <label htmlFor="btn-rml">RML</label>

                <input
                  id="btn-dgc"
                  type="radio"
                  name="club"
                  value={Club.DGC}
                  onChange={(e) => handleClubChange(e.target.value)}
                  checked={club === Club.DGC}
                />
                <label htmlFor="btn-dgc">DGC</label>
              </section>
              <button type="submit" disabled={!validName || !club}>
                Check In
              </button>
            </form>
            <div className="warning">{error}</div>
          </section>

          <section>
            <h5>Hinweis:</h5>
            <p>
              Nach dem Flug bitte wieder aus-checken und die genutzte Landewiese
              angeben. <br />
              Für jeden Flug muss ein Eintrag erstellt werden - auch wenn dieser
              am selben Tag stattfindet.
            </p>
            <p>
              Bei Problemen schicke bitte eine Mail an{" "}
              <a href="mailto:bausenberg@thermik4u.de?subject=Bausenberg Check-in">
                bausenberg@thermik4u.de
              </a>
            </p>
            <p>
              <strong>
                <a
                  href="https://www.thermik4u.de/fluggebiete/niederzissen"
                  target="_blank"
                >
                  Hinweise zum Fluggebiet
                </a>
              </strong>
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
