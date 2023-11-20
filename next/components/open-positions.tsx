import Link from "next/link";
import React, { useMemo, useState } from "react";

import { OpenPositions } from "@/lib/zod/open-positions";

interface OpenPositionsProps {
  openPositions: OpenPositions[];
}
const OpenPositions = ({ openPositions }: OpenPositionsProps) => {
  const [offices, setOffices] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
  const [choosenOffice, setChoosenOffice] = useState<string>("all");
  const [choosenCountry, setChoosenCountry] = useState<string>("all");

  useMemo(() => {
    const offices = openPositions.map(
      (openPosition) => openPosition.field_office.name,
    );
    setOffices(offices);
  }, [openPositions]);

  useMemo(() => {
    const countries = openPositions.map(
      (openPosition) => openPosition.field_country.name,
    );
    setCountries(countries);
  }, [openPositions]);

  if (!openPositions) return null;

  const filteredPositions = openPositions.filter((openPosition) => {
    if (choosenOffice === "all" && choosenCountry === "all")
      return openPosition;
    if (choosenOffice === "all" && choosenCountry !== "all")
      return openPosition.field_country.name === choosenCountry;
    if (choosenOffice !== "all" && choosenCountry === "all")
      return openPosition.field_office.name === choosenOffice;
    return (
      openPosition.field_office.name === choosenOffice &&
      openPosition.field_country.name === choosenCountry
    );
  });

  return (
    <>
      <div className="flex gap-4 mb-4">
        <select
          onChange={(e) => {
            setChoosenOffice(e.target.value);
          }}
        >
          <option value="all">All</option>
          {offices.map((office) => (
            <option key={office} value={office}>
              {office}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => {
            setChoosenCountry(e.target.value);
          }}
        >
          <option value="all">All</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-4 flex-wrap">
        {filteredPositions.map((openPosition) => (
          <Link
            key={openPosition.id}
            href={openPosition.path.alias}
            className="relative grid h-full rounded border border-finnishwinter bg-white p-4 transition-all hover:shadow-md"
          >
            <div className="p-4 w-52 h-52 rounded-md shadow-sm bg-primary-50">
              <h3>{openPosition.title}</h3>
              <span>
                {openPosition.field_country.name},{" "}
                {openPosition.field_office.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default OpenPositions;
