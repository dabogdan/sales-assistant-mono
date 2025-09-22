/*global chrome*/

import { useEffect, useState } from "react";

const getStorageItem = async (key) => {
  const result = await chrome.storage.local.get([key]);
  return result[key] || [];
};

export function useTableStorage(key) {
  const [item, setItem] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const item = await getStorageItem(key);
      setItem(item);
    };
    fetchData();
  }, [key]);

  const setStorageItem = async (value) => {
    await chrome.storage.local.set({ [key]: value });
    const updatedItem = await getStorageItem(key);
    setItem(updatedItem);
  };

  return [item, setStorageItem, getStorageItem];
}
