"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import posthog from "posthog-js";

const NavBar = () => {
  const handleNavClick = (destination: string) => {
    posthog.capture("nav_link_clicked", { destination });
  };

  return (
    <header>
      <nav>
        <Link href={"/"} className="logo" onClick={() => handleNavClick("/")}>
          <Image
            src={"/icons/logo.png"}
            alt="event-logo"
            width={24}
            height={24}
          />
          <p>Dev Event</p>
        </Link>
        <ul>
          <Link href={"/"} onClick={() => handleNavClick("/")}>Home</Link>
          <Link href={"/events"} onClick={() => handleNavClick("/events")}>Events</Link>
          <Link href={"/about"} onClick={() => handleNavClick("/about")}>About</Link>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
