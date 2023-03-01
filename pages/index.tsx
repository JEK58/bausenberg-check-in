import Head from "next/head";
import { FormEvent } from "react";
import { useRouter } from "next/router";
import { saveIdToLocalStorage } from "@/util/localStorage";

export default function Home() {
  const router = useRouter();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const data = {
      name: event.target?.name.value,
      club: event.target?.club.value,
    };

    const endpoint = "/api/check-in";

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(endpoint, options);
    console.log(response);

    if (response.status === 201) {
      const resData = await response.json();
      console.log(resData);
      saveIdToLocalStorage(resData._id, resData.checkInDate);
      router.push("/check-out");
    }
  };
  return (
    <>
      <Head>
        <title>Bausenberg Check-in</title>
        {/* <meta name="description" content="Generated by create next app" /> */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container">
        <div>
          <h3>Bausenberg Check-in</h3>

          <section>
            <form onSubmit={handleSubmit}>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Voller Name"
                required
              />
              <section>
                <input id="btn-rml" type="radio" name="club" value="RML" />
                <label htmlFor="btn-rml">RML</label>

                <input id="btn-dgc" type="radio" name="club" value="DGC" />
                <label htmlFor="btn-dgc">DGC</label>
              </section>
              <button type="submit">Check In</button>
            </form>
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
