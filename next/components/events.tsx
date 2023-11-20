import Link from "next/link";
import React, { useMemo, useState } from "react";

import { Events } from "@/lib/zod/events";

interface EventsProps {
  events: Events[];
}
const Events = ({ events }: EventsProps) => {
  if (!events) return null;

  return (
    <div className="flex gap-4 flex-wrap">
      {events.map((event) => (
        <Link
          key={event.id}
          href={event.path.alias}
          className="relative grid h-full rounded border border-finnishwinter bg-white p-4 transition-all hover:shadow-md"
        >
          <div className="p-4 w-52 h-52 rounded-md shadow-sm bg-primary-50">
            <h3>{event.title}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Events;
