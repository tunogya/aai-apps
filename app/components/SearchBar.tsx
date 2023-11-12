"use client";

import { Configure, InstantSearch } from "react-instantsearch";
import searchClient from "@/app/utils/searchClient";
import React from "react";
import dynamic from "next/dynamic";
import { useUser } from "@auth0/nextjs-auth0/client";

const CustomSearchBox = dynamic(
  () => import("@/app/components/CustomSearchBox"),
  {
    ssr: false,
  },
);
const CustomHits = dynamic(() => import("@/app/components/CustomHits"), {
  ssr: false,
});

const SearchBar = () => {
  const { user } = useUser();

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={"chat_search"}
      stalledSearchDelay={500}
      insights={true}
    >
      <Configure
        hitsPerPage={10}
        facets={["author"]}
        facetFilters={[`author:${user?.sub}`]}
      />
      <CustomSearchBox />
      <CustomHits />
    </InstantSearch>
  );
};

export default SearchBar;
