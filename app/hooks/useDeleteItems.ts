"use client";
import { useEffect, useState } from "react";

const useDeleteItems = () => {
  const [deleteItems, setDeleteItems] = useState<string[]>([]);

  const deleteById = (id: string) => {
    const _newDeleteItems = [...deleteItems, id];
    setDeleteItems(_newDeleteItems);
    sessionStorage.setItem("deleteItems", JSON.stringify(_newDeleteItems));
  };

  useEffect(() => {
    const items = JSON.parse(sessionStorage.getItem("deleteItems") || "[]");
    setDeleteItems(items);
  }, []);

  return {
    deleteItems,
    deleteById,
  };
};

export default useDeleteItems;
