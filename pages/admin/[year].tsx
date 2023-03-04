import Head from "next/head";
import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";
import { FaTrashAlt } from "react-icons/fa";
import { formatDate } from "@/util/format-date";
import { format } from "date-fns";
import prisma from "@/lib/prisma";
import { useRouter } from "next/router";
import { CheckIn, Landing } from "@prisma/client";
import {
  toggleModal,
  eventListeners as modalEventListeners,
} from "@/util/modal";
import { SyntheticEvent, useEffect, useState } from "react";
import { calcStats } from "@/util/statistics";
import LoginButton from "@/components/LoginButton";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  // TODO: Validate query year
  const { year } = context.query;

  const data = await prisma.checkIn.findMany();

  // Good enough for a small set of data
  const filteredByYear = data.filter(
    (e) => format(new Date(e.checkInDate), "yyyy") == year
  );

  const currentYear = format(new Date(), "yyyy");
  const years = [currentYear];

  data.forEach((e) => {
    const year = format(new Date(e.checkInDate), "yyyy");
    if (!years.find((e) => e === year) && year != currentYear) years.push(year);
  });

  const statistics = calcStats(filteredByYear);

  return {
    props: { data: filteredByYear, years, statistics },
  };
};

export default function Admin({
  data,
  years,
  statistics,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { year } = router.query;

  // Allow to dismiss modal by ESC key etc
  useEffect(() => {
    modalEventListeners();
  }, []);

  const refreshData = () => {
    router.replace(router.asPath, undefined, { scroll: false });
  };

  // Delete entry logic
  const [entryToDelete, setEntryToDelete] = useState<CheckIn>();

  function handleOpenDeleteEntryModal(e: SyntheticEvent, entry: CheckIn) {
    e.preventDefault();
    setEntryToDelete(entry);
    toggleModal();
  }

  async function handleDeleteEntry(e: SyntheticEvent) {
    e.preventDefault();

    const endpoint = "/api/admin";
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: entryToDelete?.id }),
    };

    const response = await fetch(endpoint, options);

    if (response.status === 200) {
      const resData = await response.json();
      refreshData();
      toggleModal();
    }
  }

  function handleToggleModal(e: SyntheticEvent) {
    e.preventDefault();
    toggleModal();
  }

  function handleChangeYear(e: React.ChangeEvent<HTMLSelectElement>) {
    router.push(e.target.value, undefined, { scroll: false });
  }

  const selectableYears = years.map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ));

  function readableLanding(landing?: Landing | null) {
    switch (landing) {
      case Landing.REGULAR:
        return "Landewiese";
      case Landing.ALT:
        return "Notlandewiese";
      case Landing.XC:
        return "Streckenflug";
      case Landing.DNF:
        return "Doch nicht gestartet";
      default:
        return "";
    }
  }

  const listEntries = data.map((entry) => (
    <tr key={entry.id}>
      <td>{entry.name}</td>
      <td>{entry.club}</td>
      <td>{readableLanding(entry.landing)}</td>
      <td>{formatDate(entry.checkInDate)}</td>
      <td>{formatDate(entry.checkOutDate)}</td>
      <td>
        <a
          href="#"
          className="warning"
          onClick={(e) => handleOpenDeleteEntryModal(e, entry)}
        >
          <FaTrashAlt />
        </a>
      </td>
    </tr>
  ));

  return (
    <>
      <Head>
        <title>Bausenberg Admin Panel</title>
        {/* <meta name="description" content="Generated by create next app" /> */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <main className="container">
        <h4>Bausenberg Admin Panel</h4>
        <nav>
          <ul>
            <li>
              <h4>Statistik</h4>
            </li>
          </ul>
          <ul>
            <li>
              <select id="years" value={year} onChange={handleChangeYear}>
                {selectableYears}
              </select>
            </li>
            <li>
              <LoginButton />
            </li>
          </ul>
        </nav>
        <article>
          <h6>
            Gesamt: <strong>{data.length}</strong>
          </h6>

          <ul>
            <li>
              Landewiese: <strong>{statistics.regularLanding}</strong>
            </li>
            <li>
              Notlandewiese: <strong>{statistics.alternateLanding}</strong>
            </li>
            <li>
              Streckenflug: <strong>{statistics.xcFlight}</strong>
            </li>
            <li>
              Nicht gestartet: <strong>{statistics.didNotFly}</strong>
            </li>
            <li>
              Landung nicht gemeldet: <strong>{statistics.notReported}</strong>
            </li>
          </ul>
        </article>
        <h4>Liste</h4>
        <article>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Verein</th>
                <th>Landung</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{listEntries}</tbody>
          </table>
        </article>
        {/* Modal */}
        <dialog id="deleteEntryModal">
          <article>
            <a
              href="#"
              aria-label="Close"
              className="close"
              data-target="deleteEntryModal"
              onClick={handleToggleModal}
            ></a>
            <h4>Eintrag löschen?</h4>
            <p>{entryToDelete?.name}</p>
            <p>{formatDate(entryToDelete?.checkInDate)}</p>

            <footer>
              <a
                href="#"
                role="button"
                className="secondary"
                data-target="deleteEntryModal"
                onClick={handleToggleModal}
              >
                Abbrechen
              </a>
              <a
                href="#"
                role="button"
                data-target="deleteEntryModal"
                onClick={handleDeleteEntry}
              >
                Löschen
              </a>
            </footer>
          </article>
        </dialog>
      </main>
    </>
  );
}
