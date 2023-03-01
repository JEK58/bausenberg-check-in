import Head from "next/head";
import { FormEvent, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {
  getIdFromLocalStorage,
  removeIdFromLocalStorage,
} from "@/util/localStorage";

export default function CheckOut() {
  const router = useRouter();

  let checkInId = useRef<string | undefined>();

  useEffect(() => {
    checkInId.current = getIdFromLocalStorage();
    if (!checkInId.current) router.push("/");
  }, [router]);

  const handleSubmit = async (event: FormEvent) => {
    try {
      event.preventDefault();
      const data = {
        id: checkInId.current,
        landing: event.target?.landing.value,
      };

      const endpoint = "/api/check-out";
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
        removeIdFromLocalStorage();
        router.push("/thank-you");
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
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
        <h3>Bausenberg Check-out</h3>
        <form onSubmit={handleSubmit}>
          <fieldset>
            <label htmlFor="btn-regular-landing">
              <input
                id="btn-regular-landing"
                type="radio"
                name="landing"
                value="Landewiese"
              />
              Landewiese 👌
            </label>

            <label htmlFor="btn-alternate-landing">
              <input
                id="btn-alternate-landing"
                type="radio"
                name="landing"
                value="Notlandewiese"
              />
              Notlandewiese 🧐
            </label>

            <label htmlFor="btn-xc-landing">
              <input
                id="btn-xc-landing"
                type="radio"
                name="landing"
                value="Streckenflug"
              />
              Streckenflug 🎉
            </label>

            <label htmlFor="btn-no-takeoff">
              <input
                id="btn-no-takeoff"
                type="radio"
                name="landing"
                value="Doch nicht gestartet"
              />
              Doch nicht gestartet 🤷
            </label>
          </fieldset>

          <button>Check out</button>
        </form>
      </main>
    </>
  );
}
